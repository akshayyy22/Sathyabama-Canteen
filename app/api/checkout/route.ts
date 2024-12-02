import { NextResponse, NextRequest } from 'next/server';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library
import Stripe from 'stripe';
import { Client, Databases, ID, Storage } from 'appwrite';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const client = new Client();
client.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!).setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);
const databases = new Databases(client);
const storage = new Storage(client);

export async function POST(req: NextRequest) {
  try {
    const { items, totalAmount, stallId, customerEmail } = await req.json();

    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      throw new Error('Base URL is not set in environment variables.');
    }

    const successUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`;

    const lineItems = items.map((item: { name: string; price: number; quantity: number }) => ({
      price_data: {
        currency: 'inr',  // Adjust currency as needed
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,  // Convert to smallest currency unit (e.g., cents)
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        stallId,
      },
      customer_email: customerEmail, // Add customer's email
      billing_address_collection: 'required', // Request billing address
      shipping_address_collection: {
        allowed_countries: ['IN'], // Allow shipping addresses from India
      },
    });

    // Generate a unique ID for the QR code and the file
    const qrCodeFileId = uuidv4();

    // Generate QR code using the same ID
    const qrCodeBuffer = await QRCode.toBuffer(qrCodeFileId); // Get buffer of the QR code image

    // Convert buffer to File
    const qrCodeFile = new File([qrCodeBuffer], 'qrcode.png', { type: 'image/png' });

    // Upload QR code to Appwrite Storage
    await storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!,
      qrCodeFileId,
      qrCodeFile
    );

    const userId = session.id;

    // Store the order details in Appwrite Database
    await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!,
      ID.unique(),
      {
        customerId: userId,
        stallId: stallId,
        items: items.map((item: { name: string; price: number; quantity: number }) => 
          `Name: ${item.name}, Price: ${item.price}, Quantity: ${item.quantity}`
        ),
        totalAmount: totalAmount,
        orderStatus: 'pending',
        qrCode: qrCodeFileId, // Store the same file ID as the QR code reference
        paymentStatus: 'paid',
        timestamp: new Date().toISOString(),
      }
    );

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
