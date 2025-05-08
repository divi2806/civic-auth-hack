
import { Check, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type BillingCycle = "monthly" | "annual";

interface PricingTier {
  name: string;
  id: string;
  description: string;
  price: {
    monthly: number;
    annual: number;
  };
  features: string[];
  highlight?: boolean;
  apiRequests: string;
  users: string;
}

interface PricingCardProps {
  tier: PricingTier;
  billingCycle: BillingCycle;
}

// Conversion rate from USD to $TASK tokens (for demonstration)
const USD_TO_TASK_RATE = 10; // 1 USD = 10 $TASK tokens

const PricingCard: React.FC<PricingCardProps> = ({ tier, billingCycle }) => {
  const priceInUsd = billingCycle === "monthly" ? tier.price.monthly : tier.price.annual;
  const priceInTokens = priceInUsd * USD_TO_TASK_RATE;
  
  return (
    <Card 
      className={cn(
        "flex flex-col",
        tier.highlight && "border-2 border-brand-purple relative overflow-hidden"
      )}
    >
      {tier.highlight && (
        <div className="absolute top-0 right-0">
          <div className="bg-brand-purple text-white px-3 py-1 font-medium text-xs transform translate-x-2 -translate-y-1 rotate-45">
            Popular
          </div>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{tier.name}</CardTitle>
        <CardDescription>{tier.description}</CardDescription>
        <div className="mt-4 flex items-center">
          <Coins className="h-5 w-5 text-yellow-400 mr-2" />
          <span className="text-3xl font-bold">
            {priceInTokens.toLocaleString()}
          </span>
          <span className="text-muted-foreground ml-2">
            $TASK/{billingCycle === "monthly" ? "month" : "year"}
          </span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          (${priceInUsd} USD equivalent)
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="grid gap-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-brand-purple/20 flex items-center justify-center">
              <Check className="h-3 w-3 text-brand-purple" />
            </div>
            <span className="text-sm">{tier.apiRequests} API requests/month</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-brand-purple/20 flex items-center justify-center">
              <Check className="h-3 w-3 text-brand-purple" />
            </div>
            <span className="text-sm">Up to {tier.users} user accounts</span>
          </div>
          {tier.features.map((feature) => (
            <div key={feature} className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-brand-purple/20 flex items-center justify-center">
                <Check className="h-3 w-3 text-brand-purple" />
              </div>
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className={cn(
            "w-full", 
            tier.highlight ? "purple-gradient" : "bg-brand-dark-lighter hover:bg-brand-dark-lighter/80"
          )}
        >
          Get Started
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;

export const BillingSelector = ({ 
  value, 
  onValueChange 
}: { 
  value: BillingCycle; 
  onValueChange: (value: BillingCycle) => void;
}) => {
  return (
    <div className="flex justify-center mb-8">
      <RadioGroup 
        className="flex items-center space-x-2 bg-brand-dark-lighter rounded-full p-1"
        value={value} 
        onValueChange={onValueChange as (value: string) => void}
      >
        <div className="flex items-center space-x-2 relative">
          <RadioGroupItem 
            value="monthly" 
            id="monthly" 
            className="peer sr-only" 
          />
          <Label 
            htmlFor="monthly" 
            className={cn(
              "px-4 py-2 rounded-full cursor-pointer text-sm",
              value === "monthly" 
                ? "bg-brand-purple text-white" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Monthly
          </Label>
        </div>
        <div className="flex items-center space-x-2 relative">
          <RadioGroupItem 
            value="annual" 
            id="annual" 
            className="peer sr-only" 
          />
          <Label 
            htmlFor="annual" 
            className={cn(
              "px-4 py-2 rounded-full cursor-pointer text-sm flex items-center gap-2",
              value === "annual" 
                ? "bg-brand-purple text-white" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Annual
            <span className="bg-green-500/20 text-green-500 text-xs px-2 py-0.5 rounded-full">
              Save 20%
            </span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};
