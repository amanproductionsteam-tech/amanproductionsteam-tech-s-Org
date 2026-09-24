import fs from 'fs';
import path from 'path';

export interface ServerSecrets {
  DESTINATION_EMAIL?: string;
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_SECURE?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  SENDER_EMAIL?: string;
  RESEND_API_KEY?: string;
  ADMIN_PASSWORD?: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const SECRETS_FILE = path.join(DATA_DIR, 'secrets.json');

// Ensure data directory exists
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (err) {
  console.error('Error ensuring data directory exists for secrets:', err);
}

/**
 * Initialize secrets from disk into process.env on server startup
 */
export function initSecrets(): void {
  try {
    if (fs.existsSync(SECRETS_FILE)) {
      const raw = fs.readFileSync(SECRETS_FILE, 'utf-8');
      const data: ServerSecrets = JSON.parse(raw);
      for (const [key, val] of Object.entries(data)) {
        if (typeof val === 'string' && val.trim().length > 0) {
          process.env[key] = val.trim();
        }
      }
      if (process.env.CASHFREE_PAYMENT_LINK?.includes('yb26am38h5e0')) {
        delete process.env.CASHFREE_PAYMENT_LINK;
      }
      console.log('✓ Persistent production secrets loaded into environment');
    }
  } catch (err) {
    console.error('Error reading secrets file:', err);
  }
}

/**
 * Save updated secrets to disk and sync process.env immediately
 */
export function saveSecrets(updates: Partial<ServerSecrets>): ServerSecrets {
  let existing: ServerSecrets = {};
  try {
    if (fs.existsSync(SECRETS_FILE)) {
      const raw = fs.readFileSync(SECRETS_FILE, 'utf-8');
      existing = JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading existing secrets:', err);
  }

  // Merge updates
  const merged: ServerSecrets = { ...existing };
  for (const [k, v] of Object.entries(updates)) {
    const key = k as keyof ServerSecrets;
    if (v !== undefined && v !== null) {
      const stringVal = String(v).trim();
      if (stringVal.length > 0) {
        merged[key] = stringVal as any;
        process.env[key] = stringVal;
      }
    }
  }

  try {
    fs.writeFileSync(SECRETS_FILE, JSON.stringify(merged, null, 2), {
      encoding: 'utf-8',
      mode: 0o600 // restricted file permissions for sensitive data
    });
    console.log('✓ Persistent secrets successfully saved and applied to environment');
  } catch (err) {
    console.error('Error writing secrets file:', err);
  }

  return merged;
}

/**
 * Mask a secret string for safe display to authenticated owner
 */
function maskSecret(val?: string, visibleChars = 4): string {
  if (!val || val.trim().length === 0) return '';
  const clean = val.trim();
  if (clean.length <= visibleChars * 2) {
    return '••••••••';
  }
  return `${clean.substring(0, visibleChars)}••••••••${clean.substring(clean.length - visibleChars)}`;
}

/**
 * Get masked secrets representation for the authenticated admin dashboard
 */
export function getMaskedSecrets() {
  const destEmail = process.env.DESTINATION_EMAIL?.trim() || 'amanproductionsteam@gmail.com';
  const smtpUser = process.env.SMTP_USER?.trim() || 'amanproductionsteam@gmail.com';
  const smtpPass = process.env.SMTP_PASS?.trim() || '';
  const smtpHost = process.env.SMTP_HOST?.trim() || 'smtp.gmail.com';
  const smtpPort = process.env.SMTP_PORT?.trim() || '465';
  const adminPass = process.env.ADMIN_PASSWORD?.trim() || '';
  const resendKey = process.env.RESEND_API_KEY?.trim() || '';

  return {
    email: {
      isConfigured: Boolean(smtpUser && smtpPass),
      destinationEmail: destEmail,
      smtpUser: smtpUser,
      hasSmtpPass: Boolean(smtpPass),
      smtpPassMasked: smtpPass ? '••••••••••••' : '',
      smtpHost: smtpHost,
      smtpPort: smtpPort,
      smtpSecure: process.env.SMTP_SECURE || (smtpPort === '465' ? 'true' : 'false'),
      senderEmail: process.env.SENDER_EMAIL || `"Aman Visual" <${smtpUser}>`,
      hasResendKey: Boolean(resendKey),
      resendKeyMasked: resendKey ? maskSecret(resendKey, 4) : '',
    },
    security: {
      hasCustomAdminPassword: Boolean(adminPass && adminPass !== '8827474622'),
      adminPasswordMasked: adminPass ? '••••••••' : '',
    }
  };
}
