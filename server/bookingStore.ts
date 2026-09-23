import fs from 'fs';
import path from 'path';

export interface PersistentBooking {
  orderId: string;
  cfOrderId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  serviceTitle: string;
  eventDate?: string;
  eventVenue?: string;
  customNotes?: string;
  status: 'PENDING' | 'PENDING_VERIFICATION' | 'PAID' | 'FAILED' | 'REJECTED' | 'CANCELLED';
  paymentMode: 'Cashfree' | 'Direct UPI / QR Transfer' | 'Bank Transfer' | 'Manual';
  paymentSessionId?: string;
  cfPaymentId?: string;
  bankReference?: string; // UTR or Bank Reference
  screenshotUrl?: string; // Base64 or URL proof
  createdAt: string;
  paidAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  receiptNumber?: string;
  clientIp?: string;
  userAgent?: string;
  notes?: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');

// Ensure directory exists
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (err) {
  console.error('Error ensuring data directory exists for bookings:', err);
}

// In-memory cache for fast lookups
let cachedBookings: PersistentBooking[] | null = null;

/**
 * Load all persistent bookings from disk
 */
export function getAllBookings(): PersistentBooking[] {
  if (cachedBookings !== null) {
    return cachedBookings;
  }

  try {
    if (fs.existsSync(BOOKINGS_FILE)) {
      const raw = fs.readFileSync(BOOKINGS_FILE, 'utf8');
      cachedBookings = JSON.parse(raw);
      return cachedBookings || [];
    } else {
      cachedBookings = [];
      saveBookingsToDisk(cachedBookings);
      return cachedBookings;
    }
  } catch (err) {
    console.error('Error reading persistent bookings file:', err);
    return cachedBookings || [];
  }
}

/**
 * Write bookings array atomically to disk
 */
function saveBookingsToDisk(bookings: PersistentBooking[]): void {
  try {
    cachedBookings = bookings;
    const tempFile = `${BOOKINGS_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(bookings, null, 2), 'utf8');
    fs.renameSync(tempFile, BOOKINGS_FILE);
  } catch (err) {
    console.error('Error saving persistent bookings to disk:', err);
  }
}

/**
 * Find booking by Order ID
 */
export function getBookingByOrderId(orderId: string): PersistentBooking | null {
  const list = getAllBookings();
  return list.find((b) => b.orderId === orderId) || null;
}

/**
 * Save a new booking
 */
export function saveBooking(booking: PersistentBooking): PersistentBooking {
  const list = getAllBookings();
  const existingIdx = list.findIndex((b) => b.orderId === booking.orderId);
  if (existingIdx !== -1) {
    list[existingIdx] = { ...list[existingIdx], ...booking };
  } else {
    list.unshift(booking);
  }
  saveBookingsToDisk(list);
  return booking;
}

/**
 * Update an existing booking
 */
export function updateBooking(
  orderId: string,
  updates: Partial<PersistentBooking>
): PersistentBooking | null {
  const list = getAllBookings();
  const index = list.findIndex((b) => b.orderId === orderId);
  if (index === -1) return null;

  list[index] = {
    ...list[index],
    ...updates,
  };

  saveBookingsToDisk(list);
  return list[index];
}

/**
 * Manually verify a direct UPI/QR payment (Owner action)
 */
export function verifyManualBooking(
  orderId: string,
  verifiedBy = 'Aman Visual Admin',
  adminNotes?: string
): PersistentBooking | null {
  const list = getAllBookings();
  const index = list.findIndex((b) => b.orderId === orderId);
  if (index === -1) return null;

  const now = new Date().toISOString();
  list[index] = {
    ...list[index],
    status: 'PAID',
    paidAt: now,
    verifiedAt: now,
    verifiedBy,
    receiptNumber: list[index].receiptNumber || `AV-REC-${orderId}`,
    notes: adminNotes ? `${list[index].notes ? list[index].notes + ' | ' : ''}${adminNotes}` : list[index].notes,
  };

  saveBookingsToDisk(list);
  return list[index];
}

/**
 * Reject a booking (e.g. invalid UTR / proof)
 */
export function rejectManualBooking(
  orderId: string,
  reason = 'Bank credit could not be verified'
): PersistentBooking | null {
  const list = getAllBookings();
  const index = list.findIndex((b) => b.orderId === orderId);
  if (index === -1) return null;

  list[index] = {
    ...list[index],
    status: 'REJECTED',
    notes: reason,
  };

  saveBookingsToDisk(list);
  return list[index];
}

/**
 * Delete a booking
 */
export function deleteBooking(orderId: string): boolean {
  const list = getAllBookings();
  const filtered = list.filter((b) => b.orderId !== orderId);
  if (filtered.length === list.length) return false;

  saveBookingsToDisk(filtered);
  return true;
}
