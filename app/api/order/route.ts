import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { databases } from '@/lib/appwrite';

export async function POST(request: Request) {
  const { orderId, customerId, stallId, items, totalAmount, paymentStatus } = await request.json();
  
  try {
    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(orderId);

    // Save order details to Appwrite
    await databases.createDocument(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!, process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!, orderId, {
      orderId,
      customerId,
      stallId,
      items,
      totalAmount,
      orderStatus: 'pending',
      qrCode: qrCodeUrl,
      paymentStatus,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ message: 'Order placed successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}
