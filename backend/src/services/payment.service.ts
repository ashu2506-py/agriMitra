import { prisma } from '../config/db.js';
import { getPaymentProvider } from '../integrations/payment.provider.js';

export class PaymentService {
  static async createPaymentOrder(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw { statusCode: 404, message: 'Order not found', code: 'ORDER_NOT_FOUND' };
    }

    const provider = getPaymentProvider();
    const result = await provider.createPaymentOrder(order.totalAmount, order.id);

    const payment = await prisma.payment.upsert({
      where: { orderId: order.id },
      update: {
        providerOrderId: result.providerOrderId,
        amount: order.totalAmount,
        status: 'INITIATED',
      },
      create: {
        orderId: order.id,
        provider: 'RAZORPAY',
        providerOrderId: result.providerOrderId,
        amount: order.totalAmount,
        currency: 'INR',
        status: 'INITIATED',
      },
    });

    return {
      payment,
      razorpayOrder: result,
    };
  }

  static async verifyPayment(orderId: string, providerPaymentId: string, signature: string) {
    const payment = await prisma.payment.findUnique({
      where: { orderId },
    });

    if (!payment) {
      throw { statusCode: 404, message: 'Payment record not found', code: 'PAYMENT_NOT_FOUND' };
    }

    const provider = getPaymentProvider();
    const isValid = provider.verifyPaymentSignature(payment.providerOrderId, providerPaymentId, signature);

    if (!isValid) {
      await prisma.payment.update({
        where: { orderId },
        data: { status: 'FAILED' },
      });
      throw { statusCode: 400, message: 'Payment signature verification failed', code: 'PAYMENT_VERIFICATION_FAILED' };
    }

    // Execute atomic status update
    return prisma.$transaction(async (tx) => {
      const updatedPayment = await tx.payment.update({
        where: { orderId },
        data: {
          providerPaymentId,
          status: 'COMPLETED',
        },
      });

      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: 'CONFIRMED' },
      });

      // Generate invoice record
      const invoiceNumber = `INV-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
      await tx.invoice.create({
        data: {
          invoiceNumber,
          orderId,
          pdfUrl: `/api/invoices/${orderId}/pdf`,
        },
      });

      return {
        payment: updatedPayment,
        order: updatedOrder,
      };
    });
  }
}
