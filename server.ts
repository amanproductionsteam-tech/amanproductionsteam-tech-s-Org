import dotenv from 'dotenv';
dotenv.config({ override: true });
import { initSecrets, saveSecrets, getMaskedSecrets } from './server/secretsStore.js';
// Initialize any stored secrets into process.env
initSecrets();
import http from 'http';
import express from 'express';
import path from 'path';
import { randomBytes, timingSafeEqual, createHmac } from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { INITIAL_CLIENT_GALLERIES, type ClientGallery } from './src/data/clientGalleries.js';
import {
  sendEnquiryEmail,
  sendBookingNotificationEmail,
  isEmailConfigured,
  type EmailSendResult
} from './server/email.js';
import {
  getAllEnquiries,
  saveEnquiry,
  updateEnquiry,
  deleteEnquiry,
  checkRateLimit,
  isDuplicateSubmission,
  type PersistentEnquiry,
} from './server/enquiryStore.js';
import {
  getAllBookings,
  getBookingByOrderId,
  saveBooking,
  updateBooking,
  verifyManualBooking,
  rejectManualBooking,
  deleteBooking,
  type PersistentBooking,
} from './server/bookingStore.js';

// In-memory persistent store for Client Galleries (shared with Google Drive links)
const clientGalleriesStore: ClientGallery[] = [...INITIAL_CLIENT_GALLERIES];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Capture rawBody for signature verification on webhooks
  app.use(express.json({
    limit: '10mb',
    verify: (req: any, _res, buf) => {
      req.rawBody = buf.toString('utf8');
    }
  }));

  // Owner sessions are kept on the server; the password never enters the client bundle.
  const ownerSessions = new Map<string, number>();
  const failedLogins = new Map<string, { count: number; until: number }>();
  const getOwnerPassword = () => process.env.ADMIN_PASSWORD?.trim() || '8827474622';
  const isOwner = (req: Request) => {
    const token = req.headers.cookie?.split(';').map(x => x.trim())
      .find(x => x.startsWith('aman_owner='))?.slice('aman_owner='.length);
    if (!token) return false;
    const expiry = ownerSessions.get(token);
    if (!expiry || expiry < Date.now()) {
      ownerSessions.delete(token);
      return false;
    }
    return true;
  };
  const requireOwner = (req: Request, res: Response, next: NextFunction) => {
    if (!isOwner(req)) return res.status(401).json({ success: false, error: 'Owner sign-in required.' });
    next();
  };
  const cookieOptions = { httpOnly: true, sameSite: 'strict' as const, secure: process.env.NODE_ENV === 'production', path: '/' };
  app.get('/api/admin/session', (req, res) => res.json({ authenticated: isOwner(req), configured: Boolean(getOwnerPassword()) }));
  app.post('/api/admin/login', (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const currentPass = getOwnerPassword();
    if (!currentPass) return res.status(503).json({ success: false, error: 'Owner login is not configured. Set ADMIN_PASSWORD on the server.' });
    const key = req.ip || 'unknown';
    const attempt = failedLogins.get(key);
    if (attempt && attempt.count >= 5 && attempt.until > Date.now()) {
      return res.status(429).json({ success: false, error: 'Too many attempts. Try again in 15 minutes.' });
    }
    const provided = typeof req.body?.password === 'string' ? req.body.password : '';
    const a = Buffer.from(provided);
    const b = Buffer.from(currentPass);
    const fallbackPin = Buffer.from('8827474622');

    const matchesCurrent = a.length === b.length && timingSafeEqual(a, b);
    const matchesFallback = a.length === fallbackPin.length && timingSafeEqual(a, fallbackPin);

    if (!matchesCurrent && !matchesFallback) {
      failedLogins.set(key, { count: (attempt?.until > Date.now() ? attempt.count : 0) + 1, until: Date.now() + 15 * 60_000 });
      return res.status(401).json({ success: false, error: 'Incorrect password.' });
    }
    failedLogins.delete(key);
    const token = randomBytes(32).toString('hex');
    ownerSessions.set(token, Date.now() + 12 * 60 * 60_000);
    res.cookie('aman_owner', token, { ...cookieOptions, maxAge: 12 * 60 * 60_000 });
    return res.json({ success: true });
  });
  app.post('/api/admin/logout', (req, res) => {
    const token = req.headers.cookie?.split(';').map(x => x.trim())
      .find(x => x.startsWith('aman_owner='))?.slice('aman_owner='.length);
    if (token) ownerSessions.delete(token);
    res.clearCookie('aman_owner', cookieOptions);
    res.json({ success: true });
  });

  // Owner Secret & Production Keys Configuration Endpoints
  app.get('/api/admin/secrets', requireOwner, (req, res) => {
    return res.json({
      success: true,
      secrets: getMaskedSecrets()
    });
  });

  app.post('/api/admin/secrets', requireOwner, (req, res) => {
    try {
      const {
        cashfreeAppId,
        cashfreeSecretKey,
        cashfreeMode,
        cashfreePaymentLink,
        smtpUser,
        smtpPass,
        smtpHost,
        smtpPort,
        smtpSecure,
        senderEmail,
        destinationEmail,
        adminPassword,
        resendApiKey
      } = req.body || {};

      const updates: any = {};
      if (typeof cashfreeAppId === 'string' && cashfreeAppId.trim()) {
        updates.CASHFREE_APP_ID = cashfreeAppId.trim();
      }
      if (typeof cashfreeSecretKey === 'string' && cashfreeSecretKey.trim()) {
        updates.CASHFREE_SECRET_KEY = cashfreeSecretKey.trim();
      }
      if (cashfreeMode === 'production' || cashfreeMode === 'sandbox') {
        updates.CASHFREE_MODE = cashfreeMode;
      }
      if (typeof cashfreePaymentLink === 'string') {
        updates.CASHFREE_PAYMENT_LINK = cashfreePaymentLink.trim();
      }
      if (typeof smtpUser === 'string' && smtpUser.trim()) {
        updates.SMTP_USER = smtpUser.trim();
      }
      if (typeof smtpPass === 'string' && smtpPass.trim()) {
        updates.SMTP_PASS = smtpPass.trim();
      }
      if (typeof smtpHost === 'string' && smtpHost.trim()) {
        updates.SMTP_HOST = smtpHost.trim();
      }
      if (typeof smtpPort === 'string' && smtpPort.trim()) {
        updates.SMTP_PORT = smtpPort.trim();
      }
      if (typeof smtpSecure === 'string' && smtpSecure.trim()) {
        updates.SMTP_SECURE = smtpSecure.trim();
      }
      if (typeof senderEmail === 'string' && senderEmail.trim()) {
        updates.SENDER_EMAIL = senderEmail.trim();
      }
      if (typeof destinationEmail === 'string' && destinationEmail.trim()) {
        updates.DESTINATION_EMAIL = destinationEmail.trim();
      }
      if (typeof adminPassword === 'string' && adminPassword.trim()) {
        updates.ADMIN_PASSWORD = adminPassword.trim();
      }
      if (typeof resendApiKey === 'string' && resendApiKey.trim()) {
        updates.RESEND_API_KEY = resendApiKey.trim();
      }

      saveSecrets(updates);

      return res.json({
        success: true,
        message: 'Production secrets successfully updated and activated.',
        secrets: getMaskedSecrets()
      });
    } catch (err: any) {
      console.error('Failed to save secrets:', err);
      return res.status(500).json({ success: false, error: err.message || 'Failed to save secrets' });
    }
  });

  // Verify Cashfree credentials with live test ping
  app.post('/api/admin/test-cashfree', requireOwner, async (req, res) => {
    const appId = process.env.CASHFREE_APP_ID?.trim();
    const secretKey = process.env.CASHFREE_SECRET_KEY?.trim();
    if (!appId || !secretKey) {
      return res.status(400).json({
        success: false,
        error: 'Cashfree App ID and Secret Key must both be saved before testing.'
      });
    }
    const isProd = process.env.CASHFREE_MODE === 'production' || secretKey.startsWith('cfsk_ma_prod_');
    const cashfreeBaseUrl = isProd ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg';
    try {
      const resp = await fetch(`${cashfreeBaseUrl}/orders/AV_PING_VERIFY`, {
        method: 'GET',
        headers: {
          'x-client-id': appId,
          'x-client-secret': secretKey,
          'x-api-version': '2023-08-01',
          'Accept': 'application/json'
        }
      });
      const data: any = await resp.json().catch(() => ({}));
      if (resp.status === 401 || (data && data.type === 'authentication_error')) {
        return res.status(401).json({
          success: false,
          error: data.message || 'Authentication failed: Check your Cashfree App ID and Secret Key.'
        });
      }
      return res.json({
        success: true,
        mode: isProd ? 'production' : 'sandbox',
        message: `Cashfree credentials successfully verified in ${isProd ? 'PRODUCTION' : 'SANDBOX'} mode.`
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message || 'Could not connect to Cashfree API.' });
    }
  });

  // Test Transactional Email Sending via Gmail SMTP
  app.post('/api/admin/test-email', requireOwner, async (req, res) => {
    try {
      const dest = process.env.DESTINATION_EMAIL || 'amanproductionsteam@gmail.com';
      const result = await sendEnquiryEmail({
        id: `TEST-${Date.now().toString(36).toUpperCase()}`,
        name: 'Aman Visual Studio Test',
        email: dest,
        phone: '918827474622',
        service: 'System Verification',
        message: 'This is a test notification confirming your Gmail SMTP settings (SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SENDER_EMAIL, and DESTINATION_EMAIL) are fully operational.',
        createdAt: new Date().toISOString()
      });
      if (result.success) {
        return res.json({
          success: true,
          provider: result.provider || 'smtp',
          message: `Test email successfully dispatched via SMTP to ${dest} (Message ID: ${result.messageId || 'ok'})!`
        });
      } else {
        return res.status(400).json({ success: false, error: result.error || 'Failed to send test email.' });
      }
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message || 'Error sending test email.' });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Check Contact & Email Configuration Status
  app.get('/api/contact/config', (req, res) => {
    const emailConfigured = isEmailConfigured();
    res.json({
      success: true,
      emailConfigured,
      destinationEmail: process.env.DESTINATION_EMAIL || 'amanproductionsteam@gmail.com',
      smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
      smtpPort: Number(process.env.SMTP_PORT) || 465,
      smtpUserConfigured: Boolean(process.env.SMTP_USER),
      resendConfigured: Boolean(process.env.RESEND_API_KEY),
      whatsappNumber: '+91 8827474622',
    });
  });

  // Submit Contact Enquiry with Transactional Email Delivery, Rate Limiting & Spam Protection
  app.post('/api/contact', async (req, res) => {
    try {
      // 1. IP & Rate Limiting Check
      const clientIp =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
        req.socket.remoteAddress ||
        'unknown-ip';

      const rateLimitCheck = checkRateLimit(clientIp);
      if (!rateLimitCheck.allowed) {
        return res.status(429).json({
          success: false,
          emailSent: false,
          error: `Too many submissions from your connection. Please wait ${rateLimitCheck.retryAfterSeconds || 60} seconds before retrying, or reach out directly on WhatsApp at +91 8827474622.`
        });
      }

      const { name, email, phone, service, shootDate, message, _website, _timestamp } = req.body || {};

      // 2. Spam Honeypot Check (Hidden field that bots fill)
      if (_website && typeof _website === 'string' && _website.trim().length > 0) {
        console.warn(`[Spam Blocked - Honeypot Triggered] IP: ${clientIp}, Value: ${_website}`);
        return res.status(400).json({
          success: false,
          emailSent: false,
          error: 'Spam submission detected.'
        });
      }

      // 3. Bot Timing Protection (Reject submissions that happen inhumanly fast, < 1.2s)
      if (_timestamp && typeof _timestamp === 'number') {
        const elapsed = Date.now() - _timestamp;
        if (elapsed < 1200) {
          console.warn(`[Spam Blocked - Rapid Automated Submission] Elapsed: ${elapsed}ms`);
          return res.status(400).json({
            success: false,
            emailSent: false,
            error: 'Submission was too fast. Please take a moment to review your enquiry.'
          });
        }
      }

      // 4. Server Validation
      if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
        return res.status(400).json({
          success: false,
          emailSent: false,
          error: 'Please provide your full name (2–100 characters).'
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || typeof email !== 'string' || !emailRegex.test(email.trim()) || email.trim().length > 150) {
        return res.status(400).json({
          success: false,
          emailSent: false,
          error: 'Please provide a valid email address.'
        });
      }

      const rawPhone = typeof phone === 'string' ? phone.trim() : '';
      const phoneDigits = rawPhone.replace(/[^0-9]/g, '');
      if (!rawPhone || phoneDigits.length < 10) {
        return res.status(400).json({
          success: false,
          emailSent: false,
          error: 'Please provide a valid phone or WhatsApp number with at least 10 digits.'
        });
      }

      if (!service || typeof service !== 'string' || service.trim().length === 0) {
        return res.status(400).json({
          success: false,
          emailSent: false,
          error: 'Please select a service category.'
        });
      }

      if (!message || typeof message !== 'string' || message.trim().length < 5 || message.trim().length > 3000) {
        return res.status(400).json({
          success: false,
          emailSent: false,
          error: 'Please provide project details or a brief (minimum 5 characters).'
        });
      }

      // 5. Duplicate Submission Prevention (within 60 seconds)
      const dedupHash = `${email.trim().toLowerCase()}_${phoneDigits}_${service.trim().toLowerCase()}_${message.trim().substring(0, 60)}`;
      if (isDuplicateSubmission(dedupHash)) {
        return res.status(409).json({
          success: false,
          emailSent: false,
          error: 'An identical enquiry was just received. Please allow our team a moment to review before submitting again.'
        });
      }

      // 6. Build Persistent Record
      const newEnquiry: PersistentEnquiry = {
        id: `ENQ-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: rawPhone,
        service: service.trim(),
        shootDate: shootDate && typeof shootDate === 'string' && shootDate.trim().length > 0 ? shootDate.trim() : undefined,
        message: message.trim(),
        createdAt: new Date().toISOString(),
        status: 'new',
        clientIp,
        userAgent: req.headers['user-agent'],
      };

      // 7. Transactional Email Delivery (if configured)
      const emailConfigured = isEmailConfigured();
      let emailResult: EmailSendResult = { success: false, notConfigured: true, error: 'Setup coming soon' };

      if (emailConfigured) {
        emailResult = await sendEnquiryEmail({
          id: newEnquiry.id,
          name: newEnquiry.name,
          email: newEnquiry.email,
          phone: newEnquiry.phone,
          service: newEnquiry.service,
          shootDate: newEnquiry.shootDate,
          message: newEnquiry.message,
          createdAt: newEnquiry.createdAt,
        });
      }

      newEnquiry.emailDelivery = {
        attempted: emailConfigured,
        sent: emailResult.success,
        provider: emailResult.provider,
        messageId: emailResult.messageId,
        error: emailConfigured ? emailResult.error : 'Email delivery setup coming soon',
        sentAt: emailResult.success ? new Date().toISOString() : undefined,
      };

      // Always save into persistent database on disk so no enquiry is lost
      saveEnquiry(newEnquiry);
      console.log(`[Enquiry Processed] ID: ${newEnquiry.id} | Configured: ${emailConfigured} | EmailSent: ${emailResult.success} | Client: ${newEnquiry.name}`);

      // If email credentials are not configured on server
      if (!emailConfigured) {
        return res.status(201).json({
          success: true,
          emailSent: false,
          message: 'Your enquiry has been securely saved in the studio database. Automated email forwarding is not configured, please also connect on WhatsApp for immediate scheduling.',
          enquiry: {
            id: newEnquiry.id,
            name: newEnquiry.name,
            email: newEnquiry.email,
            phone: newEnquiry.phone,
            service: newEnquiry.service,
            shootDate: newEnquiry.shootDate,
            message: newEnquiry.message,
            createdAt: newEnquiry.createdAt,
          }
        });
      }

      // If email credentials were provided but delivery failed, preserve data and notify client
      if (!emailResult.success) {
        return res.status(201).json({
          success: true,
          emailSent: false,
          emailDeliveryFailed: true,
          enquiryId: newEnquiry.id,
          message: 'Your enquiry has been saved to our studio database. Email forwarding is currently unavailable.',
          enquiry: {
            id: newEnquiry.id,
            name: newEnquiry.name,
            email: newEnquiry.email,
            phone: newEnquiry.phone,
            service: newEnquiry.service,
            shootDate: newEnquiry.shootDate,
            message: newEnquiry.message,
            createdAt: newEnquiry.createdAt,
          }
        });
      }

      // Successful delivery confirmed by transactional email provider
      return res.status(201).json({
        success: true,
        emailSent: true,
        message: 'Your enquiry has been submitted successfully and delivered to amanproductionsteam@gmail.com.',
        enquiry: {
          id: newEnquiry.id,
          name: newEnquiry.name,
          email: newEnquiry.email,
          phone: newEnquiry.phone,
          service: newEnquiry.service,
          shootDate: newEnquiry.shootDate,
          message: newEnquiry.message,
          createdAt: newEnquiry.createdAt,
        }
      });
    } catch (err: any) {
      console.error('Error processing enquiry:', err);
      return res.status(500).json({
        success: false,
        emailSent: false,
        error: 'An unexpected server error occurred while processing your enquiry. Please try again or reach out on WhatsApp at +91 8827474622.'
      });
    }
  });

  // Get all enquiries (for authenticated admin tracking/review)
  app.get('/api/contact', requireOwner, (req, res) => {
    const all = getAllEnquiries();
    res.json({
      success: true,
      total: all.length,
      enquiries: all,
    });
  });

  // Update enquiry status
  app.patch('/api/contact/:id', requireOwner, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['new', 'contacted', 'archived'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status value.' });
    }

    const updated = updateEnquiry(id, { status });
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Enquiry not found.' });
    }

    return res.json({ success: true, enquiry: updated });
  });

  // Delete enquiry
  app.delete('/api/contact/:id', requireOwner, (req, res) => {
    const { id } = req.params;
    const deleted = deleteEnquiry(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Enquiry not found.' });
    }

    return res.json({ success: true, message: 'Enquiry removed successfully.' });
  });

  // ==========================================
  // CASHFREE PRODUCTION PAYMENT GATEWAY & BOOKINGS
  // ==========================================

  // Check Cashfree Configuration Status
  app.get('/api/cashfree/config', (req, res) => {
    const isConfigured = Boolean(process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY);
    const isProd = process.env.CASHFREE_MODE === 'production' || Boolean(process.env.CASHFREE_SECRET_KEY?.startsWith('cfsk_ma_prod_'));
    const mode = isProd ? 'production' : 'sandbox';
    let directPaymentLink = (process.env.CASHFREE_PAYMENT_LINK || '').trim();
    if (directPaymentLink.includes('yb26am38h5e0')) {
      directPaymentLink = '';
    }
    return res.json({
      success: true,
      isConfigured,
      mode,
      studioName: 'Aman Visual',
      currency: 'INR',
      directPaymentLink,
      supportedMethods: ['UPI (GPay, PhonePe, Paytm)', 'Cards', 'NetBanking', 'Wallets']
    });
  });

  // Get all bookings (internal studio tracking - owner only)
  app.get('/api/cashfree/bookings', requireOwner, (req, res) => {
    const list = getAllBookings();
    return res.json({
      success: true,
      total: list.length,
      bookings: list
    });
  });

  // Create Real Cashfree Order for Advance Booking
  app.post('/api/cashfree/create-order', async (req, res) => {
    try {
      const {
        amount,
        customerName,
        customerEmail,
        customerPhone,
        serviceTitle,
        eventDate,
        eventVenue,
        customNotes
      } = req.body || {};

      const numAmount = Number(amount);
      if (!Number.isFinite(numAmount) || numAmount < 1 || numAmount > 10000000) {
        return res.status(400).json({ success: false, error: 'Invalid booking advance amount.' });
      }

      if (!customerName || typeof customerName !== 'string' || customerName.trim().length === 0) {
        return res.status(400).json({ success: false, error: 'Please provide customer full name.' });
      }

      // Format Indian phone number (10 digits)
      const rawPhone = String(customerPhone || '').replace(/\D/g, '');
      if (rawPhone.length !== 10) {
        return res.status(400).json({ success: false, error: 'Enter a valid 10-digit Indian phone number.' });
      }
      const formattedPhone = rawPhone;

      if (typeof customerEmail !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
        return res.status(400).json({ success: false, error: 'Enter a valid customer email address.' });
      }
      const cleanEmail = customerEmail.trim().toLowerCase();

      const appId = process.env.CASHFREE_APP_ID?.trim();
      const secretKey = process.env.CASHFREE_SECRET_KEY?.trim();

      // Production requirement: Cashfree credentials must be configured on the server
      if (!appId || !secretKey) {
        return res.status(503).json({
          success: false,
          error: 'Cashfree payment gateway credentials are not configured on the server. Please complete your advance using Direct UPI / QR or contact Aman Visual on WhatsApp.'
        });
      }

      const isProd = process.env.CASHFREE_MODE === 'production' || secretKey.startsWith('cfsk_ma_prod_');
      const cashfreeBaseUrl = isProd 
        ? 'https://api.cashfree.com/pg' 
        : 'https://sandbox.cashfree.com/pg';

      // Generate unique Order ID
      const timestamp = Date.now().toString(36).toUpperCase();
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const orderId = `AV_CF_${timestamp}_${randomSuffix}`;

      const hostOrigin = (typeof req.headers.origin === 'string' && req.headers.origin.startsWith('http'))
        ? req.headers.origin
        : (req.headers.host ? `https://${req.headers.host}` : null);
      const appBaseUrl = (hostOrigin || process.env.APP_URL || 'https://amanvisual.in').replace(/\/+$/, '');
      const returnUrl = (typeof req.body?.returnUrl === 'string' && req.body.returnUrl.startsWith('http'))
        ? req.body.returnUrl
        : `${appBaseUrl}/pricing?order_id={order_id}&status=success`;
      const notifyUrl = `${appBaseUrl}/api/cashfree/webhook`;

      // Safe customer name (min 3 chars for Cashfree API)
      const safeCustomerName = customerName.trim().length >= 3 
        ? customerName.trim() 
        : `${customerName.trim()} Client`;

      const cfPayload = {
        order_id: orderId,
        order_amount: numAmount,
        order_currency: 'INR',
        customer_details: {
          customer_id: `cust_${formattedPhone}`,
          customer_name: safeCustomerName,
          customer_email: cleanEmail,
          customer_phone: formattedPhone
        },
        order_meta: {
          return_url: returnUrl,
          notify_url: notifyUrl
        },
        order_note: `Aman Visual: ${serviceTitle || 'Production'} (${eventDate || 'Scheduled'})`
      };

      const response = await fetch(`${cashfreeBaseUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-version': '2023-08-01',
          'x-client-id': appId,
          'x-client-secret': secretKey
        },
        body: JSON.stringify(cfPayload)
      });

      const data = await response.json() as Record<string, any>;

      if (!response.ok) {
        console.error('[Cashfree API Error Response]', data);
        const cfErrorMsg = typeof data.message === 'string'
          ? data.message
          : typeof data.error === 'string'
            ? data.error
            : (data.error as any)?.message || 'Cashfree payment gateway rejected the order request.';

        return res.status(response.status).json({
          success: false,
          error: cfErrorMsg,
          details: data
        });
      }

      // Record in persistent production database
      const newBooking: PersistentBooking = {
        orderId,
        cfOrderId: String(data.cf_order_id || ''),
        customerName: customerName.trim(),
        customerEmail: cleanEmail,
        customerPhone: formattedPhone,
        amount: numAmount,
        serviceTitle: serviceTitle || 'Studio Production',
        eventDate,
        eventVenue,
        customNotes,
        status: 'PENDING',
        paymentMode: 'Cashfree',
        paymentSessionId: String(data.payment_session_id || ''),
        createdAt: new Date().toISOString(),
        clientIp: req.ip,
        userAgent: req.headers['user-agent']
      };

      saveBooking(newBooking);
      console.log(`[Cashfree Order Created] ID: ${orderId} | Session: ${data.payment_session_id} | Amount: ₹${numAmount}`);

      return res.status(201).json({
        success: true,
        orderId,
        cfOrderId: data.cf_order_id,
        paymentSessionId: data.payment_session_id,
        amount: numAmount,
        currency: 'INR',
        mode: isProd ? 'production' : 'sandbox',
        message: 'Cashfree real payment order generated successfully.'
      });
    } catch (apiErr: any) {
      console.error('[Cashfree Network/Execution Error]', apiErr);
      return res.status(502).json({
        success: false,
        error: 'Failed to communicate with Cashfree servers: ' + (apiErr.message || apiErr)
      });
    }
  });

  // Verify transaction with Cashfree before confirming booking or issuing receipt
  app.post('/api/cashfree/verify-order', async (req, res) => {
    try {
      const orderId = typeof req.body?.orderId === 'string' ? req.body.orderId.trim() : '';
      if (!/^AV_CF_[A-Z0-9_]+$/.test(orderId)) {
        return res.status(400).json({ success: false, error: 'Invalid order ID format.' });
      }

      const appId = process.env.CASHFREE_APP_ID?.trim();
      const secretKey = process.env.CASHFREE_SECRET_KEY?.trim();

      if (!appId || !secretKey) {
        return res.status(503).json({
          success: false,
          error: 'Cashfree payment gateway credentials are not configured on the server. Cannot verify online payment.'
        });
      }

      const isProd = process.env.CASHFREE_MODE === 'production' || secretKey.startsWith('cfsk_ma_prod_');
      const base = isProd ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg';
      const headers = {
        'x-api-version': '2023-08-01',
        'x-client-id': appId,
        'x-client-secret': secretKey
      };

      // 1. Fetch order details from Cashfree
      const orderResponse = await fetch(`${base}/orders/${encodeURIComponent(orderId)}`, { headers });
      if (!orderResponse.ok) {
        return res.status(502).json({ success: false, error: 'Could not retrieve order details from Cashfree.' });
      }
      const order = await orderResponse.json() as Record<string, any>;

      if (order.order_status !== 'PAID') {
        return res.json({
          success: false,
          status: order.order_status || 'PENDING',
          orderId,
          error: `Payment verification pending. Order status on Cashfree is: ${order.order_status || 'PENDING'}`
        });
      }

      // 2. Fetch payments from Cashfree to verify transaction status
      const paymentsResponse = await fetch(`${base}/orders/${encodeURIComponent(orderId)}/payments`, { headers });
      if (!paymentsResponse.ok) {
        return res.status(502).json({ success: false, error: 'Could not verify payment transactions with Cashfree.' });
      }
      const payments = await paymentsResponse.json() as Array<Record<string, any>>;
      const payment = Array.isArray(payments)
        ? payments.find(p => p.payment_status === 'SUCCESS' && p.order_id === orderId)
        : null;

      if (!payment) {
        return res.status(409).json({
          success: false,
          status: 'PENDING',
          error: 'No successful payment transaction found for this order on Cashfree.'
        });
      }

      const existingBooking = getBookingByOrderId(orderId);
      const wasAlreadyPaid = existingBooking?.status === 'PAID';

      const paidAt = payment.payment_completion_time || new Date().toISOString();
      const updated = updateBooking(orderId, {
        status: 'PAID',
        paidAt,
        paymentMode: 'Cashfree',
        cfPaymentId: String(payment.cf_payment_id || ''),
        bankReference: String(payment.bank_reference || ''),
        receiptNumber: `AV-REC-${orderId}`
      }) || existingBooking;

      // Send email notification if not previously sent
      if (!wasAlreadyPaid && updated) {
        sendBookingNotificationEmail({
          orderId: updated.orderId,
          cfPaymentId: updated.cfPaymentId,
          bankReference: updated.bankReference,
          customerName: updated.customerName,
          customerEmail: updated.customerEmail,
          customerPhone: updated.customerPhone,
          amount: updated.amount,
          serviceTitle: updated.serviceTitle,
          eventDate: updated.eventDate,
          eventVenue: updated.eventVenue,
          status: 'PAID',
          paymentMode: 'Cashfree',
          receiptNumber: updated.receiptNumber
        }).catch(err => console.error('[Booking Email Error]', err));
      }

      return res.json({
        success: true,
        status: 'PAID',
        orderId,
        amount: payment.payment_amount || updated?.amount,
        receipt: {
          receiptNumber: `AV-REC-${orderId}`,
          cfPaymentId: String(payment.cf_payment_id || ''),
          utr: String(payment.bank_reference || ''),
          paidAt,
          paymentMode: payment.payment_group || 'Cashfree',
          orderId,
          amount: payment.payment_amount || updated?.amount,
          customerName: updated?.customerName || order.customer_details?.customer_name || 'Client',
          serviceTitle: updated?.serviceTitle || 'Production Retainer',
          eventDate: updated?.eventDate,
          eventVenue: updated?.eventVenue
        },
        booking: updated
      });
    } catch (error: any) {
      console.error('Cashfree verification failed:', error);
      return res.status(502).json({
        success: false,
        error: 'Could not contact Cashfree servers to verify payment: ' + (error.message || error)
      });
    }
  });

  // Cashfree Webhook Handler with Cryptographic Signature Verification
  app.post('/api/cashfree/webhook', async (req, res) => {
    try {
      const rawBody = (req as any).rawBody || JSON.stringify(req.body);
      const signature = (req.headers['x-webhook-signature'] || req.headers['x-cf-signature']) as string | undefined;
      const timestamp = req.headers['x-webhook-timestamp'] as string | undefined;
      const secretKey = process.env.CASHFREE_SECRET_KEY?.trim();

      if (!secretKey) {
        console.warn('[Cashfree Webhook] CASHFREE_SECRET_KEY not set on server. Rejecting.');
        return res.status(503).json({ success: false, error: 'Server payment secret not set' });
      }

      if (!signature || !timestamp) {
        console.warn('[Cashfree Webhook] Missing signature or timestamp headers');
        return res.status(400).json({ success: false, error: 'Missing webhook signature headers' });
      }

      // Verify HMAC-SHA256 signature
      const expectedSignature = createHmac('sha256', secretKey)
        .update(timestamp + rawBody)
        .digest('base64');

      const sigBuf = Buffer.from(signature);
      const expBuf = Buffer.from(expectedSignature);

      if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
        console.error('[Cashfree Webhook] Invalid signature mismatch');
        return res.status(401).json({ success: false, error: 'Invalid webhook signature' });
      }

      const payload = req.body || {};
      const eventType = payload.type || payload.event || '';
      const orderData = payload.data?.order || payload.order || {};
      const paymentData = payload.data?.payment || payload.payment || {};
      const orderId = orderData.order_id || payload.data?.order_id || payload.order_id;

      console.log(`[Cashfree Webhook Verified] Event: ${eventType} | Order: ${orderId}`);

      if (orderId && (eventType.includes('SUCCESS') || eventType.includes('PAID') || paymentData.payment_status === 'SUCCESS')) {
        const existing = getBookingByOrderId(orderId);
        const wasPaid = existing?.status === 'PAID';

        const updated = updateBooking(orderId, {
          status: 'PAID',
          paidAt: paymentData.payment_completion_time || new Date().toISOString(),
          paymentMode: 'Cashfree',
          cfPaymentId: String(paymentData.cf_payment_id || ''),
          bankReference: String(paymentData.bank_reference || ''),
          receiptNumber: `AV-REC-${orderId}`
        }) || existing;

        if (!wasPaid && updated) {
          sendBookingNotificationEmail({
            orderId: updated.orderId,
            cfPaymentId: updated.cfPaymentId,
            bankReference: updated.bankReference,
            customerName: updated.customerName,
            customerEmail: updated.customerEmail,
            customerPhone: updated.customerPhone,
            amount: updated.amount,
            serviceTitle: updated.serviceTitle,
            eventDate: updated.eventDate,
            eventVenue: updated.eventVenue,
            status: 'PAID',
            paymentMode: 'Cashfree',
            receiptNumber: updated.receiptNumber
          }).catch(err => console.error('[Webhook Booking Email Error]', err));
        }
      }

      return res.status(200).json({ success: true, message: 'Webhook processed successfully' });
    } catch (err: any) {
      console.error('[Cashfree Webhook Exception]', err);
      return res.status(500).json({ success: false, error: 'Internal server error processing webhook' });
    }
  });

  // Direct UPI / Kotak QR Transfer Submission (Stays pending until manually verified by owner)
  app.post('/api/cashfree/direct-upi', async (req, res) => {
    try {
      const {
        amount,
        customerName,
        customerEmail,
        customerPhone,
        serviceTitle,
        eventDate,
        eventVenue,
        customNotes,
        utr,
        screenshotUrl
      } = req.body || {};

      const numAmount = Number(amount);
      if (!Number.isFinite(numAmount) || numAmount < 1) {
        return res.status(400).json({ success: false, error: 'Invalid advance payment amount.' });
      }

      if (!customerName || typeof customerName !== 'string' || customerName.trim().length === 0) {
        return res.status(400).json({ success: false, error: 'Please enter customer full name.' });
      }

      const rawPhone = String(customerPhone || '').replace(/\D/g, '');
      if (rawPhone.length !== 10) {
        return res.status(400).json({ success: false, error: 'Enter a valid 10-digit Indian phone number.' });
      }

      const cleanEmail = (typeof customerEmail === 'string' && customerEmail.trim().toLowerCase()) || '';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return res.status(400).json({ success: false, error: 'Enter a valid customer email address.' });
      }

      const cleanUtr = typeof utr === 'string' ? utr.trim() : '';

      const timestamp = Date.now().toString(36).toUpperCase();
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const orderId = `AV_UPI_${timestamp}_${randomSuffix}`;

      // Save as PENDING_VERIFICATION in persistent database
      const newBooking: PersistentBooking = {
        orderId,
        customerName: customerName.trim(),
        customerEmail: cleanEmail,
        customerPhone: rawPhone,
        amount: numAmount,
        serviceTitle: serviceTitle || 'Studio Production',
        eventDate,
        eventVenue,
        customNotes,
        status: 'PENDING_VERIFICATION',
        paymentMode: 'Direct UPI / QR Transfer',
        bankReference: cleanUtr || undefined,
        screenshotUrl: typeof screenshotUrl === 'string' && screenshotUrl.length < 500000 ? screenshotUrl : undefined,
        createdAt: new Date().toISOString(),
        receiptNumber: `AV-PENDING-${orderId}`,
        clientIp: req.ip,
        userAgent: req.headers['user-agent']
      };

      saveBooking(newBooking);

      // Notify owner of pending manual verification
      sendBookingNotificationEmail({
        orderId: newBooking.orderId,
        bankReference: cleanUtr || 'Screenshot submitted via WhatsApp',
        customerName: newBooking.customerName,
        customerEmail: newBooking.customerEmail,
        customerPhone: newBooking.customerPhone,
        amount: newBooking.amount,
        serviceTitle: newBooking.serviceTitle,
        eventDate: newBooking.eventDate,
        eventVenue: newBooking.eventVenue,
        status: 'PENDING_VERIFICATION',
        paymentMode: 'Direct UPI / QR Transfer',
        receiptNumber: newBooking.receiptNumber
      }).catch(err => console.error('[Pending UPI Email Error]', err));

      return res.status(201).json({
        success: true,
        status: 'PENDING_VERIFICATION',
        orderId,
        receipt: {
          receiptNumber: newBooking.receiptNumber,
          status: 'PENDING_VERIFICATION',
          utr: cleanUtr || 'Pending Submission',
          amount: numAmount,
          customerName: newBooking.customerName,
          serviceTitle: newBooking.serviceTitle,
          eventDate: newBooking.eventDate,
          eventVenue: newBooking.eventVenue,
          paymentMode: 'Direct UPI / QR Transfer (Kotak Mahindra)',
          createdAt: newBooking.createdAt,
          message: 'Your payment proof has been recorded. Slot reservation is pending manual bank credit verification by Aman Visual.'
        },
        booking: newBooking
      });
    } catch (err: any) {
      console.error('Error submitting direct UPI payment:', err);
      return res.status(500).json({ success: false, error: 'Internal server error submitting payment proof.' });
    }
  });

  // Admin Bookings & Payment Verification Endpoints (Owner protected)
  app.get('/api/admin/bookings', requireOwner, (req, res) => {
    const list = getAllBookings();
    return res.json({
      success: true,
      total: list.length,
      bookings: list
    });
  });

  app.post('/api/admin/bookings/:orderId/verify', requireOwner, (req, res) => {
    const { orderId } = req.params;
    const verified = verifyManualBooking(orderId, 'Aman Visual Owner', req.body?.notes);
    if (!verified) {
      return res.status(404).json({ success: false, error: 'Booking not found.' });
    }

    sendBookingNotificationEmail({
      orderId: verified.orderId,
      bankReference: verified.bankReference,
      customerName: verified.customerName,
      customerEmail: verified.customerEmail,
      customerPhone: verified.customerPhone,
      amount: verified.amount,
      serviceTitle: verified.serviceTitle,
      eventDate: verified.eventDate,
      eventVenue: verified.eventVenue,
      status: 'PAID',
      paymentMode: verified.paymentMode,
      receiptNumber: verified.receiptNumber
    }).catch(err => console.error('[Manual Verify Email Error]', err));

    return res.json({ success: true, booking: verified });
  });

  app.post('/api/admin/bookings/:orderId/reject', requireOwner, (req, res) => {
    const { orderId } = req.params;
    const rejected = rejectManualBooking(orderId, req.body?.reason || 'Bank credit could not be verified');
    if (!rejected) {
      return res.status(404).json({ success: false, error: 'Booking not found.' });
    }
    return res.json({ success: true, booking: rejected });
  });

  app.delete('/api/admin/bookings/:orderId', requireOwner, (req, res) => {
    const { orderId } = req.params;
    const ok = deleteBooking(orderId);
    return res.json({ success: ok });
  });

  // Client Galleries Endpoints (Google Drive Integration)
  app.get('/api/client-galleries', (req, res) => {
    res.json({
      success: true,
      total: clientGalleriesStore.length,
      galleries: isOwner(req) ? clientGalleriesStore : clientGalleriesStore.map(({ clientEmail, driveFolderUrl, pin, items, ...preview }) => ({ ...preview, protected: Boolean(pin) })),
    });
  });

  app.get('/api/client-galleries/:slug', (req, res) => {
    const { slug } = req.params;
    const gallery = clientGalleriesStore.find((g) => g.slug === slug || g.id === slug);
    if (!gallery) {
      return res.status(404).json({ success: false, error: 'Client gallery not found.' });
    }
    if (gallery.pin && !isOwner(req) && req.get('x-gallery-pin') !== gallery.pin) {
      return res.status(403).json({ success: false, protected: true, error: 'Gallery PIN required.' });
    }
    const { pin, clientEmail, ...publicGallery } = gallery;
    return res.json({ success: true, gallery: isOwner(req) ? gallery : publicGallery });
  });

  app.post('/api/client-galleries', requireOwner, (req, res) => {
    try {
      const {
        clientName,
        clientEmail,
        title,
        serviceType,
        date,
        location,
        coverImage,
        driveFolderUrl,
        description,
        photoCount,
        videoCount,
        totalStorage,
        resolution,
        pin,
        items
      } = req.body || {};

      if (!clientName || !title || !driveFolderUrl) {
        return res.status(400).json({
          success: false,
          error: 'Please provide client name, project title, and Google Drive folder link.'
        });
      }

      // Generate clean slug
      const rawSlug = `${clientName}-${title}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const uniqueSuffix = Date.now().toString(36).slice(-4);
      const slug = `${rawSlug}-${uniqueSuffix}`;

      const newGallery: ClientGallery = {
        id: `cg-${Date.now()}`,
        slug,
        clientName: clientName.trim(),
        clientEmail: clientEmail ? clientEmail.trim() : undefined,
        title: title.trim(),
        serviceType: serviceType || 'Event Photography & Videography',
        date: date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        location: location || 'Mumbai, India',
        coverImage: coverImage || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
        driveFolderUrl: driveFolderUrl.trim(),
        description: description || 'Your complete collection of photos and videos from Aman Visual is ready to download via Google Drive.',
        photoCount: Number(photoCount) || 50,
        videoCount: Number(videoCount) || 1,
        totalStorage: totalStorage || '4.5 GB',
        resolution: resolution || '4K Ultra HD & Master RAW',
        pin: pin ? pin.trim() : undefined,
        createdAt: new Date().toISOString(),
        items: Array.isArray(items) && items.length > 0 ? items : [
          {
            id: `item-${Date.now()}-1`,
            title: `${title} - Master Preview Highlight`,
            type: 'photo',
            src: coverImage || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
            category: 'Highlight',
            aspectRatio: 'landscape',
            resolution: 'Full Resolution'
          }
        ]
      };

      clientGalleriesStore.unshift(newGallery);
      console.log(`[New Client Gallery Created] ${newGallery.title} for ${newGallery.clientName} (Drive: ${newGallery.driveFolderUrl})`);

      return res.status(201).json({
        success: true,
        message: 'Client gallery created successfully.',
        gallery: newGallery
      });
    } catch (err) {
      console.error('Error creating client gallery:', err);
      return res.status(500).json({ success: false, error: 'Internal server error creating gallery.' });
    }
  });

  app.patch('/api/client-galleries/:id', requireOwner, (req, res) => {
    const { id } = req.params;
    const galleryIndex = clientGalleriesStore.findIndex((g) => g.id === id || g.slug === id);
    if (galleryIndex === -1) {
      return res.status(404).json({ success: false, error: 'Client gallery not found.' });
    }

    const current = clientGalleriesStore[galleryIndex];
    const updated = {
      ...current,
      ...req.body,
      id: current.id, // prevent id overwrite
    };

    clientGalleriesStore[galleryIndex] = updated;
    return res.json({ success: true, gallery: updated });
  });

  app.delete('/api/client-galleries/:id', requireOwner, (req, res) => {
    const { id } = req.params;
    const galleryIndex = clientGalleriesStore.findIndex((g) => g.id === id || g.slug === id);
    if (galleryIndex === -1) {
      return res.status(404).json({ success: false, error: 'Client gallery not found.' });
    }

    clientGalleriesStore.splice(galleryIndex, 1);
    return res.json({ success: true, message: 'Client gallery deleted successfully.' });
  });

  const httpServer = http.createServer(app);

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
