"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for individual developers",
    features: ["Up to 5 repositories", "Basic AI PR generation", "Community support", "Standard code reviews"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For growing development teams",
    features: [
      "Unlimited repositories",
      "Advanced AI PR generation",
      "Priority support",
      "Advanced code reviews",
      "Team analytics",
      "Custom integrations",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: [
      "Everything in Pro",
      "SSO & advanced security",
      "Dedicated support",
      "Custom AI models",
      "Advanced analytics",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

interface PricingSectionProps {
  onGetStarted?: () => void
}

export function PricingSection({ onGetStarted }: PricingSectionProps) {
  return (
    <section id="pricing" className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4 text-balance">Simple, transparent pricing</h2>
        <p className="text-lg text-muted-foreground text-pretty">
          Choose the plan that's right for your team. Upgrade or downgrade at any time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`relative ${
              plan.popular ? "border-primary bg-card/50 shadow-lg" : "bg-card/30 border-border/50"
            } backdrop-blur-sm`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-8">
              <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
              <div className="mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
              </div>
              <p className="text-muted-foreground text-sm">{plan.description}</p>
            </CardHeader>

            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-foreground text-background hover:bg-foreground/90"
                }`}
                onClick={onGetStarted}
              >
                {plan.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-muted-foreground mb-4">All plans include 14-day free trial. No credit card required.</p>
        <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
          <span>✓ Cancel anytime</span>
          <span>✓ 99.9% uptime SLA</span>
          <span>✓ SOC 2 compliant</span>
        </div>
      </div>
    </section>
  )
}
