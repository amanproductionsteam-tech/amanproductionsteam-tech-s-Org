import nodemailer from 'nodemailer';

export interface EmailEnquiryPayload {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  shootDate?: string;
  message: string;
  createdAt: string;
}

export interface EmailSendResult {
  success: boolean;
  notConfigured?: boolean;
  messageId?: string;
  provider?: string;
  error?: string;
}

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  senderEmail: string;
  destinationEmail: string;
}

/**
 * Read and validate SMTP settings from environment and persistent config
 */
export function getSmtpConfig(): SmtpConfig {
  const host = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
  const port = parseInt((process.env.SMTP_PORT || '465').trim(), 10) || 465;

  let secure: boolean;
  if (process.env.SMTP_SECURE !== undefined && process.env.SMTP_SECURE.trim().length > 0) {
    const s = process.env.SMTP_SECURE.trim().toLowerCase();
    secure = s === 'true' || s === '1' || s === 'yes';
  } else {
    // Port 465 defaults to SSL/TLS; port 587 defaults to STARTTLS
    secure = port === 465;
  }

  const user = (process.env.SMTP_USER || '').trim();
  const pass = (process.env.SMTP_PASS || '').trim();
  const destinationEmail = (process.env.DESTINATION_EMAIL || 'amanproductionsteam@gmail.com').trim();

  let senderEmail = (process.env.SENDER_EMAIL || '').trim();
  if (!senderEmail) {
    senderEmail = user ? `"Aman Visual" <${user}>` : `"Aman Visual" <${destinationEmail}>`;
  }

  return {
    host,
    port,
    secure,
    user,
    pass,
    senderEmail,
    destinationEmail,
  };
}

/**
 * Create a Nodemailer transporter using configured SMTP settings
 */
export function createSmtpTransporter() {
  const config = getSmtpConfig();
  if (!config.user || !config.pass) {
    throw new Error('SMTP credentials (SMTP_USER and SMTP_PASS) are not configured.');
  }

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    tls: {
      rejectUnauthorized: true,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });
}

/**
 * Verify SMTP server handshake and credentials without sending an email
 */
export async function verifySmtpConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    const config = getSmtpConfig();
    if (!config.user || !config.pass) {
      return { success: false, error: 'SMTP credentials (SMTP_USER and SMTP_PASS) are not configured.' };
    }
    const transporter = createSmtpTransporter();
    await transporter.verify();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || String(err) };
  }
}

/**
 * Check if transactional email credentials are configured in the environment
 */
export function isEmailConfigured(): boolean {
  const { user, pass } = getSmtpConfig();
  const hasSmtp = Boolean(user && pass);
  const hasResend = Boolean(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim().length > 0);
  return hasSmtp || hasResend;
}

/**
 * Send transactional enquiry notification to amanproductionsteam@gmail.com
 */
export async function sendEnquiryEmail(payload: EmailEnquiryPayload): Promise<EmailSendResult> {
  const config = getSmtpConfig();
  const destinationEmail = config.destinationEmail;
  const subject = `New Website Enquiry – ${payload.service} – ${payload.name}`;

  // Format date in Indian Standard Time (IST)
  let formattedDate = payload.createdAt;
  try {
    formattedDate = new Date(payload.createdAt).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium',
    }) + ' (IST)';
  } catch {
    formattedDate = payload.createdAt;
  }

  // Clean phone number for WhatsApp action link
  const cleanPhoneDigits = payload.phone.replace(/[^0-9]/g, '');
  const waTarget = cleanPhoneDigits.length === 10 ? `91${cleanPhoneDigits}` : cleanPhoneDigits;
  const waUrl = `https://wa.me/${waTarget}?text=${encodeURIComponent(
    `Hello ${payload.name}, thank you for contacting Aman Visual regarding ${payload.service}.`
  )}`;

  const shootDateDisplay = payload.shootDate && payload.shootDate.trim().length > 0
    ? payload.shootDate.trim()
    : 'Not specified (To be scheduled)';

  // Text version
  const textContent = `
========================================
NEW WEBSITE ENQUIRY - AMAN VISUAL
========================================

Reference ID: ${payload.id}
Submitted On: ${formattedDate}

CUSTOMER DETAILS:
- Name: ${payload.name}
- Email: ${payload.email}
- Phone: ${payload.phone}
- Service: ${payload.service}
- Shoot Date: ${shootDateDisplay}

PROJECT DETAILS / BRIEF:
${payload.message}

DIRECT ACTIONS:
- Reply to Email: mailto:${payload.email}
- Call Customer: tel:${payload.phone}
- WhatsApp Customer: ${waUrl}

--
Aman Visual Portfolio & Booking System
Website: https://amanvisual.in
Studio: Evershine Cosmic, Andheri West, Mumbai
`.trim();

  // HTML version with modern cinematic styling matching Aman Visual
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0b0b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0b0b0b; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #141414; border: 1px solid #2a2a2a; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.6);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 28px 32px; background: linear-gradient(180deg, #1f1f1f 0%, #141414 100%); border-bottom: 1px solid #2d2d2d;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <div style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #10b981; font-weight: 700; margin-bottom: 4px;">AMAN VISUAL • INBOX</div>
                    <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: 0.5px;">New Website Client Enquiry</h1>
                  </td>
                  <td align="right" style="vertical-align: top;">
                    <span style="font-family: monospace; font-size: 11px; color: #888888; background-color: #000000; border: 1px solid #333333; padding: 4px 8px; border-radius: 4px;">
                      ${payload.id}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Summary Badge -->
          <tr>
            <td style="padding: 16px 32px; background-color: #1a1a1a; border-bottom: 1px solid #262626;">
              <div style="font-size: 12px; color: #aaaaaa;">
                <strong>Submitted:</strong> ${formattedDate}
              </div>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 28px 32px;">

              <!-- Client Info Table -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px; border-collapse: separate; border-spacing: 0 8px;">
                <tr>
                  <td width="130" style="color: #888888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; padding: 6px 0;">Customer Name</td>
                  <td style="color: #ffffff; font-size: 15px; font-weight: 700; padding: 6px 0;">${payload.name}</td>
                </tr>
                <tr>
                  <td width="130" style="color: #888888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; padding: 6px 0;">Email</td>
                  <td style="padding: 6px 0;">
                    <a href="mailto:${payload.email}" style="color: #10b981; text-decoration: none; font-size: 14px; font-weight: 500;">${payload.email}</a>
                  </td>
                </tr>
                <tr>
                  <td width="130" style="color: #888888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; padding: 6px 0;">Phone</td>
                  <td style="padding: 6px 0;">
                    <a href="tel:${payload.phone}" style="color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600;">${payload.phone}</a>
                    <a href="${waUrl}" style="margin-left: 10px; color: #25D366; text-decoration: none; font-size: 12px; font-weight: 600;">(Chat on WhatsApp &rarr;)</a>
                  </td>
                </tr>
                <tr>
                  <td width="130" style="color: #888888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; padding: 6px 0;">Service Category</td>
                  <td style="color: #e5e5e5; font-size: 14px; font-weight: 600; padding: 6px 0;">
                    <span style="background-color: #262626; border: 1px solid #3b3b3b; padding: 3px 8px; border-radius: 3px;">
                      ${payload.service}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td width="130" style="color: #888888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; padding: 6px 0;">Shoot Date</td>
                  <td style="color: #fbbf24; font-size: 14px; font-weight: 600; padding: 6px 0;">${shootDateDisplay}</td>
                </tr>
              </table>

              <!-- Message / Brief Box -->
              <div style="margin-top: 16px; margin-bottom: 28px;">
                <div style="font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #888888; font-weight: 700; margin-bottom: 8px;">
                  Project Brief / Message:
                </div>
                <div style="background-color: #0d0d0d; border: 1px solid #282828; border-left: 3px solid #10b981; border-radius: 4px; padding: 18px; color: #e0e0e0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${payload.message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
              </div>

              <!-- Quick Action Buttons -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding: 0 6px;">
                          <a href="mailto:${payload.email}?subject=${encodeURIComponent(`Re: Your enquiry with Aman Visual – ${payload.service}`)}" style="display: inline-block; background-color: #ffffff; color: #000000; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 12px 20px; border-radius: 4px; text-decoration: none;">
                            Reply via Email
                          </a>
                        </td>
                        <td style="padding: 0 6px;">
                          <a href="${waUrl}" style="display: inline-block; background-color: #25D366; color: #000000; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 12px 20px; border-radius: 4px; text-decoration: none;">
                            WhatsApp Customer
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #0f0f0f; border-top: 1px solid #222222; text-align: center;">
              <div style="font-size: 11px; color: #666666; line-height: 1.5;">
                This message was delivered automatically by the <strong>Aman Visual</strong> portfolio backend.<br>
                Reply-To is configured directly to <strong>${payload.email}</strong>.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();

  // 1. Send via SMTP (e.g. Gmail SMTP with App Password)
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = createSmtpTransporter();

      const info = await transporter.sendMail({
        from: config.senderEmail,
        to: destinationEmail,
        replyTo: `"${payload.name.replace(/"/g, '')}" <${payload.email.trim()}>`,
        subject,
        text: textContent,
        html: htmlContent,
      });

      console.log(`[Email Delivered via SMTP] MessageId: ${info.messageId} to ${destinationEmail}`);
      return {
        success: true,
        messageId: info.messageId,
        provider: 'smtp'
      };
    } catch (err: any) {
      console.error('[SMTP Delivery Error]', err.message || err);
      return {
        success: false,
        error: `SMTP delivery failed: ${err.message || err}`
      };
    }
  }

  // 2. Optional Resend fallback only if explicitly configured
  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim().length > 0) {
    try {
      const sender = config.senderEmail || 'Aman Visual <onboarding@resend.dev>';
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: sender,
          to: [destinationEmail],
          reply_to: payload.email,
          subject,
          text: textContent,
          html: htmlContent
        })
      });

      const resData = await res.json() as any;
      if (res.ok && resData.id) {
        console.log(`[Email Delivered via Resend] ID: ${resData.id} to ${destinationEmail}`);
        return {
          success: true,
          messageId: resData.id,
          provider: 'resend'
        };
      } else {
        const errMsg = resData.message || resData.error || `HTTP ${res.status}`;
        console.error('[Resend Error]', errMsg);
        return {
          success: false,
          error: `Resend delivery failed: ${errMsg}`
        };
      }
    } catch (err: any) {
      console.error('[Resend Network Error]', err.message || err);
      return {
        success: false,
        error: `Resend request failed: ${err.message || err}`
      };
    }
  }

  // If no credentials configured on server
  return {
    success: false,
    notConfigured: true,
    error: 'SMTP email credentials (SMTP_USER and SMTP_PASS) are not configured on the server.'
  };
}

export interface BookingEmailPayload {
  orderId: string;
  cfPaymentId?: string;
  bankReference?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  serviceTitle: string;
  eventDate?: string;
  eventVenue?: string;
  status: 'PENDING_VERIFICATION' | 'PAID' | 'REJECTED';
  paymentMode: string;
  receiptNumber?: string;
}

/**
 * Send booking & payment notification email to studio and client
 */
export async function sendBookingNotificationEmail(payload: BookingEmailPayload): Promise<EmailSendResult> {
  const destinationEmail = process.env.DESTINATION_EMAIL || 'amanproductionsteam@gmail.com';
  const isPaid = payload.status === 'PAID';
  const subject = isPaid
    ? `Payment Confirmed (₹${payload.amount.toLocaleString('en-IN')}) – ${payload.serviceTitle} – ${payload.customerName}`
    : `Direct UPI Payment Pending Verification – ${payload.customerName} (₹${payload.amount.toLocaleString('en-IN')})`;

  const statusLabel = isPaid ? 'PAYMENT CONFIRMED (PAID)' : 'PENDING MANUAL VERIFICATION';
  const statusColor = isPaid ? '#10b981' : '#f59e0b';

  const textContent = `
========================================
AMAN VISUAL - BOOKING NOTIFICATION
========================================

Status: ${statusLabel}
Order ID: ${payload.orderId}
Receipt #: ${payload.receiptNumber || 'N/A'}
Service: ${payload.serviceTitle}
Advance Amount: INR ₹${payload.amount.toLocaleString('en-IN')}
Payment Mode: ${payload.paymentMode}
${payload.bankReference ? `Bank UTR / Reference: ${payload.bankReference}\n` : ''}
CUSTOMER DETAILS:
- Name: ${payload.customerName}
- Email: ${payload.customerEmail}
- Phone: ${payload.customerPhone}
- Event Date: ${payload.eventDate || 'To be scheduled'}
- Event Venue: ${payload.eventVenue || 'Not specified'}

--
Aman Visual Studio Booking System
Mumbai, Maharashtra, India
`.trim();

  const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="margin:0;padding:0;background-color:#050505;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#ffffff;">
  <table width="100%" style="background-color:#050505;padding:30px 15px;">
    <tr><td align="center">
      <table width="600" style="max-width:600px;width:100%;background-color:#111111;border:1px solid #222222;border-radius:8px;overflow:hidden;">
        <tr>
          <td style="padding:24px 30px;background:#181818;border-bottom:1px solid #2a2a2a;">
            <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#10b981;font-weight:700;">AMAN VISUAL • BOOKING</div>
            <h1 style="margin:6px 0 0;font-size:20px;color:#ffffff;">${subject}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:30px;">
            <div style="display:inline-block;padding:6px 14px;border-radius:4px;background-color:${statusColor}20;border:1px solid ${statusColor}60;color:${statusColor};font-size:12px;font-weight:bold;margin-bottom:20px;">
              ${statusLabel}
            </div>

            <table width="100%" style="border-collapse:collapse;margin-bottom:20px;font-size:13px;">
              <tr><td style="padding:8px 0;color:#888;">Order ID:</td><td style="padding:8px 0;color:#fff;font-family:monospace;font-weight:bold;">${payload.orderId}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Service:</td><td style="padding:8px 0;color:#fff;font-weight:bold;">${payload.serviceTitle}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Advance Amount:</td><td style="padding:8px 0;color:#10b981;font-size:16px;font-weight:bold;">₹${payload.amount.toLocaleString('en-IN')}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Payment Mode:</td><td style="padding:8px 0;color:#fff;">${payload.paymentMode}</td></tr>
              ${payload.bankReference ? `<tr><td style="padding:8px 0;color:#888;">Bank Reference / UTR:</td><td style="padding:8px 0;color:#fff;font-family:monospace;">${payload.bankReference}</td></tr>` : ''}
              <tr><td style="padding:8px 0;color:#888;">Client:</td><td style="padding:8px 0;color:#fff;">${payload.customerName} (${payload.customerPhone})</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Client Email:</td><td style="padding:8px 0;color:#fff;">${payload.customerEmail}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Event Date:</td><td style="padding:8px 0;color:#fff;">${payload.eventDate || 'To be scheduled'}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Event Venue:</td><td style="padding:8px 0;color:#fff;">${payload.eventVenue || 'Not specified'}</td></tr>
            </table>

            <div style="padding-top:15px;border-top:1px solid #222;font-size:11px;color:#666;">
              Aman Visual Studio Booking & Payments System • Mumbai, India
            </div>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
`.trim();

  // 1. Try SMTP first (Gmail SMTP / Custom SMTP)
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const config = getSmtpConfig();
      const transporter = createSmtpTransporter();

      const recipients = [config.destinationEmail];
      if (payload.customerEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.customerEmail.trim())) {
        recipients.push(payload.customerEmail.trim());
      }

      const info = await transporter.sendMail({
        from: config.senderEmail,
        to: recipients.join(', '),
        subject,
        text: textContent,
        html: htmlContent,
      });

      return { success: true, messageId: info.messageId, provider: 'smtp' };
    } catch (err: any) {
      console.error('[SMTP Booking Notification Error]', err.message || err);
      return { success: false, error: `SMTP failed: ${err.message || err}` };
    }
  }

  // 2. Try Resend API (optional fallback)
  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim().length > 0) {
    try {
      const config = getSmtpConfig();
      const sender = config.senderEmail || 'Aman Visual <onboarding@resend.dev>';
      const recipients = [config.destinationEmail];
      if (payload.customerEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.customerEmail.trim())) {
        recipients.push(payload.customerEmail.trim());
      }

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: sender,
          to: recipients,
          subject,
          text: textContent,
          html: htmlContent,
        }),
      });

      const resData = await response.json() as Record<string, unknown>;
      if (!response.ok) {
        return { success: false, error: (resData.message as string) || 'Resend API failed' };
      }
      return { success: true, messageId: (resData.id as string) || 'resend_ok', provider: 'resend' };
    } catch (err: any) {
      return { success: false, error: `Resend failed: ${err.message || err}` };
    }
  }

  return {
    success: false,
    notConfigured: true,
    error: 'SMTP email credentials (SMTP_USER and SMTP_PASS) are not configured on the server.'
  };
}
