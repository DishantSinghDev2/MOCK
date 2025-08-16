"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Download, Search, Eye } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Invoice {
  id: string
  number: string
  date: string
  amount: number
  currency: string
  status: "paid" | "pending" | "failed"
  description: string
  downloadUrl?: string
}

const mockInvoices: Invoice[] = [
  {
    id: "inv_001",
    number: "INV-2024-001",
    date: "2024-01-15",
    amount: 29.0,
    currency: "USD",
    status: "paid",
    description: "Pro Plan - January 2024",
    downloadUrl: "#",
  },
  {
    id: "inv_002",
    number: "INV-2023-012",
    date: "2023-12-15",
    amount: 29.0,
    currency: "USD",
    status: "paid",
    description: "Pro Plan - December 2023",
    downloadUrl: "#",
  },
  {
    id: "inv_003",
    number: "INV-2023-011",
    date: "2023-11-15",
    amount: 34.5,
    currency: "USD",
    status: "paid",
    description: "Pro Plan + Overages - November 2023",
    downloadUrl: "#",
  },
  {
    id: "inv_004",
    number: "INV-2023-010",
    date: "2023-10-15",
    amount: 29.0,
    currency: "USD",
    status: "failed",
    description: "Pro Plan - October 2023",
  },
]

export function InvoiceHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredInvoices, setFilteredInvoices] = useState(mockInvoices)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = mockInvoices.filter(
      (invoice) =>
        invoice.number.toLowerCase().includes(term.toLowerCase()) ||
        invoice.description.toLowerCase().includes(term.toLowerCase()),
    )
    setFilteredInvoices(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "default"
      case "pending":
        return "secondary"
      case "failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  const totalPaid = mockInvoices.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.amount, 0)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPaid.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Year</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$348.00</div>
            <p className="text-xs text-muted-foreground">2024 total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">1</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Invoice History</CardTitle>
              <CardDescription>Download and manage your invoices</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {filteredInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(invoice.status)}`} />
                    <div>
                      <div className="font-semibold">{invoice.number}</div>
                      <div className="text-sm text-muted-foreground">{invoice.description}</div>
                      <div className="text-xs text-muted-foreground">{new Date(invoice.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold">
                        {invoice.currency} {invoice.amount.toFixed(2)}
                      </div>
                      <Badge variant={getStatusVariant(invoice.status)} className="text-xs">
                        {invoice.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {invoice.downloadUrl && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
