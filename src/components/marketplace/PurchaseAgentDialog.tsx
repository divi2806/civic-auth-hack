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
import { useUser } from "@civic/auth-web3/react";
import { userHasWallet } from "@civic/auth-web3";

// making extra commit to check if this works or not 

// Constants - Solana Admin Receiver Address
const RECEIVER_ADDRESS = 'EhFTWzaEXM9baSFSMM22cJiG8KjmsMLiFWi27DVc2Zq6';

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
  const { user, refreshUser, fetchTokenBalance, tokenBalance, address } = useWeb3();
  const [currentBalance, setCurrentBalance] = useState(0);
  const civicUser = useUser();

  useEffect(() => {
    // Update local balance from context whenever tokenBalance changes
    setCurrentBalance(parseFloat(tokenBalance));
  }, [tokenBalance]);

  useEffect(() => {
    // Fetch token balance when dialog opens and user is available
    const fetchBalance = async () => {
      if (open && user?.address) {
        await fetchTokenBalance();
      }
    };
    
    fetchBalance();
  }, [open, user?.address, fetchTokenBalance]);

  const handlePurchase = async () => {
    if (!user || !user.address) {
      toast.error("User not logged in", {
        description: "Please log in to make purchases.",
      });
      return;
    }
    
    if (!userHasWallet(civicUser)) {
      toast.error("Wallet not found", {
        description: "Please create a wallet first to make purchases.",
      });
      return;
    }
    
    if (!civicUser.solana.wallet) {
      toast.error("Wallet not accessible", {
        description: "Cannot access your wallet. Please try refreshing the page.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Check if user has enough tokens
      const balanceNum = parseFloat(tokenBalance || "0");
      
      if (balanceNum < agent.price) {
        toast.error("Insufficient funds", {
          description: "You don't have enough $TASK tokens to purchase this agent.",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Use the exact address from the user object
      const userAddress = address;
      console.log("Sending transaction for address:", userAddress);
      
      // Execute token transfer with the Civic wallet
      toast.info("Awaiting wallet approval", {
        description: "You'll be redirected to approve the transaction. Please complete the process there.",
        duration: 10000,
      });
      
      try {
        // Use the signIn method with redirect mode first to ensure proper authentication mode
        await civicUser.signIn("redirect");
        
        // Then proceed with the transaction
        const txHashLocal = await TokenService.enterContest(
          userAddress, 
          agent.price, 
          civicUser.solana.wallet
        );
        
        // Save transaction hash
        setTxHash(txHashLocal);
        
        toast.success("Transaction approved!", {
          description: "Transaction has been approved and is being processed.",
          duration: 5000,
        });
        
        // Save purchase to database
        await purchaseAgent(agent.id, user.id);
        
        // Add user to agent's purchasedBy list (in local state)
        agent.purchasedBy = [...(agent.purchasedBy || []), userAddress];
        
        toast.success("Purchase successful!", {
          description: `You've successfully purchased ${agent.name}.`,
        });
        
        setIsPurchased(true);
        
        // Refresh user data to update token balance
        await refreshUser();
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
      } catch (walletError) {
        console.error("Wallet interaction error:", walletError);
        toast.error("Wallet interaction failed", {
          description: walletError.message || "Failed to sign the transaction. Please try again.",
        });
        throw walletError; // Re-throw to be caught by the outer catch
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

  // Get Solana explorer transaction URL
  const getExplorerUrl = (hash: string) => {
    return `https://explorer.solana.com/tx/${hash}?cluster=devnet`;
  };

  // Calculate new balance after purchase for display
  const newBalance = currentBalance - agent.price;

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
                <span>{newBalance.toFixed(2)} $TASK</span>
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
                View transaction on Solana Explorer
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
                <span className="font-semibold">{currentBalance.toFixed(2)} $TASK</span>
              </div>
              <div className="flex justify-between items-center text-brand-purple">
                <span>Cost:</span>
                <span className="font-semibold">-{agent.price} $TASK</span>
              </div>
              <div className="h-px bg-gray-200 my-2" />
              <div className="flex justify-between items-center font-semibold">
                <span>Remaining balance:</span>
                <span>{newBalance.toFixed(2)} $TASK</span>
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
                disabled={isSubmitting || currentBalance < agent.price || !userHasWallet(civicUser)}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : !userHasWallet(civicUser) ? (
                  <>
                    <Coins className="mr-2 h-4 w-4" />
                    Wallet Required
                  </>
                ) : currentBalance < agent.price ? (
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
