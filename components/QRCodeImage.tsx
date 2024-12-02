// components/QRCodeImage.tsx

'use client';

import { useState } from "react";

interface QRCodeImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function QRCodeImage({ src, alt, className, style }: QRCodeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    setImgSrc("/fallback-image.png"); // Use a fallback image if QR code fails to load
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      style={style}
      onError={handleError} // Trigger fallback on error
    />
  );
}
