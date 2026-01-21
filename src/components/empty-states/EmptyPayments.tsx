import { motion } from "framer-motion";
import { CreditCard, Plus, DollarSign, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyPaymentsProps {
  onAddPayment?: () => void;
  onSetupStripe?: () => void;
  filterApplied?: boolean;
}

export function EmptyPayments({
  onAddPayment,
  onSetupStripe,
  filterApplied,
}: EmptyPaymentsProps) {
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
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-yellow-500/20 rounded-full blur-2xl" />

        {/* Icon Container */}
        <div className="relative bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-8 rounded-full border border-amber-500/20">
          <CreditCard className="w-16 h-16 text-amber-500" />

          {/* Floating Dollar Sign */}
          <motion.div
            animate={{
              y: [-5, 5, -5],
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-2 -right-2 bg-gradient-to-br from-amber-500 to-yellow-500 p-2 rounded-full shadow-lg"
          >
            <DollarSign className="w-5 h-5 text-white" />
          </motion.div>

          {/* Trend Indicator */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -bottom-1 -left-1 bg-gradient-to-br from-green-500 to-emerald-500 p-1.5 rounded-full"
          >
            <TrendingUp className="w-4 h-4 text-white" />
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
        <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          {filterApplied ? "No Payments Found" : "No Payments Yet"}
        </h3>
        <p className="text-muted-foreground">
          {filterApplied
            ? "No payments match your current filters. Try adjusting your date range or status."
            : "Start tracking payments and membership fees. Accept payments online, manage subscriptions, and keep your club finances organized."}
        </p>
      </motion.div>

      {/* Actions */}
      {!filterApplied && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          {onAddPayment && (
            <Button onClick={onAddPayment} size="lg" className="gap-2">
              <Plus className="w-4 h-4" />
              Record Payment
            </Button>
          )}
          {onSetupStripe && (
            <Button
              onClick={onSetupStripe}
              variant="outline"
              size="lg"
              className="gap-2 border-amber-500/20 hover:bg-amber-500/10"
            >
              <CreditCard className="w-4 h-4" />
              Setup Online Payments
            </Button>
          )}
        </motion.div>
      )}

      {/* Feature Benefits */}
      {!filterApplied && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs"
        >
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/10">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-amber-500" />
            </div>
            <span className="font-medium">Track Revenue</span>
            <span className="text-muted-foreground text-center">
              Monitor all payments in one place
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/10">
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <span className="font-medium">Auto-Billing</span>
            <span className="text-muted-foreground text-center">
              Set up recurring payments
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border border-blue-500/10">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-blue-500" />
            </div>
            <span className="font-medium">Stripe Integration</span>
            <span className="text-muted-foreground text-center">
              Accept all payment methods
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
