import PDFDocument from 'pdfkit';
import { prisma } from '../config/db.js';

export class InvoiceService {
  static async generateInvoicePDF(orderId: string, userId: string, role: string): Promise<PDFKit.PDFDocument> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        buyer: true,
        items: {
          include: {
            listing: {
              include: {
                crop: true,
                farmer: true,
              },
            },
          },
        },
        payment: true,
        invoice: true,
      },
    });

    if (!order) {
      throw { statusCode: 404, message: 'Invoice or Order not found', code: 'INVOICE_NOT_FOUND' };
    }

    // Authorization check
    if (role !== 'ADMIN' && order.buyerId !== userId) {
      const isFarmer = order.items.some((item) => item.listing.farmerId === userId);
      if (!isFarmer) {
        throw { statusCode: 403, message: 'Unauthorized to view this invoice', code: 'FORBIDDEN' };
      }
    }

    const doc = new PDFDocument({ margin: 50 });

    // Document Header
    doc.fillColor('#16a34a').fontSize(24).text('AGRI MITRA', { align: 'left' });
    doc.fillColor('#64748b').fontSize(10).text('AI-Powered Direct Farm-to-Market Marketplace', { align: 'left' });
    doc.moveDown(1.5);

    // Invoice Meta
    doc.fillColor('#0f172a').fontSize(16).text('TAX INVOICE', { underline: true });
    doc.fontSize(10).text(`Invoice No: ${order.invoice?.invoiceNumber || 'INV-DEMO-001'}`);
    doc.text(`Order Ref: ${order.orderNumber}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`);
    doc.moveDown(1.5);

    // Parties
    doc.fontSize(12).text('Buyer Information:', { underline: true });
    doc.fontSize(10).text(`Name: ${order.buyer.name}`);
    doc.text(`Address: ${order.deliveryAddress}, ${order.district}, ${order.state}`);
    doc.moveDown(1);

    // Line items table
    doc.fontSize(12).text('Order Line Items:', { underline: true });
    doc.moveDown(0.5);

    order.items.forEach((item, idx) => {
      doc
        .fontSize(10)
        .text(
          `${idx + 1}. ${item.listing.crop.name} (${item.listing.grade}) - ${item.quantity} ${item.listing.unit} @ ₹${item.unitPrice}/${item.listing.unit}`
        );
      doc.text(`   Subtotal: ₹${item.totalPrice.toLocaleString('en-IN')}`);
    });

    doc.moveDown(1.5);

    // Financial Breakdown
    doc.fontSize(10).text(`Produce Subtotal: ₹${order.cropValue.toLocaleString('en-IN')}`);
    doc.text(`Logistics Freight: ₹${order.logisticsFee.toLocaleString('en-IN')}`);
    doc.text(`Platform Fee: ₹${order.platformFee.toLocaleString('en-IN')}`);
    doc.text(`Taxes (GST): ₹${order.taxAmount.toLocaleString('en-IN')}`);
    doc.fontSize(12).fillColor('#16a34a').text(`Total Amount Paid: ₹${order.totalAmount.toLocaleString('en-IN')}`);

    doc.moveDown(2);
    doc.fillColor('#94a3b8').fontSize(9).text('Thank you for choosing AGRI MITRA. Computer-generated digital invoice.', { align: 'center' });

    doc.end();
    return doc;
  }
}
