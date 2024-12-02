"use client"; // Use this to make the component a Client Component
import confetti from "canvas-confetti";
import jsPDF from 'jspdf';
import { Client, Databases, Query } from "appwrite";
import QRCodeImage from "@/components/QRCodeImage"; // Import the new Client Component
import styles from "@/components/Ticket.module.css";
import { useEffect, useState , useRef } from "react";
import { toPng } from 'html-to-image'; // To convert the HTML to an image

const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);
const databases = new Databases(client);

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const receiptRef = useRef<HTMLDivElement>(null); // Reference to the receipt div
  const sessionId = searchParams.session_id as string;

  useEffect(() => {
    if (!sessionId) return;

    const fetchOrder = async () => {
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!,
        [Query.equal("customerId", sessionId)]
      );

      if (response.documents.length > 0) {
        setOrder(response.documents[0]);
      }

      setLoading(false);
    };

    fetchOrder();
  }, [sessionId]);

  if (!sessionId) {
    return <p className="text-center text-red-500">Invalid session ID.</p>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center space-x-2">
          <div className="animate-pulse rounded-full bg-gray-500 h-12 w-12"></div>
          <div className="space-y-2">
            <div className="animate-pulse rounded-md bg-gray-500 h-4 w-[200px]"></div>
            <div className="animate-pulse rounded-md bg-gray-500 h-4 w-[170px]"></div>
          </div>
        </div>
      </div>
    );
  }
  

  if (!order) {
    return <p className="text-center text-red-500">Order not found.</p>;
  }

  const qrCodeUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID}/files/${order.qrCode}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&mode=admin`;

  return (
    <div className={styles.fullScreenContainer}>
      <div className={styles.celebrationCanvas}></div> {/* Celebration effect */}
      <div className={styles.ticketContainer} onMouseEnter={triggerCelebration}>
        <h1 className={styles.title}>Order Receipt</h1>
        <p className={styles.orderId}>Order ID: <strong>{order.$id}</strong></p>
        <p className={styles.totalAmount}>Total Amount: ₹<strong>{order.totalAmount}</strong></p>
        <p className={styles.stallId}>Stall ID: {order.stallId}</p>
        <p className={styles.orderStatus}>Order Status: {order.orderStatus}</p>
        <p className={styles.paymentStatus}>Payment Status: {order.paymentStatus}</p>

        <h2 className={styles.itemsTitle}>Items Ordered</h2>
        <ul className={styles.itemsList}>
          {order.items.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <QRCodeImage src={qrCodeUrl} alt="QR Code" className={styles.qrCode} />

        <div className={styles.actions}>
        <button 
          onClick={() => downloadReceipt(receiptRef, order.$id)} // Correctly passing both arguments
          className={styles.downloadBtn}
        >
            Download
          </button>
          <button className={styles.goBackBtn} onClick={() => window.location.href = '/dashboard'}>
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  );
}


function triggerCelebration() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
}

async function downloadReceipt(receiptRef: React.RefObject<HTMLDivElement>, orderId: string) {
  if (receiptRef.current) {
    // Convert the receipt HTML to an image
    try {
      const imgData = await toPng(receiptRef.current, { quality: 1.0 }); // Set quality as needed

      const pdf = new jsPDF('portrait', 'pt', 'a4');

      // Get image dimensions and adjust for PDF
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = pdf.internal.pageSize.getHeight();
      
      // Add the image to the PDF
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`receipt_${orderId}.pdf`);
    } catch (error) {
      console.error('Error downloading receipt:', error);
    }
  } else {
    console.error('Receipt reference is null');
  }
}