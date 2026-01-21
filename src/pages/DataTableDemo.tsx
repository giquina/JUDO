import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MembersTable,
  PaymentsTable,
  AttendanceTable,
  ClassesTable,
} from "@/components/tables"
import {
  mockMembers,
  mockPayments,
  mockAttendance,
  mockClasses,
  memberNamesMap,
  classNamesMap,
  coachNamesMap,
} from "@/lib/mockTableData"
import type { Member, Payment, AttendanceRecord, JudoClass } from "@/types"
import { toast } from "sonner"

export default function DataTableDemo() {
  const [isLoading] = useState(false)

  // Member handlers
  const handleMemberEdit = (member: Member) => {
    toast.info(`Edit member: ${member.name}`)
    console.log("Edit member:", member)
  }

  const handleMemberDelete = (member: Member) => {
    toast.error(`Delete member: ${member.name}`)
    console.log("Delete member:", member)
  }

  const handleMemberViewDetails = (member: Member) => {
    toast.info(`View details: ${member.name}`)
    console.log("View details:", member)
  }

  const handleManageSubscription = (member: Member) => {
    toast.info(`Manage subscription: ${member.name}`)
    console.log("Manage subscription:", member)
  }

  const handleEmailMember = (member: Member) => {
    toast.success(`Email sent to: ${member.email}`)
    console.log("Email member:", member)
  }

  // Payment handlers
  const handleViewReceipt = (payment: Payment) => {
    toast.info(`View receipt: ${payment._id}`)
    console.log("View receipt:", payment)
  }

  const handleRefund = (payment: Payment) => {
    toast.error(`Refund payment: ${payment._id}`)
    console.log("Refund payment:", payment)
  }

  const handleResendReceipt = (payment: Payment) => {
    toast.success(`Receipt resent for: ${payment._id}`)
    console.log("Resend receipt:", payment)
  }

  // Attendance handlers
  const handleAttendanceEdit = (record: AttendanceRecord) => {
    toast.info(`Edit attendance: ${record._id}`)
    console.log("Edit attendance:", record)
  }

  const handleAttendanceDelete = (record: AttendanceRecord) => {
    toast.error(`Delete attendance: ${record._id}`)
    console.log("Delete attendance:", record)
  }

  const handleAttendanceViewDetails = (record: AttendanceRecord) => {
    toast.info(`View attendance details: ${record._id}`)
    console.log("View attendance details:", record)
  }

  // Class handlers
  const handleClassEdit = (judoClass: JudoClass) => {
    toast.info(`Edit class: ${judoClass.name}`)
    console.log("Edit class:", judoClass)
  }

  const handleClassDelete = (judoClass: JudoClass) => {
    toast.error(`Delete class: ${judoClass.name}`)
    console.log("Delete class:", judoClass)
  }

  const handleClassViewDetails = (judoClass: JudoClass) => {
    toast.info(`View class details: ${judoClass.name}`)
    console.log("View class details:", judoClass)
  }

  const handleToggleActive = (judoClass: JudoClass) => {
    const newStatus = !judoClass.active
    toast.success(`Class ${newStatus ? "activated" : "deactivated"}: ${judoClass.name}`)
    console.log("Toggle active:", judoClass)
  }

  const handleGenerateQR = (judoClass: JudoClass) => {
    toast.success(`QR code generated for: ${judoClass.name}`)
    console.log("Generate QR:", judoClass)
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">DataTable Component Demo</h1>
        <p className="text-muted-foreground text-lg">
          Comprehensive, reusable data tables with advanced features
        </p>
      </div>

      {/* Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
          <CardDescription>
            All tables include the following capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold">Sorting & Filtering</h3>
              <ul className="text-sm text-muted-foreground list-disc list-inside">
                <li>Multi-column sorting</li>
                <li>Global search</li>
                <li>Column-specific filters</li>
              </ul>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold">Selection & Actions</h3>
              <ul className="text-sm text-muted-foreground list-disc list-inside">
                <li>Bulk row selection</li>
                <li>Bulk actions toolbar</li>
                <li>Row-level actions menu</li>
              </ul>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold">Customization</h3>
              <ul className="text-sm text-muted-foreground list-disc list-inside">
                <li>Column visibility toggle</li>
                <li>Density options</li>
                <li>Export functionality</li>
              </ul>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold">Pagination</h3>
              <ul className="text-sm text-muted-foreground list-disc list-inside">
                <li>Multiple page sizes</li>
                <li>Page navigation</li>
                <li>Selection counts</li>
              </ul>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold">States</h3>
              <ul className="text-sm text-muted-foreground list-disc list-inside">
                <li>Loading skeletons</li>
                <li>Empty states</li>
                <li>Error handling</li>
              </ul>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold">UX</h3>
              <ul className="text-sm text-muted-foreground list-disc list-inside">
                <li>Sticky header</li>
                <li>Alternating rows</li>
                <li>Dark mode support</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tables */}
      <Tabs defaultValue="members" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Members Table</CardTitle>
              <CardDescription>
                Manage club members with subscription details and belt ranks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MembersTable
                data={mockMembers}
                isLoading={isLoading}
                onEdit={handleMemberEdit}
                onDelete={handleMemberDelete}
                onViewDetails={handleMemberViewDetails}
                onManageSubscription={handleManageSubscription}
                onEmail={handleEmailMember}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payments Table</CardTitle>
              <CardDescription>
                Track all transactions, subscriptions, and refunds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentsTable
                data={mockPayments}
                isLoading={isLoading}
                onViewReceipt={handleViewReceipt}
                onRefund={handleRefund}
                onResend={handleResendReceipt}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Table</CardTitle>
              <CardDescription>
                Monitor class attendance and check-in records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceTable
                data={mockAttendance}
                isLoading={isLoading}
                onEdit={handleAttendanceEdit}
                onDelete={handleAttendanceDelete}
                onViewDetails={handleAttendanceViewDetails}
                memberNames={memberNamesMap}
                classNames={classNamesMap}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Classes Table</CardTitle>
              <CardDescription>
                Schedule and manage judo classes with capacity tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClassesTable
                data={mockClasses}
                isLoading={isLoading}
                onEdit={handleClassEdit}
                onDelete={handleClassDelete}
                onViewDetails={handleClassViewDetails}
                onToggleActive={handleToggleActive}
                onGenerateQR={handleGenerateQR}
                coachNames={coachNamesMap}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Code Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Example</CardTitle>
          <CardDescription>
            How to implement the DataTable in your components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`import { MembersTable } from "@/components/tables"

function MembersPage() {
  const { data, isLoading } = useQuery({ ... })

  const handleEdit = (member) => {
    // Your edit logic
  }

  return (
    <MembersTable
      data={data}
      isLoading={isLoading}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onViewDetails={handleViewDetails}
    />
  )
}`}</code>
          </pre>
        </CardContent>
      </Card>

      {/* Custom Table Example */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Table Example</CardTitle>
          <CardDescription>
            Create your own table with the DataTable component
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`import { DataTable, createActionColumn } from "@/components/DataTable"

const columns = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  createActionColumn([
    {
      label: "Edit",
      onClick: (row) => console.log("Edit", row),
    },
  ]),
]

<DataTable
  columns={columns}
  data={yourData}
  searchPlaceholder="Search..."
  bulkActions={[
    {
      label: "Delete Selected",
      onClick: (rows) => console.log(rows),
      variant: "destructive",
    },
  ]}
/>`}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
