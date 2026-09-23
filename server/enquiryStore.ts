import fs from 'fs';
import path from 'path';

export interface PersistentEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  shootDate?: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'archived';
  clientIp?: string;
  userAgent?: string;
  emailDelivery?: {
    attempted: boolean;
    sent: boolean;
    provider?: string;
    messageId?: string;
    error?: string;
    sentAt?: string;
  };
}

const DATA_DIR = path.join(process.cwd(), 'data');
const ENQUIRIES_FILE = path.join(DATA_DIR, 'enquiries.json');

// Ensure directory exists
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (err) {
  console.error('Error ensuring data directory exists:', err);
}

// Initial seed enquiries if file does not exist yet
const INITIAL_SEED: PersistentEnquiry[] = [
  {
    id: 'ENQ-DEMO-01',
    name: 'Rajesh Khanna',
    email: 'rajesh@luxeliving.in',
    phone: '+91 98201 45678',
    service: 'Real Estate Visuals & FPV',
    shootDate: '2026-10-15',
    message: 'We have a luxury 4BHK penthouse in Worli and need high-end architectural photo coverage and FPV drone flythrough for our marketing campaign.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    status: 'new',
    emailDelivery: {
      attempted: true,
      sent: true,
      provider: 'smtp',
      sentAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    }
  },
  {
    id: 'ENQ-DEMO-02',
    name: 'Ananya Roy',
    email: 'ananya@aurafashion.co',
    phone: '+91 91672 88390',
    service: 'Corporate Film & Commercial',
    shootDate: '2026-11-04',
    message: 'Looking for a cinematic brand video showcasing our upcoming sustainable clothing collection in Mumbai. 2-day shoot schedule.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: 'contacted',
    emailDelivery: {
      attempted: true,
      sent: true,
      provider: 'smtp',
      sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    }
  }
];

// In-memory cache for fast lookups
let cachedEnquiries: PersistentEnquiry[] | null = null;

/**
 * Load all persistent enquiries from disk
 */
export function getAllEnquiries(): PersistentEnquiry[] {
  if (cachedEnquiries !== null) {
    return cachedEnquiries;
  }

  try {
    if (fs.existsSync(ENQUIRIES_FILE)) {
      const raw = fs.readFileSync(ENQUIRIES_FILE, 'utf8');
      cachedEnquiries = JSON.parse(raw);
      return cachedEnquiries || [];
    } else {
      cachedEnquiries = [...INITIAL_SEED];
      saveEnquiriesToDisk(cachedEnquiries);
      return cachedEnquiries;
    }
  } catch (err) {
    console.error('Error reading persistent enquiries file:', err);
    return cachedEnquiries || [...INITIAL_SEED];
  }
}

/**
 * Write enquiries array atomically to disk
 */
function saveEnquiriesToDisk(enquiries: PersistentEnquiry[]): void {
  try {
    cachedEnquiries = enquiries;
    const tempFile = `${ENQUIRIES_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(enquiries, null, 2), 'utf8');
    fs.renameSync(tempFile, ENQUIRIES_FILE);
  } catch (err) {
    console.error('Error saving persistent enquiries to disk:', err);
  }
}

/**
 * Save a new enquiry to persistent store
 */
export function saveEnquiry(enquiry: PersistentEnquiry): PersistentEnquiry {
  const list = getAllEnquiries();
  // Add to top of list
  const updated = [enquiry, ...list];
  saveEnquiriesToDisk(updated);
  return enquiry;
}

/**
 * Update enquiry status or emailDelivery info
 */
export function updateEnquiry(
  id: string,
  updates: Partial<PersistentEnquiry>
): PersistentEnquiry | null {
  const list = getAllEnquiries();
  const index = list.findIndex((e) => e.id === id);
  if (index === -1) return null;

  list[index] = {
    ...list[index],
    ...updates,
  };

  saveEnquiriesToDisk(list);
  return list[index];
}

/**
 * Delete an enquiry by id
 */
export function deleteEnquiry(id: string): boolean {
  const list = getAllEnquiries();
  const filtered = list.filter((e) => e.id !== id);
  if (filtered.length === list.length) return false;

  saveEnquiriesToDisk(filtered);
  return true;
}

// ----------------------------------------------------
// RATE LIMITING & SPAM DEDUPLICATION IN-MEMORY ENGINE
// ----------------------------------------------------

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const ipRateLimits = new Map<string, RateLimitRecord>();
const recentSubmissions = new Map<string, number>(); // deduplication hash -> timestamp

/**
 * Rate Limiter: Max 5 enquiries per 10 minutes per IP
 */
export function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 5;

  const record = ipRateLimits.get(ip);
  if (!record || now > record.resetAt) {
    ipRateLimits.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (record.count >= maxRequests) {
    const retryAfterSeconds = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  record.count += 1;
  return { allowed: true };
}

/**
 * Duplicate Submission Protection: Prevent duplicate within 60 seconds
 */
export function isDuplicateSubmission(hash: string): boolean {
  const now = Date.now();
  const existing = recentSubmissions.get(hash);

  if (existing && now - existing < 60 * 1000) {
    return true;
  }

  recentSubmissions.set(hash, now);

  // Clean old hashes periodically
  if (recentSubmissions.size > 200) {
    for (const [key, time] of recentSubmissions.entries()) {
      if (now - time > 60 * 1000) {
        recentSubmissions.delete(key);
      }
    }
  }

  return false;
}
