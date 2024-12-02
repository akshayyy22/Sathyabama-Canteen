import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import QRCode from 'qrcode';
import { databases } from '@/lib/appwrite';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature')!;
  const body = await request.text();

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // Extract details from the session object
      const metadata = session.metadata || {};
      const customerId = metadata.customerId || '';
      const stallId = metadata.stallId || '';
      const totalAmount = metadata.totalAmount || 0;

      // Generate QR code
      const qrCodeUrl = await QRCode.toDataURL(session.id);

      // Save or update order details in Appwrite
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!,
        session.id,
        {
          orderId: session.id,
          customerId,
          stallId,
          items: [], // You may need to fetch or handle item details if necessary
          totalAmount,
          qrCode: qrCodeUrl,
          paymentStatus: 'paid',
          timestamp: new Date().toISOString(),
        }
      );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }
}
