import { useState, useEffect } from "react";
import { Loader2, Coins, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useWeb3 } from "@/contexts/Web3Context";
import { Agent } from "@/types";
import { purchaseAgent } from "@/services/agentService";
import TokenService from "@/lib/tokenContract";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";



interface PurchaseAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: Agent;
  onSuccess?: () => void;
}

const PurchaseAgentDialog: React.FC<PurchaseAgentDialogProps> = ({
  open,
  onOpenChange,
  agent,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(0);
  const { user, refreshUser } = useWeb3();

  useEffect(() => {
    // Fetch token balance when dialog opens and user is available
    if (open && user?.address) {
      fetchTokenBalance();
    }
  }, [open, user?.address]);

  const fetchTokenBalance = async () => {
    if (!user?.address) return;
    
    try {
      const balance = await TokenService.getTokenBalance(user.address);
      setTokenBalance(balance);
    } catch (error) {
      console.error("Failed to fetch token balance:", error);
      toast.error("Failed to load your token balance");
    }
  };

  const handlePurchase = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      // Use the fetched balance instead of fetching again
      if (tokenBalance < agent.price) {
        toast.error("Insufficient funds", {
          description: "You don't have enough $TASK tokens to purchase this agent.",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Execute token transfer to the receiver address
      const txHash = await TokenService.enterContest(user.address, agent.price);
      
      // Save transaction hash
      setTxHash(txHash);
      
      // Save purchase to database
      await purchaseAgent(agent.id, user.id);
      
      // Add user to agent's purchasedBy list (in local state)
      agent.purchasedBy = [...(agent.purchasedBy || []), user.address];
      
      toast.success("Purchase successful!", {
        description: `You've successfully purchased ${agent.name}.`,
      });
      
      setIsPurchased(true);
      
      // Refresh user data to update token balance
      refreshUser();
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error purchasing agent:", error);
      toast.error("Purchase failed", {
        description: error.message || "There was an error while processing your purchase. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get Sepolia explorer transaction URL
  const getExplorerUrl = (hash: string) => {
    return `https://explorer.solana.com/tx/${hash}?cluster=devnet`;
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(open) => {
        if (!isSubmitting) {
          onOpenChange(open);
          if (!open) {
            setIsPurchased(false);
            setTxHash(null);
          }
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        {isPurchased ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold text-green-600">
                <div className="flex items-center justify-center mb-2">
                  <Check className="h-8 w-8 mr-2" />
                  Purchase Successful!
                </div>
              </DialogTitle>
              <DialogDescription className="text-center text-lg">
                You now have access to <span className="font-bold">{agent.name}</span>. 
                You can access it from your dashboard or directly from the marketplace.
              </DialogDescription>
            </DialogHeader>
            
            <div className="my-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Transaction Amount:</span>
                <span>{agent.price} $TASK</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">New Balance:</span>
                <span>{tokenBalance - agent.price} $TASK</span>
              </div>
            </div>
            
            {txHash && (
              <a 
                href={getExplorerUrl(txHash)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-4"
              >
                <ExternalLink size={16} />
                View transaction on Sepolia Explorer
              </a>
            )}
            
            <DialogFooter>
              <Button 
                onClick={() => {
                  onOpenChange(false);
                }}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Done
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Purchase</DialogTitle>
              <DialogDescription>
                You're about to purchase this AI agent using your $TASK tokens.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-4 my-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={agent.imageUrl} alt={agent.name} />
                <AvatarFallback className="bg-brand-purple/20 text-brand-purple">
                  {agent.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{agent.name}</h3>
                <p className="text-sm text-gray-500">by {agent.creatorName}</p>
              </div>
            </div>
            <div className="space-y-4 my-6">
              <div className="flex justify-between items-center">
                <span>Your balance:</span>
                <span className="font-semibold">{tokenBalance} $TASK</span>
              </div>
              <div className="flex justify-between items-center text-brand-purple">
                <span>Cost:</span>
                <span className="font-semibold">-{agent.price} $TASK</span>
              </div>
              <div className="h-px bg-gray-200 my-2" />
              <div className="flex justify-between items-center font-semibold">
                <span>Remaining balance:</span>
                <span>{tokenBalance - agent.price} $TASK</span>
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-col gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-brand-purple/30"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePurchase}
                className="purple-gradient"
                disabled={isSubmitting || tokenBalance < agent.price}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : tokenBalance < agent.price ? (
                  <>
                    <Coins className="mr-2 h-4 w-4" />
                    Insufficient Balance
                  </>
                ) : (
                  <>
                    <Coins className="mr-2 h-4 w-4" />
                    Confirm Purchase
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
      
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseAgentDialog;