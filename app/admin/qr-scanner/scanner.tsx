"use client";

import React, { useRef, useState, useEffect } from "react";
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { Button } from "@/components/ui/button";
import { databases } from "@/lib/appwrite"; // Ensure this file is properly configured for Appwrite client
import { Query } from "appwrite";

const VerifyQRPage = () => {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [verifying, setVerifying] = useState<boolean>(false); // Prevent multiple verifications

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    if (videoRef.current && !verifying) {
      codeReader
        .decodeFromVideoDevice(null, videoRef.current, async (result, err) => {
          if (result) {
            const qrCodeText = result.getText();
            setScannedData(qrCodeText);
            setIsScanning(false);

            // Only verify if we're not already in the process of verifying another code
            if (!verifying) {
              setVerifying(true); // Set verifying flag
              await verifyQRCode(qrCodeText);
            }
          } else if (err instanceof NotFoundException) {
            setError("QR code not found. Please try again.");
          } else {
            setError("An error occurred while scanning the QR code.");
          }
        })
        .catch((err) => {
          setError("An error occurred while initializing the QR code scanner.");
        });

      return () => {
        codeReader.reset();
      };
    }
  }, [verifying]); // Rerun effect only when verifying state changes

  const verifyQRCode = async (qrCode: string) => {
    try {
      const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
      const ordersCollectionId = process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID;

      if (!databaseId || !ordersCollectionId) {
        throw new Error("Missing environment variables for Appwrite configuration.");
      }

      const response = await databases.listDocuments(
        databaseId,
        ordersCollectionId,
        [Query.equal("qrCode", qrCode)]
      );

      if (response.total > 0) {
        const order = response.documents[0];
        if (order.orderStatus === "completed") {
          setVerificationStatus("This QR code has already been used.");
        } else {
          await databases.updateDocument(
            databaseId,
            ordersCollectionId,
            order.$id,
            { orderStatus: "completed" }
          );
          setVerificationStatus("Order verified and marked as completed.");
        }
      } else {
        setVerificationStatus("Invalid QR code.");
      }
    } catch (err) {
      setError("Failed to verify the QR code.");
    } finally {
      setVerifying(false); // Reset verifying state after the verification is done
    }
  };

  const handleRetry = () => {
    setScannedData(null);
    setError(null);
    setVerificationStatus(null);
    setIsScanning(true);
    setVerifying(false); // Reset the verifying state to allow new verifications
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">QR Code Verification</h1>
      {isScanning ? (
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md mb-4">
            <video ref={videoRef} style={{ width: '100%' }} />
          </div>
          <p className="text-gray-500">Point the camera at a QR code to scan.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {scannedData ? (
            <div className="card bg-base-100 shadow-xl w-full max-w-md p-4">
              <h2 className="card-title font-semibold mb-2">Scanned Data</h2>
              <p className="text-sm mb-4">{scannedData}</p>
              {verificationStatus && (
                <p className={`text-sm mb-4 ${verificationStatus.includes("Invalid") ? "text-red-500" : "text-green-500"}`}>
                  {verificationStatus}
                </p>
              )}
              <Button onClick={handleRetry} variant="outline">Scan Another</Button>
            </div>
          ) : (
            <div className="card bg-base-100 shadow-xl w-full max-w-md p-4">
              <h2 className="card-title font-semibold mb-2">Error</h2>
              <p className="text-sm mb-4">{error}</p>
              <Button onClick={handleRetry} variant="outline">Retry</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VerifyQRPage;
