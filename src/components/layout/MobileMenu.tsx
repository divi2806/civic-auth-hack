
import { Link } from "react-router-dom";
import { 
  Wallet, 
  LogOut, 
  Coins,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useWeb3 } from "@/contexts/Web3Context";
import { shortenAddress } from "@/lib/web3Utils";
import NavLinks from "./NavLinks";

interface MobileMenuProps {
  isOpen: boolean;
}

const MobileMenu = ({ isOpen }: MobileMenuProps) => {
  const { isConnected, address, user, connectWallet, disconnectWallet } = useWeb3();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-30 bg-brand-dark-darker/95 pt-16 px-4 md:hidden">
      <div className="flex flex-col gap-3 p-4">
        {isConnected && (
          <div className="flex items-center gap-3 pb-4">
            <Avatar className="h-10 w-10 border border-brand-purple/30">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback className="bg-brand-dark-lighter text-brand-purple">
                {user?.username?.[0] || user?.address?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-medium">{user?.username || "User"}</span>
                {user?.stage && (
                  <span className="px-1.5 py-0.5 rounded-full bg-brand-dark-lighter text-xs border border-brand-purple/20 flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5 text-yellow-400" />
                    {user.stage}
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-400">
                {shortenAddress(address || "")}
              </span>
              
              <span className="text-xs flex items-center gap-1 mt-1 text-yellow-400">
                <Coins className="h-3 w-3" />
                {user?.tokens || 0} $TASK
              </span>
            </div>
          </div>
        )}
        
        <Separator className="bg-brand-purple/20" />
        
        <NavLinks className="flex flex-col" vertical />
        
        <Separator className="bg-brand-purple/20" />
        
        <div className="py-4">
          {isConnected ? (
            <Button 
              variant="outline" 
              className="w-full gap-2 border-brand-purple/30 text-brand-purple hover:bg-brand-purple/20" 
              onClick={disconnectWallet}
            >
              <LogOut className="h-4 w-4" />
              Disconnect Wallet
            </Button>
          ) : (
            <Button 
              className="w-full gap-2 purple-gradient" 
              onClick={connectWallet}
            >
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
