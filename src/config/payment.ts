// Centralized Payment & Booking Configuration for Aman Visual Studio
// Official Direct Kotak Mahindra Bank UPI & Account Transfer

export interface PaymentGatewayConfig {
  gateway: 'direct_upi';
  studioName: string;
  officialEmail: string;
  officialPhone: string;
  upiId: string;
  upiNumber: string;
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    ifscCode: string;
  };
}

export const STUDIO_PAYMENT_CONFIG: PaymentGatewayConfig = {
  gateway: 'direct_upi',
  studioName: 'Aman Visual',
  officialEmail: 'amanproductionsteam@gmail.com',
  officialPhone: '+918827474622',
  upiId: '8827474622@ybl',
  upiNumber: '8827474622',
  bankDetails: {
    bankName: 'Kotak Mahindra Bank',
    accountName: 'Aman Tiwari',
    accountNumber: '1645939816',
    ifscCode: 'KKBK0000133'
  }
};

// Backwards compatibility alias
export const CASHFREE_PAYMENT_CONFIG = STUDIO_PAYMENT_CONFIG;
