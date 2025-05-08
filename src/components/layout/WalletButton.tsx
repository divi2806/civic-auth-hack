import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Wallet, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { shortenAddress } from '@/lib/web3Utils';
import './WalletButton.css';
interface WalletButtonProps {
  className?: string;
  size?: 'default' | 'sm' | 'lg';
  variant?: 'default' | 'gradient';
}

const WalletButton: FC<WalletButtonProps> = ({ 
  className = "", 
  size = "sm",
  variant = "gradient" 
}) => {
  const { publicKey, connecting, connected, disconnect } = useWallet();
  
  // Determine button styling based on variant prop
  const buttonStyle = variant === 'gradient' 
    ? 'purple-gradient'
    : 'bg-brand-dark-lighter hover:bg-brand-dark border border-brand-purple/30';
  
  // Combined className
  const combinedClassName = `${buttonStyle} ${className}`;

  if (connecting) {
    return (
      <Button className={`gap-2 ${combinedClassName}`} size={size} disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="hidden md:inline">Connecting...</span>
      </Button>
    );
  }

  // Custom styled button that wraps the functionality of WalletMultiButton
  // but maintains our custom styling
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {connected && publicKey ? (
            <Button 
              className={`gap-1 ${combinedClassName}`} 
              size={size}
              onClick={() => disconnect()}
            >
              <Wallet className="h-4 w-4" />
              <span className="hidden md:inline">
                {shortenAddress(publicKey.toString())}
              </span>
            </Button>
          ) : (
            <WalletMultiButton 
              className={`reset-wallet-adapter-button ${combinedClassName}`}
              startIcon={<Wallet className="h-4 w-4" />}
            >
              <span className="hidden md:inline">Connect Wallet</span>
            </WalletMultiButton>
          )}
        </TooltipTrigger>
        <TooltipContent>
          {connected && publicKey 
            ? "Click to disconnect wallet" 
            : "Connect your Solana wallet"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default WalletButton;