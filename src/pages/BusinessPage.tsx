
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Coins, Building } from "lucide-react";
import PricingCard, { BillingSelector } from "@/components/business/PricingCard";
import FeatureSection from "@/components/business/FeatureSection";
import UseCaseSection from "@/components/business/UseCaseSection";
import FaqBusiness from "@/components/business/FaqBusiness";

type BillingCycle = "monthly" | "annual";

const pricingTiers = [
  {
    name: "Starter",
    id: "starter",
    description: "Perfect for small teams just getting started",
    price: {
      monthly: 99,
      annual: 79,
    },
    apiRequests: "10,000",
    users: "25",
    features: [
      "Basic analytics dashboard",
      "Standard API access",
      "Email support",
      "3 custom challenges per month"
    ],
  },
  {
    name: "Growth",
    id: "growth",
    description: "For growing teams with more advanced needs",
    price: {
      monthly: 299,
      annual: 239,
    },
    apiRequests: "100,000",
    users: "100",
    features: [
      "Advanced analytics",
      "Priority API access",
      "Priority support",
      "10 custom challenges per month",
      "Custom branding"
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    id: "enterprise",
    description: "Custom solutions for large organizations",
    price: {
      monthly: 999,
      annual: 799,
    },
    apiRequests: "Unlimited",
    users: "Unlimited",
    features: [
      "Dedicated account manager",
      "Custom API integration",
      "24/7 phone & email support",
      "Unlimited custom challenges",
      "Custom branding",
      "Data residency options"
    ],
  },
];

const BusinessPage = () => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  return (
    <MainLayout>
      {/* Hero section */}
      <div className="relative bg-brand-dark-darker overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark-darker to-transparent"></div>
          <div className="absolute right-0 top-0 w-1/2 h-full bg-brand-purple/5 blur-3xl rounded-full -translate-y-1/4 translate-x-1/4"></div>
          <div className="absolute right-0 bottom-0 w-1/3 h-2/3 bg-brand-purple/10 blur-3xl rounded-full translate-y-1/3"></div>
        </div>

        <div className="container mx-auto px-4 pt-20 pb-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0">
              <div className="inline-block bg-brand-purple/20 rounded-full px-4 py-2 mb-6">
                <div className="flex items-center">
                  <Building className="h-5 w-5 text-brand-purple mr-2" />
                  <span className="text-sm font-medium text-brand-purple">For Business</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Transform Your<br />
                <span className="bg-gradient-to-r from-brand-purple to-brand-purple-dark text-transparent bg-clip-text">
                  Team's Productivity
                </span>
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                Revolutionize your team's performance with blockchain-powered incentives.
                Replace traditional reward systems with transparent, engaging, and measurable 
                token-based achievements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="purple-gradient text-base px-8 py-6" size="lg">
                  Schedule a Demo
                </Button>
                <Button variant="outline" className="text-base px-8 py-6 border-brand-purple/30" size="lg">
                  View Documentation <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="glass-card p-8 rounded-2xl border border-brand-purple/30 shadow-lg">
                <div className="bg-brand-dark-darker/70 rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-400">Team Challenge</p>
                      <h3 className="text-xl font-medium">Q2 Code Quality Sprint</h3>
                    </div>
                    <div className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-sm">
                      Active
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Participants:</span>
                      <span>18/25</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Prize Pool:</span>
                      <div className="flex items-center">
                        <Coins className="h-4 w-4 text-brand-purple mr-1" />
                        <span>2,500 $TASK</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Time Left:</span>
                      <span>4 days, 8 hours</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-brand-dark-lighter/50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-500 font-medium">JD</span>
                      </div>
                      <span>John Doe</span>
                    </div>
                    <div className="flex items-center">
                      <Coins className="h-4 w-4 text-brand-purple mr-1" />
                      <span>320</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-brand-dark-lighter/50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center mr-3">
                        <span className="text-purple-500 font-medium">AS</span>
                      </div>
                      <span>Amy Smith</span>
                    </div>
                    <div className="flex items-center">
                      <Coins className="h-4 w-4 text-brand-purple mr-1" />
                      <span>285</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-brand-dark-lighter/50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                        <span className="text-green-500 font-medium">TJ</span>
                      </div>
                      <span>Tom Jackson</span>
                    </div>
                    <div className="flex items-center">
                      <Coins className="h-4 w-4 text-brand-purple mr-1" />
                      <span>245</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <FeatureSection />
      
      {/* Use cases */}
      <UseCaseSection />

      {/* Pricing section */}
      <div className="py-16 bg-brand-dark-darker">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Pricing Plans</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Choose the plan that fits your team's needs and scale as you grow
            </p>
          </div>
          
          <BillingSelector value={billingCycle} onValueChange={setBillingCycle} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier) => (
              <PricingCard key={tier.id} tier={tier} billingCycle={billingCycle} />
            ))}
          </div>
          
          <div className="text-center mt-10">
            <p className="text-gray-400 mb-4">
              Need a custom solution for your specific requirements?
            </p>
            <Button variant="outline" className="border-brand-purple/30">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FaqBusiness />

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-brand-purple/10 to-brand-purple-dark/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to transform your team's productivity?</h2>
            <p className="text-xl text-gray-400 mb-8">
              Join forward-thinking organizations that are already using InsightQuest to boost engagement and performance.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="purple-gradient text-base px-8 py-6" size="lg">
                Schedule a Demo
              </Button>
              <Button variant="outline" className="text-base px-8 py-6 border-brand-purple/30" size="lg">
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BusinessPage;
