// Centralized Payment Gateway Configuration for Aman Visual Studio
// Payment Processing: Exclusive Cashfree Integration (UPI, Credit/Debit Cards, NetBanking)

export interface PaymentGatewayConfig {
  gateway: 'cashfree';
  studioName: string;
  officialEmail: string;
  officialPhone: string;
  upiNumber: string;
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    ifscCode: string;
  };
}

export const CASHFREE_PAYMENT_CONFIG: PaymentGatewayConfig = {
  gateway: 'cashfree',
  studioName: 'Aman Visual',
  officialEmail: 'amanproductionsteam@gmail.com',
  officialPhone: '+918827474622',
  upiNumber: '8827474622',
  bankDetails: {
    bankName: 'Kotak Mahindra Bank',
    accountName: 'Aman Tiwari',
    accountNumber: '1645939816',
    ifscCode: 'KKBK0000133'
  }
};

export const DEFAULT_CASHFREE_PAYMENT_LINK =
  (typeof import.meta !== 'undefined' && (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_CASHFREE_PAYMENT_LINK) ||
  '';

export function getCashfreePaymentLink(): string {
  try {
    const saved = localStorage.getItem('aman_cashfree_payment_link');
    if (saved && saved.trim().startsWith('http')) {
      return saved.trim();
    }
  } catch {
    // LocalStorage unavailable
  }
  return DEFAULT_CASHFREE_PAYMENT_LINK;
}

export function saveCashfreePaymentLink(link: string): void {
  try {
    localStorage.setItem('aman_cashfree_payment_link', link.trim());
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cashfree_link_updated'));
    }
  } catch (err) {
    console.error('Failed to save Cashfree payment link to storage:', err);
  }
}

