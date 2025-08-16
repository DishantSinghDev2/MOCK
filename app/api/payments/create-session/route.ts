import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { plan, billingCycle } = await request.json()

    // Get user's location for payment provider selection
    const country = request.headers.get("cf-ipcountry") || "US"
    const isIndia = country === "IN"

    // Calculate pricing
    const pricing = {
      pro: { monthly: 29, yearly: 290 },
      business: { monthly: 99, yearly: 990 },
    }

    const amount = pricing[plan as keyof typeof pricing]?.[billingCycle as keyof typeof pricing.pro]
    if (!amount) {
      return NextResponse.json({ error: "Invalid plan or billing cycle" }, { status: 400 })
    }

    if (isIndia) {
      // Use Razorpay for Indian customers
      const razorpayOptions = {
        amount: amount * 100, // Razorpay expects amount in paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1,
        notes: {
          plan,
          billingCycle,
          userId: session.user.id,
        },
      }

      // In production, you would create actual Razorpay order here
      return NextResponse.json({
        provider: "razorpay",
        sessionId: `rzp_test_${Date.now()}`,
        amount: amount * 80, // Convert USD to INR (approximate)
        currency: "INR",
        options: razorpayOptions,
      })
    } else {
      // Use PayPal for international customers
      const paypalOptions = {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount.toString(),
            },
            description: `MOCK by DIT ${plan} plan - ${billingCycle}`,
          },
        ],
        application_context: {
          return_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?success=true`,
          cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?cancelled=true`,
        },
      }

      // In production, you would create actual PayPal order here
      return NextResponse.json({
        provider: "paypal",
        sessionId: `pp_${Date.now()}`,
        amount,
        currency: "USD",
        options: paypalOptions,
      })
    }
  } catch (error) {
    console.error("Payment session creation error:", error)
    return NextResponse.json({ error: "Failed to create payment session" }, { status: 500 })
  }
}
