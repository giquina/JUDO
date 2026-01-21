import { useState } from "react"
import {
  PaymentHistoryCard,
  PaymentHistoryModal,
  SubscriptionManagement,
  ProfileCard,
} from "@/components/dashboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/**
 * Dashboard Demo Page
 *
 * This demo page shows how to integrate all the new dashboard components:
 * - ProfileCard: Displays user profile with quick stats and actions
 * - PaymentHistoryCard: Shows recent payment history
 * - PaymentHistoryModal: Full payment history with filters and export
 * - SubscriptionManagement: Manage subscription tiers and payment methods
 *
 * Usage:
 * 1. Import the components you need from @/components/dashboard
 * 2. Add state for modals (e.g., payment history modal)
 * 3. Wire up event handlers (e.g., onViewAll opens the modal)
 */
export function DashboardDemo() {
  const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState(false)

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Dashboard Demo</h1>
        <p className="text-muted-foreground">
          Demonstration of all payment and profile components
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        {/* Overview Tab - Shows Profile and Recent Payments */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ProfileCard />
            <PaymentHistoryCard
              onViewAll={() => setShowPaymentHistoryModal(true)}
            />
          </div>
        </TabsContent>

        {/* Subscription Tab - Full subscription management */}
        <TabsContent value="subscription" className="space-y-6">
          <SubscriptionManagement />
        </TabsContent>

        {/* Profile Tab - Just the profile card for focused editing */}
        <TabsContent value="profile" className="space-y-6">
          <div className="mx-auto max-w-2xl">
            <ProfileCard />
          </div>
        </TabsContent>
      </Tabs>

      {/* Payment History Modal */}
      <PaymentHistoryModal
        open={showPaymentHistoryModal}
        onOpenChange={setShowPaymentHistoryModal}
      />
    </div>
  )
}

export default DashboardDemo
