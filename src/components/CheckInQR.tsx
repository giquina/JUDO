import { useState, useEffect, useRef, useCallback } from "react";
import type { Html5QrcodeScanner } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface CheckInQRProps {
  onCheckIn: (classId: string) => void;
  isLoading?: boolean;
}

export default function CheckInQR({ onCheckIn, isLoading }: CheckInQRProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [isLibraryLoading, setIsLibraryLoading] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const stopScanning = useCallback(() => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
      scannerRef.current = null;
    }
    setIsScanning(false);
  }, []);

  useEffect(() => {
    if (!isScanning || scannerRef.current) return;

    let mounted = true;

    const initializeScanner = async () => {
      try {
        setIsLibraryLoading(true);

        // Dynamically import the library only when scanner is activated
        const { Html5QrcodeScanner } = await import("html5-qrcode");

        if (!mounted) return;

        setIsLibraryLoading(false);

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
      } catch (err) {
        if (mounted) {
          setIsLibraryLoading(false);
          setError("Failed to load QR scanner. Please try again.");
          setIsScanning(false);
          console.error("Failed to load html5-qrcode:", err);
        }
      }
    };

    initializeScanner();

    return () => {
      mounted = false;
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, [isScanning, onCheckIn, stopScanning]);

  const startScanning = () => {
    setError(null);
    setScanResult(null);
    setIsScanning(true);
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
            {isLibraryLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Loading scanner...</p>
              </div>
            ) : (
              <div id="qr-reader" className="rounded-lg overflow-hidden" />
            )}
            <Button
              onClick={stopScanning}
              variant="outline"
              className="w-full"
              disabled={isLibraryLoading}
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
