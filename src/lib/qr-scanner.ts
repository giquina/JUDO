// QR Code utilities for check-in system

export interface QRCheckInData {
  classId: string;
  className?: string;
  date: string;
  timestamp: number;
}

export function parseQRData(rawData: string): QRCheckInData | null {
  try {
    const data = JSON.parse(rawData);
    if (data.classId) {
      return {
        classId: data.classId,
        className: data.className,
        date: data.date || new Date().toISOString().split("T")[0],
        timestamp: data.timestamp || Date.now(),
      };
    }
    return null;
  } catch {
    // If not valid JSON, return null
    return null;
  }
}

export function isQRCodeExpired(timestamp: number, expiryMinutes: number = 180): boolean {
  const now = Date.now();
  const diff = now - timestamp;
  const diffMinutes = diff / (1000 * 60);
  return diffMinutes > expiryMinutes;
}

export function generateCheckInId(memberId: string, classId: string, date: string): string {
  return `${memberId}-${classId}-${date}`;
}
