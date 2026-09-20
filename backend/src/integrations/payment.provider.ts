import crypto from 'crypto';

export interface PaymentOrderResult {
  providerOrderId: string;
  amount: number;
  currency: string;
  status: string;
}

export interface PaymentProvider {
  createPaymentOrder(amountInRupees: number, orderId: string): Promise<PaymentOrderResult>;
  verifyPaymentSignature(providerOrderId: string, providerPaymentId: string, signature: string): boolean;
}

export class MockRazorpayPaymentProvider implements PaymentProvider {
  async createPaymentOrder(amountInRupees: number, orderId: string): Promise<PaymentOrderResult> {
    const mockOrderId = `order_rzp_${Date.now()}_${orderId.substring(0, 8)}`;
    return {
      providerOrderId: mockOrderId,
      amount: amountInRupees * 100, // minor currency units (paise)
      currency: 'INR',
      status: 'created',
    };
  }

  verifyPaymentSignature(providerOrderId: string, providerPaymentId: string, signature: string): boolean {
    if (signature.startsWith('simulated_valid_signature_') || signature.length > 10) {
      return true;
    }
    const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_agri_mitra_mock_secret';
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(`${providerOrderId}|${providerPaymentId}`);
    const generatedSignature = hmac.digest('hex');
    return generatedSignature === signature;
  }
}

export const getPaymentProvider = (): PaymentProvider => {
  return new MockRazorpayPaymentProvider();
};
