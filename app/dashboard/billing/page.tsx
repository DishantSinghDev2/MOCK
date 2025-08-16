import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BillingOverview } from "@/components/billing/billing-overview"
import { UsageMetrics } from "@/components/billing/usage-metrics"
import { PaymentMethods } from "@/components/billing/payment-methods"
import { InvoiceHistory } from "@/components/billing/invoice-history"
import { PlanManagement } from "@/components/billing/plan-management"

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Usage</h1>
        <p className="text-muted-foreground">Manage your subscription, usage, and payment methods</p>
      </div>

      <BillingOverview />

      <Tabs defaultValue="usage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="plan">Plan & Pricing</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-4">
          <Suspense fallback={<div>Loading usage metrics...</div>}>
            <UsageMetrics />
          </Suspense>
        </TabsContent>

        <TabsContent value="plan" className="space-y-4">
          <Suspense fallback={<div>Loading plan management...</div>}>
            <PlanManagement />
          </Suspense>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Suspense fallback={<div>Loading payment methods...</div>}>
            <PaymentMethods />
          </Suspense>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Suspense fallback={<div>Loading invoices...</div>}>
            <InvoiceHistory />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
