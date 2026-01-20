import { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CheckInQRProps {
  onCheckIn: (classId: string) => void;
  isLoading?: boolean;
}

export default function CheckInQR({ onCheckIn, isLoading }: CheckInQRProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (isScanning && !scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        false
      );

      scannerRef.current.render(
        (decodedText) => {
          // Parse QR code data
          try {
            const data = JSON.parse(decodedText);
            if (data.classId) {
              setScanResult(data.classId);
              onCheckIn(data.classId);
              stopScanning();
            }
          } catch {
            // If not JSON, treat as plain class ID
            setScanResult(decodedText);
            onCheckIn(decodedText);
            stopScanning();
          }
        },
        (errorMessage) => {
          // Ignore scan errors (no QR detected yet)
          console.log(errorMessage);
        }
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, [isScanning, onCheckIn]);

  const startScanning = () => {
    setError(null);
    setScanResult(null);
    setIsScanning(true);
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">📱</span>
          QR Code Check-In
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isScanning ? (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Scan the QR code displayed at your class to check in
            </p>
            <Button
              onClick={startScanning}
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Checking in..." : "Start Scanner"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div id="qr-reader" className="rounded-lg overflow-hidden" />
            <Button
              onClick={stopScanning}
              variant="outline"
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        )}

        {scanResult && (
          <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg text-center">
            <p className="text-green-800 dark:text-green-200 font-medium">
              ✅ Successfully checked in!
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900 rounded-lg text-center">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
