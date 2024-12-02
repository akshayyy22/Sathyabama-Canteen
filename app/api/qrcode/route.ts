import { NextResponse } from 'next/server';
import { databases , Query } from '@/lib/appwrite';

export async function POST(req: Request) {
  const { qrCode } = await req.json();

  // Fetch order by QR code
  const response = await databases.listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!,
    [Query.equal('qrCode', qrCode)]
  );

  const order = response.documents[0];

  if (!order) {
    return NextResponse.json({ error: 'QR Code not found' }, { status: 404 });
  }

  // Update order status to 'served' and mark QR code as expired
  await databases.updateDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!,
    order.$id,
    { orderStatus: 'served', qrCode: '' }
  );

  return NextResponse.json({ success: true });
}
