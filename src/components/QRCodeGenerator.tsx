import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QRCodeGeneratorProps {
  classId: string;
  className: string;
}

export default function QRCodeGenerator({ classId, className }: QRCodeGeneratorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const generateQR = async () => {
      const data = JSON.stringify({
        classId,
        className,
        date: new Date().toISOString().split("T")[0],
        timestamp: Date.now(),
      });

      try {
        const url = await QRCode.toDataURL(data, {
          width: 400,
          margin: 2,
          color: {
            dark: "#1e40af",
            light: "#ffffff",
          },
        });
        setQrCodeUrl(url);
      } catch (err) {
        console.error("Error generating QR code:", err);
      }
    };

    generateQR();
  }, [classId, className]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (isFullscreen) {
    return (
      <div
        className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col items-center justify-center p-8"
        onClick={toggleFullscreen}
      >
        <h2 className="text-3xl font-bold mb-4 text-center">{className}</h2>
        <p className="text-xl text-muted-foreground mb-8">Scan to check in</p>
        {qrCodeUrl && (
          <img
            src={qrCodeUrl}
            alt="Class QR Code"
            className="w-80 h-80 md:w-96 md:h-96"
          />
        )}
        <p className="mt-8 text-muted-foreground">Tap anywhere to close</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{className}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        {qrCodeUrl ? (
          <img
            src={qrCodeUrl}
            alt="Class QR Code"
            className="w-48 h-48"
          />
        ) : (
          <div className="w-48 h-48 bg-muted animate-pulse rounded" />
        )}
        <Button onClick={toggleFullscreen} variant="outline" className="w-full">
          Display Fullscreen
        </Button>
      </CardContent>
    </Card>
  );
}
