/**
 * Aman Visual Studio - Meta WhatsApp Cloud API Service
 * Official integration with Meta (Facebook) WhatsApp Cloud API
 */

export interface WhatsAppSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  details?: any;
}

export interface WhatsAppConfig {
  token: string;
  phoneNumberId: string;
  adminPhone: string;
  templateName?: string;
}

export function getWhatsAppConfig(): WhatsAppConfig {
  const token = (process.env.META_WHATSAPP_TOKEN || '').trim();
  const phoneNumberId = (process.env.META_WHATSAPP_PHONE_NUMBER_ID || '').trim();
  let adminPhone = (process.env.META_WHATSAPP_ADMIN_PHONE || '918827474622').trim().replace(/\D/g, '');
  if (adminPhone.length === 10) {
    adminPhone = '91' + adminPhone;
  }
  const templateName = (process.env.META_WHATSAPP_TEMPLATE_NAME || '').trim();

  return {
    token,
    phoneNumberId,
    adminPhone,
    templateName: templateName || undefined
  };
}

export function isWhatsAppConfigured(): boolean {
  const { token, phoneNumberId } = getWhatsAppConfig();
  return Boolean(token && phoneNumberId);
}

/**
 * Format phone number to international E.164 without '+' or leading zeros
 */
export function normalizePhoneNumber(rawPhone: string): string {
  let cleaned = rawPhone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
    cleaned = '91' + cleaned.slice(1);
  }
  return cleaned;
}

/**
 * Send a WhatsApp message using Meta WhatsApp Cloud API v20.0
 */
export async function sendWhatsAppMessage(
  recipientPhone: string,
  messageText: string,
  templateName?: string
): Promise<WhatsAppSendResult> {
  const config = getWhatsAppConfig();

  if (!config.token || !config.phoneNumberId) {
    return {
      success: false,
      error: 'Meta WhatsApp Cloud API is not configured. Please set META_WHATSAPP_TOKEN and META_WHATSAPP_PHONE_NUMBER_ID.'
    };
  }

  const normalizedTo = normalizePhoneNumber(recipientPhone);
  const endpoint = `https://graph.facebook.com/v20.0/${config.phoneNumberId}/messages`;

  // Payload: If template specified, use template; otherwise use standard text message
  let payload: any;
  if (templateName) {
    payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: normalizedTo,
      type: 'template',
      template: {
        name: templateName,
        language: { code: 'en_US' }
      }
    };
  } else {
    payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: normalizedTo,
      type: 'text',
      text: {
        preview_url: false,
        body: messageText
      }
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data: any = await response.json();

    if (!response.ok) {
      const errorMsg = data.error?.message || data.error?.error_user_msg || `Meta API HTTP ${response.status}`;
      console.error('[Meta WhatsApp API Error]:', data);
      return {
        success: false,
        error: errorMsg,
        details: data.error
      };
    }

    const messageId = data.messages?.[0]?.id;
    console.log(`[Meta WhatsApp Sent] Message ID: ${messageId} to ${normalizedTo}`);
    return {
      success: true,
      messageId,
      details: data
    };
  } catch (err: any) {
    console.error('[Meta WhatsApp Network Error]:', err);
    return {
      success: false,
      error: err.message || 'Network error communicating with Meta WhatsApp Cloud API'
    };
  }
}

/**
 * Send an automated WhatsApp notification to Studio Admin for new website enquiries
 */
export async function sendEnquiryWhatsAppAlert(enquiry: {
  name: string;
  email: string;
  phone: string;
  service: string;
  budget?: string;
  shootDate?: string;
  location?: string;
  message: string;
}): Promise<WhatsAppSendResult> {
  if (!isWhatsAppConfigured()) {
    return { success: false, error: 'WhatsApp not configured' };
  }

  const config = getWhatsAppConfig();
  const alertText = [
    `📸 *NEW WEBSITE ENQUIRY - AMAN VISUAL*`,
    `━━━━━━━━━━━━━━━━━━`,
    `👤 *Client:* ${enquiry.name}`,
    `📞 *Phone:* ${enquiry.phone}`,
    `✉️ *Email:* ${enquiry.email}`,
    `🎬 *Service:* ${enquiry.service}`,
    enquiry.budget ? `💰 *Budget:* ${enquiry.budget}` : null,
    enquiry.shootDate ? `📅 *Date:* ${enquiry.shootDate}` : null,
    enquiry.location ? `📍 *Location:* ${enquiry.location}` : null,
    `📝 *Message:* "${enquiry.message}"`,
    `━━━━━━━━━━━━━━━━━━`,
    `⚡ Reply to client: https://wa.me/${normalizePhoneNumber(enquiry.phone)}`
  ].filter(Boolean).join('\n');

  return sendWhatsAppMessage(config.adminPhone, alertText);
}

/**
 * Send an automated WhatsApp notification for booking advance payments
 */
export async function sendBookingWhatsAppAlert(booking: {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceTitle: string;
  advanceAmount: number;
  totalEstimate: number;
  bankReference?: string;
  eventDate?: string;
  eventVenue?: string;
}): Promise<WhatsAppSendResult> {
  if (!isWhatsAppConfigured()) {
    return { success: false, error: 'WhatsApp not configured' };
  }

  const config = getWhatsAppConfig();
  const alertText = [
    `💎 *NEW BOOKING RETAINER RECEIVED*`,
    `━━━━━━━━━━━━━━━━━━`,
    `🔖 *Ref:* ${booking.id}`,
    `👤 *Client:* ${booking.customerName}`,
    `📞 *Phone:* ${booking.customerPhone}`,
    `🎬 *Package:* ${booking.serviceTitle}`,
    `💵 *Advance Paid:* ₹${booking.advanceAmount.toLocaleString('en-IN')}`,
    `📊 *Total Value:* ₹${booking.totalEstimate.toLocaleString('en-IN')}`,
    booking.bankReference ? `🏦 *UTR / Bank Ref:* ${booking.bankReference}` : null,
    booking.eventDate ? `📅 *Date:* ${booking.eventDate}` : null,
    booking.eventVenue ? `📍 *Venue:* ${booking.eventVenue}` : null,
    `━━━━━━━━━━━━━━━━━━`,
    `⚡ Client WhatsApp: https://wa.me/${normalizePhoneNumber(booking.customerPhone)}`
  ].filter(Boolean).join('\n');

  return sendWhatsAppMessage(config.adminPhone, alertText);
}
