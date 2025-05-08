import { useState, useEffect } from "react";
import { Coins, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/contexts/Web3Context"; // This will need to be renamed to useSolana
import { toast } from "sonner";
import TokenService from "@/services/TokenService"; // This will need Solana implementations
import ContestService, { Contest, saveContestEntry } from "@/services/ContestService";

interface ContestJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  contest: Contest | null;
  onJoin: (contestId: string) => Promise<void>;
}

const ContestJoinModal: React.FC<ContestJoinModalProps> = ({
  isOpen,
  onClose,
  contest,
  onJoin
}) => {
  const [isJoining, setIsJoining] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [isAlreadyJoined, setIsAlreadyJoined] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const { user, address } = useWeb3(); // This will need to be updated

  useEffect(() => {
    // Get token balance when modal opens and address is available
    if (isOpen && address) {
      fetchTokenBalance();
      checkIfAlreadyJoined();
    }
  }, [isOpen, address, contest?.id]);

  const fetchTokenBalance = async () => {
    if (!address) return;
    
    try {
      const balance = await TokenService.getTokenBalance(address);
      setTokenBalance(balance);
    } catch (error) {
      console.error("Failed to fetch token balance:", error);
      toast.error("Failed to load your token balance");
    }
  };
  
  const checkIfAlreadyJoined = async () => {
    if (!address || !contest?.id) return;
    
    try {
      const hasJoined = await ContestService.hasUserEnteredContest(address, contest.id);
      setIsAlreadyJoined(hasJoined);
    } catch (error) {
      console.error("Failed to check contest entry:", error);
    }
  };

  if (!contest) return null;

  const hasEnoughTokens = tokenBalance >= contest.entryFee;

  const handleJoinContest = async () => {
    if (!contest || !address) return;
    
    try {
      setIsJoining(true);
      
      // 1. Transfer tokens from user to admin address (updated for Solana)
      // The admin Solana wallet address is: EhFTWzaEXM9baSFSMM22cJiG8KjmsMLiFWi27DVc2Zq6
      const transactionHash = await TokenService.transferTokens(
        address, 
        "EhFTWzaEXM9baSFSMM22cJiG8KjmsMLiFWi27DVc2Zq6", // Admin wallet address
        contest.entryFee
      );
      setTxHash(transactionHash);
      
      // 2. Save contest entry to Firebase
      await saveContestEntry({
        contestId: contest.id,
        userId: address,
        entryTimestamp: new Date().toISOString(),
        transactionHash
      });
      
      // 3. Call parent component's onJoin function
      await onJoin(contest.id);
      
      toast.success("You've successfully joined the contest!", {
        description: "Your tokens have been transferred and your entry has been recorded."
      });
      
      onClose();
    } catch (error: any) {
      console.error("Failed to join contest:", error);
      toast.error("Failed to join the contest", {
        description: error.message || "Please try again"
      });
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join Contest</DialogTitle>
          <DialogDescription className="break-words">
            You're about to enter "{contest.title}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b border-brand-purple/10">
              <span className="text-sm">Entry Fee:</span>
              <span className="flex items-center font-medium">
                <Coins className="h-4 w-4 mr-1 text-brand-purple" />
                {contest.entryFee} $TASK
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-brand-purple/10">
              <span className="text-sm">Prize Pool:</span>
              <span className="flex items-center font-medium">
                <Coins className="h-4 w-4 mr-1 text-yellow-500" />
                {contest.prizePool} $TASK
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Your Balance:</span>
              <span className="flex items-center font-medium">
                <Coins className="h-4 w-4 mr-1 text-brand-purple" />
                {tokenBalance} $TASK
              </span>
            </div>
          </div>
          
          {isAlreadyJoined && (
            <div className="p-3 bg-green-950/30 border border-green-500/30 rounded-lg flex items-start gap-2">
              <Coins className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-500">Already joined!</p>
                <p className="text-xs text-green-400/70 mt-1">
                  You've already entered this contest. Good luck!
                </p>
              </div>
            </div>
          )}
          
          {!hasEnoughTokens && !isAlreadyJoined && (
            <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-500">Insufficient balance</p>
                <p className="text-xs text-red-400/70 mt-1">
                  You need {contest.entryFee - tokenBalance} more $TASK tokens to join this contest. Complete tasks to earn more tokens.
                </p>
              </div>
            </div>
          )}
          
          {txHash && (
            <div className="p-3 bg-brand-purple/10 border border-brand-purple/20 rounded-lg">
              <p className="text-sm font-medium">Transaction submitted!</p>
              <div className="mt-1 max-w-full">
                <a 
                  href={`https://explorer.solana.com/tx/${txHash}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-purple hover:underline inline-block max-w-full"
                >
                  <span className="block truncate">
                    View on Solana Explorer: {txHash.substring(0, 20)}...
                  </span>
                </a>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between gap-2 flex-wrap sm:flex-nowrap">
          <Button variant="outline" onClick={onClose} className="min-w-24">
            Cancel
          </Button>
          <Button 
            className="purple-gradient min-w-36" 
            disabled={isJoining || !hasEnoughTokens || isAlreadyJoined}
            onClick={handleJoinContest}
          >
            {isJoining ? "Processing..." : isAlreadyJoined ? "Already Joined" : "Confirm & Join"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContestJoinModal;