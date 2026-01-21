// Mock Payment Data for Testing Payment Components
import type { PaymentStatus } from "@/types"

export interface PaymentMethod {
  id: string
  type: "card" | "paypal" | "bank_transfer"
  brand?: "visa" | "mastercard" | "amex"
  last4?: string
  email?: string
  isDefault: boolean
}

export interface PaymentHistoryItem {
  id: string
  date: number
  amount: number
  currency: "GBP"
  status: PaymentStatus
  receiptNumber: string
  paymentMethod: PaymentMethod
  description: string
  subscriptionPeriodStart?: number
  subscriptionPeriodEnd?: number
  refundDate?: number
  failureReason?: string
}

// Mock payment methods
export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm_001",
    type: "card",
    brand: "visa",
    last4: "4242",
    isDefault: true,
  },
  {
    id: "pm_002",
    type: "card",
    brand: "mastercard",
    last4: "5555",
    isDefault: false,
  },
  {
    id: "pm_003",
    type: "paypal",
    email: "user@example.com",
    isDefault: false,
  },
]

// Generate 12 months of realistic payment history
const generatePaymentHistory = (): PaymentHistoryItem[] => {
  const now = Date.now()
  const oneMonth = 30 * 24 * 60 * 60 * 1000
  const payments: PaymentHistoryItem[] = []

  // Recent successful payment (5 days ago)
  payments.push({
    id: "pay_2024_001",
    date: now - 5 * 24 * 60 * 60 * 1000,
    amount: 6000, // £60
    currency: "GBP",
    status: "completed",
    receiptNumber: "RCP-2024-001234",
    paymentMethod: mockPaymentMethods[0],
    description: "Premium Membership - January 2026",
    subscriptionPeriodStart: now - 5 * 24 * 60 * 60 * 1000,
    subscriptionPeriodEnd: now + 25 * 24 * 60 * 60 * 1000,
  })

  // Pending payment (today)
  payments.push({
    id: "pay_2024_002",
    date: now - 1 * 60 * 60 * 1000,
    amount: 1500, // £15
    currency: "GBP",
    status: "pending",
    receiptNumber: "RCP-2024-001235",
    paymentMethod: mockPaymentMethods[0],
    description: "Drop-in Session",
  })

  // Failed payment attempt (3 weeks ago)
  payments.push({
    id: "pay_2023_012",
    date: now - 21 * 24 * 60 * 60 * 1000,
    amount: 6000,
    currency: "GBP",
    status: "failed",
    receiptNumber: "RCP-2023-001201",
    paymentMethod: mockPaymentMethods[1],
    description: "Premium Membership - December 2025",
    failureReason: "Insufficient funds",
  })

  // Generate monthly subscription payments for the past 11 months
  for (let i = 1; i <= 11; i++) {
    const paymentDate = now - i * oneMonth
    const isRefunded = i === 5 // Refund one payment from 5 months ago

    payments.push({
      id: `pay_2023_${String(11 - i).padStart(3, "0")}`,
      date: paymentDate,
      amount: i % 3 === 0 ? 4000 : 6000, // Mix of standard and premium
      currency: "GBP",
      status: isRefunded ? "refunded" : "completed",
      receiptNumber: `RCP-2023-${String(1190 + i).padStart(6, "0")}`,
      paymentMethod: i % 2 === 0 ? mockPaymentMethods[0] : mockPaymentMethods[1],
      description: `${i % 3 === 0 ? "Standard" : "Premium"} Membership - ${getMonthName(paymentDate)}`,
      subscriptionPeriodStart: paymentDate,
      subscriptionPeriodEnd: paymentDate + oneMonth,
      ...(isRefunded && { refundDate: paymentDate + 10 * 24 * 60 * 60 * 1000 }),
    })
  }

  // Add some one-off session payments
  payments.push({
    id: "pay_session_001",
    date: now - 15 * 24 * 60 * 60 * 1000,
    amount: 1500,
    currency: "GBP",
    status: "completed",
    receiptNumber: "RCP-2024-001150",
    paymentMethod: mockPaymentMethods[2],
    description: "Drop-in Session",
  })

  payments.push({
    id: "pay_session_002",
    date: now - 45 * 24 * 60 * 60 * 1000,
    amount: 1500,
    currency: "GBP",
    status: "completed",
    receiptNumber: "RCP-2023-001145",
    paymentMethod: mockPaymentMethods[0],
    description: "Drop-in Session",
  })

  return payments.sort((a, b) => b.date - a.date) // Sort by date descending
}

function getMonthName(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString("en-GB", { month: "long", year: "numeric" })
}

export const mockPaymentHistory = generatePaymentHistory()

// Calculate total spent
export const calculateTotalSpent = (payments: PaymentHistoryItem[]): number => {
  return payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0)
}

// Get upcoming payment (next billing date)
export const getUpcomingPayment = (): {
  date: number
  amount: number
  description: string
} => {
  const now = Date.now()
  const nextBillingDate = now + 25 * 24 * 60 * 60 * 1000 // 25 days from now

  return {
    date: nextBillingDate,
    amount: 6000,
    description: "Premium Membership - February 2026",
  }
}

// Export current user's subscription info
export const currentSubscription = {
  tier: "premium" as const,
  status: "active" as const,
  nextBillingDate: Date.now() + 25 * 24 * 60 * 60 * 1000,
  amount: 6000,
  paymentMethod: mockPaymentMethods[0],
  memberSince: Date.now() - 365 * 24 * 60 * 60 * 1000,
}
