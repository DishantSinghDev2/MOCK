import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, Zap, Users, Building, ArrowRight, Star } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Pricing - MOCK by DIT",
  description: "Choose the perfect plan for your API development needs. Start free, scale as you grow.",
}

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for individual developers and small projects",
    icon: <Zap className="h-6 w-6" />,
    popular: false,
    features: [
      { name: "3 projects", included: true },
      { name: "10 mock endpoints per project", included: true },
      { name: "100 test runs per month", included: true },
      { name: "7 days log retention", included: true },
      { name: "Community support", included: true },
      { name: "Basic integrations", included: true },
      { name: "AI-powered discovery", included: true },
      { name: "Visual API builder", included: true },
      { name: "Advanced AI insights", included: false },
      { name: "Custom scenarios", included: false },
      { name: "Team collaboration", included: false },
      { name: "Priority support", included: false },
    ],
    cta: "Start Free",
    ctaVariant: "outline" as const,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "Ideal for professional developers and growing teams",
    icon: <Users className="h-6 w-6" />,
    popular: true,
    features: [
      { name: "Unlimited projects", included: true },
      { name: "Unlimited mock endpoints", included: true },
      { name: "10,000 test runs per month", included: true },
      { name: "30 days log retention", included: true },
      { name: "Priority support", included: true },
      { name: "Advanced integrations", included: true },
      { name: "AI-powered discovery", included: true },
      { name: "Visual API builder", included: true },
      { name: "Advanced AI insights", included: true },
      { name: "Custom scenarios", included: true },
      { name: "Team collaboration (5 members)", included: true },
      { name: "Real-time collaboration", included: true },
    ],
    cta: "Start Pro Trial",
    ctaVariant: "default" as const,
  },
  {
    name: "Business",
    price: "$99",
    period: "per month",
    description: "For large teams and enterprise organizations",
    icon: <Building className="h-6 w-6" />,
    popular: false,
    features: [
      { name: "Everything in Pro", included: true },
      { name: "Unlimited team members", included: true },
      { name: "100,000 test runs per month", included: true },
      { name: "90 days log retention", included: true },
      { name: "SSO & RBAC", included: true },
      { name: "Audit logs", included: true },
      { name: "SLA guarantee (99.9%)", included: true },
      { name: "Dedicated support", included: true },
      { name: "Custom integrations", included: true },
      { name: "Advanced security features", included: true },
      { name: "Priority feature requests", included: true },
      { name: "Custom deployment options", included: true },
    ],
    cta: "Contact Sales",
    ctaVariant: "outline" as const,
  },
]

const usageBasedPricing = [
  { name: "Extra API calls", price: "$0.001", unit: "per call" },
  { name: "Extra mock servers", price: "$5", unit: "per server/month" },
  { name: "Extra test runs", price: "$0.10", unit: "per run" },
  { name: "Extra storage", price: "$2", unit: "per GB/month" },
]

const faqs = [
  {
    question: "Can I change plans anytime?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes are prorated and reflected in your next billing cycle.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal globally, and Razorpay (UPI, Net Banking) for customers in India.",
  },
  {
    question: "Is there a free trial for paid plans?",
    answer: "Yes, all paid plans come with a 14-day free trial. No credit card required to start.",
  },
  {
    question: "What happens if I exceed my plan limits?",
    answer:
      "You'll be charged based on our usage-based pricing for any overages. We'll notify you before you reach your limits.",
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer:
      "Yes, we offer 20% discount for annual billing on all paid plans. Contact sales for custom enterprise pricing.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. Your plan will remain active until the end of your billing period.",
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Simple, Transparent Pricing</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Choose the perfect plan for your API development needs. Start free, scale as you grow.
            </p>
            <div className="flex justify-center items-center gap-4 mb-8">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <Star className="h-3 w-3 mr-1" />
                14-day free trial on all paid plans
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">No setup fees</Badge>
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${plan.popular ? "border-green-500 border-2 shadow-lg scale-105" : "border-gray-200"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-600 text-white px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <div className="flex justify-center mb-4">
                    <div
                      className={`p-3 rounded-full ${plan.popular ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}`}
                    >
                      {plan.icon}
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">/{plan.period}</span>
                  </div>
                  <CardDescription className="mt-4 text-base">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    asChild
                    className={`w-full mb-6 ${plan.popular ? "bg-green-600 hover:bg-green-700" : ""}`}
                    variant={plan.ctaVariant}
                    size="lg"
                  >
                    <Link href={plan.name === "Business" ? "/contact" : "/auth/signin"}>
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        {feature.included ? (
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        )}
                        <span className={feature.included ? "text-gray-700" : "text-gray-400"}>{feature.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Usage-Based Pricing */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Usage-Based Pricing</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Pay only for what you use beyond your plan limits. No surprises, complete transparency.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {usageBasedPricing.map((item, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600 mb-2">{item.price}</div>
                    <div className="text-gray-600">{item.unit}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600">Got questions? We've got answers.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center p-12 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of developers building better APIs with MOCK by DIT
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg" variant="secondary">
                <Link href="/auth/signin">Start Free Trial</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-600 bg-transparent"
              >
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
