import { motion } from "framer-motion";
import { ClipboardCheck, QrCode, UserCheck, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyAttendanceProps {
  onStartTracking?: () => void;
  onScanQR?: () => void;
  dateRange?: string;
}

export function EmptyAttendance({
  onStartTracking,
  onScanQR,
  dateRange,
}: EmptyAttendanceProps) {
  const hasDateFilter = dateRange && dateRange.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.2,
        }}
        className="relative mb-8"
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-violet-500/20 to-purple-500/20 rounded-full blur-2xl" />

        {/* Icon Container */}
        <div className="relative bg-gradient-to-br from-indigo-500/10 to-violet-500/10 p-8 rounded-full border border-indigo-500/20">
          <ClipboardCheck className="w-16 h-16 text-indigo-500" />

          {/* Floating Checkmarks */}
          <motion.div
            animate={{
              y: [-8, 8, -8],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-2 -right-2 bg-gradient-to-br from-green-500 to-emerald-500 p-2 rounded-full shadow-lg"
          >
            <UserCheck className="w-5 h-5 text-white" />
          </motion.div>

          {/* QR Code Indicator */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, -10, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -bottom-2 -left-2 bg-gradient-to-br from-indigo-500 to-purple-500 p-2 rounded-md shadow-lg"
          >
            <QrCode className="w-5 h-5 text-white" />
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-3 mb-8 max-w-md"
      >
        <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {hasDateFilter ? "No Attendance Records" : "Start Tracking Attendance"}
        </h3>
        <p className="text-muted-foreground">
          {hasDateFilter
            ? `No attendance records found for ${dateRange}. Students may not have checked in yet.`
            : "Keep track of who's training with our easy check-in system. Use QR codes for quick scanning or manual check-ins."}
        </p>
      </motion.div>

      {/* Actions */}
      {!hasDateFilter && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          {onScanQR && (
            <Button onClick={onScanQR} size="lg" className="gap-2">
              <QrCode className="w-4 h-4" />
              Scan QR Code
            </Button>
          )}
          {onStartTracking && (
            <Button onClick={onStartTracking} variant="outline" size="lg" className="gap-2">
              <UserCheck className="w-4 h-4" />
              Manual Check-in
            </Button>
          )}
        </motion.div>
      )}

      {/* Info Cards */}
      {!hasDateFilter && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg text-xs"
        >
          <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-indigo-500/5 to-violet-500/5 border border-indigo-500/10 text-left">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
              <QrCode className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="space-y-1">
              <span className="font-medium block">QR Code Check-in</span>
              <span className="text-muted-foreground">
                Members scan their unique QR code for instant check-in
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/10 text-left">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-purple-500" />
            </div>
            <div className="space-y-1">
              <span className="font-medium block">Attendance History</span>
              <span className="text-muted-foreground">
                Track participation patterns and generate reports
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
