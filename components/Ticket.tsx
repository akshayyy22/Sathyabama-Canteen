// components/Ticket.tsx

"use client";



import React from 'react';
import styles from './Ticket.module.css';

import QRCodeImage from "@/components/QRCodeImage";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface TicketProps {
  order: any;
  qrCodeUrl: string;
}

const Ticket: React.FC<TicketProps> = ({ order, qrCodeUrl }) => {
  const handleDownload = async () => {
    const ticketElement = document.getElementById("ticket");
    if (!ticketElement) return;

    const canvas = await html2canvas(ticketElement);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 0, 0, 210, 297); // A4 size
    pdf.save(`Order_${order.$id}.pdf`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.ticketBasic}>
        <p>Admit One</p>
      </div>

      <div className={styles.ticketAirline} id="ticket">
        <div className={styles.top}>
          <h1>Order Success</h1>
          <div className={styles.topSideleft}>
            <p className={styles.from}>Order ID:</p>
            <p className={styles.to}>{order.$id}</p>
          </div>
          <div className={styles.topSide}>
            <p>Total Amount:</p>
            <p>₹{order.totalAmount}</p>
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.column}>
            <div className={`${styles.row} ${styles.row1}`}>
              <p>
                <span>Stall ID:</span> {order.stallId}
              </p>
              <p className={styles.rowRight}>
                <span>Order Status:</span> {order.orderStatus}
              </p>
            </div>
            <div className={`${styles.row} ${styles.row2}`}>
              <p>
                <span>Payment Status:</span> {order.paymentStatus}
              </p>
              <p className={styles.rowCenter}>
                <span>Items:</span>
              </p>
              <ul className={`${styles.row} ${styles.row2}`}>
                {order.items.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className={styles.barCode}>
            <QRCodeImage
              src={qrCodeUrl}
              alt="QR Code"
              className="mx-auto rounded-lg border border-gray-300 mt"
              style={{ maxWidth: "300px", maxHeight: "300px" }}
            />
          </div>
        </div>
      </div>
      <button
        onClick={handleDownload}
        className="mt-4 p-2 bg-blue-500 text-white rounded-lg"
      >
        Download Ticket
      </button>
    </div>
  );
};

export default Ticket;
