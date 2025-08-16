"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Plus, Trash2, MapPin } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PaymentMethod {
  id: string
  type: "card" | "paypal" | "razorpay"
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  email?: string
  isDefault: boolean
}

export function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "pm_1",
      type: "card",
      last4: "4242",
      brand: "visa",
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
    },
    {
      id: "pm_2",
      type: "paypal",
      email: "user@example.com",
      isDefault: false,
    },
  ])

  const [userLocation, setUserLocation] = useState<string>("US")
  const [isAddingPayment, setIsAddingPayment] = useState(false)

  // Simulate geolocation detection
  useEffect(() => {
    // In a real app, you'd use a geolocation service
    const detectLocation = () => {
      // Simulate different locations for demo
      const locations = ["IN", "US", "GB", "CA"]
      const randomLocation = locations[Math.floor(Math.random() * locations.length)]
      setUserLocation(randomLocation)
    }
    detectLocation()
  }, [])

  const getPaymentProviders = (location: string) => {
    if (location === "IN") {
      return [
        { id: "razorpay", name: "Razorpay", description: "UPI, Cards, Net Banking" },
        { id: "card", name: "Credit/Debit Card", description: "Visa, Mastercard, Amex" },
      ]
    }
    return [
      { id: "paypal", name: "PayPal", description: "PayPal account or card" },
      { id: "card", name: "Credit/Debit Card", description: "Visa, Mastercard, Amex" },
    ]
  }

  const removePaymentMethod = (id: string) => {
    setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id))
  }

  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((pm) => ({
        ...pm,
        isDefault: pm.id === id,
      })),
    )
  }

  const getCardIcon = (brand: string) => {
    // In a real app, you'd use actual card brand icons
    return <CreditCard className="h-6 w-6" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payment Methods</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Detected location: {userLocation}</span>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>Choose a payment method based on your location ({userLocation})</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4">
                {getPaymentProviders(userLocation).map((provider) => (
                  <Card key={provider.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{provider.name}</h4>
                          <p className="text-sm text-muted-foreground">{provider.description}</p>
                        </div>
                        <Button size="sm">Select</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {userLocation === "IN" && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900">Razorpay for India</h4>
                  <p className="text-sm text-blue-700">
                    Optimized for Indian customers with UPI, Net Banking, and local card support
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {paymentMethods.map((method) => (
          <Card key={method.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {method.type === "card" ? (
                    getCardIcon(method.brand || "")
                  ) : method.type === "paypal" ? (
                    <div className="w-6 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                      PP
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-blue-500 rounded text-white text-xs flex items-center justify-center">
                      RP
                    </div>
                  )}
                  <div>
                    {method.type === "card" ? (
                      <div>
                        <div className="font-semibold">
                          {method.brand?.toUpperCase()} •••• {method.last4}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Expires {method.expiryMonth}/{method.expiryYear}
                        </div>
                      </div>
                    ) : method.type === "paypal" ? (
                      <div>
                        <div className="font-semibold">PayPal</div>
                        <div className="text-sm text-muted-foreground">{method.email}</div>
                      </div>
                    ) : (
                      <div>
                        <div className="font-semibold">Razorpay</div>
                        <div className="text-sm text-muted-foreground">UPI & Cards</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {method.isDefault && <Badge variant="default">Default</Badge>}
                  {!method.isDefault && (
                    <Button variant="outline" size="sm" onClick={() => setDefaultPaymentMethod(method.id)}>
                      Set Default
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => removePaymentMethod(method.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
          <CardDescription>Update your billing address and tax information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="company">Company Name</Label>
              <Input id="company" placeholder="Your Company" />
            </div>
            <div>
              <Label htmlFor="tax-id">Tax ID / GST Number</Label>
              <Input id="tax-id" placeholder="Tax identification number" />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Select defaultValue={userLocation}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN">India</SelectItem>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="GB">United Kingdom</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="Street address" />
            </div>
          </div>
          <Button>Update Billing Information</Button>
        </CardContent>
      </Card>
    </div>
  )
}
