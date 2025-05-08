import { Link, useLocation } from "react-router-dom";
import { 
  Trophy, 
  Home, 
  Info,
  BarChart,
  MessageSquare,
  User,
  Building,
  Medal,
  Check,
  Store,
  Coins,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { toast } from "sonner";
import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { 
  getAssociatedTokenAddress, 
  createTransferInstruction, 
  getMint,
  createAssociatedTokenAccountInstruction 
} from '@solana/spl-token';
import { useUser } from "@civic/auth-web3/react";
import { userHasWallet } from "@civic/auth-web3";
import { saveUser, getUser } from '@/services/firebase';

// Your custom token contract address on Solana devnet
const TOKEN_MINT_ADDRESS = 'FGn3YwW5iMDe2Sz7ekYTV8ZvAdmQmzeSGpFEsAjHEQnm';

interface NavLinksProps {
  className?: string;
  vertical?: boolean;
}

const NavLinks = ({ className = "", vertical = false }: NavLinksProps) => {
  const location = useLocation();
  const { isConnected, user, fetchTokenBalance, address, refreshUser } = useWeb3();
  const [isAirdropping, setIsAirdropping] = useState(false);
  const [hasReceivedAirdrop, setHasReceivedAirdrop] = useState(false);
  const civicUser = useUser();
  
  // Treasury private key (convert array to Uint8Array)
  const treasuryPrivateKeyArray = [44,139,195,225,55,15,97,207,207,208,122,120,214,3,141,66,39,159,82,244,149,7,204,222,54,195,128,160,113,107,12,135,203,119,130,91,54,11,112,1,27,8,178,248,49,115,104,243,145,131,74,190,0,47,90,234,196,44,106,137,231,130,89,61];
  
  // Check if user has already received airdrop
  useEffect(() => {
    const checkAirdropStatus = async () => {
      if (isConnected && user) {
        setHasReceivedAirdrop(user.hasReceivedAirdrop || false);
      }
    };
    
    checkAirdropStatus();
  }, [isConnected, user]);
  
  const getNavigation = () => {
    const loggedOutLinks = [
      { name: "Home", to: "/", icon: Home },
      { name: "Leaderboard", to: "/leaderboard", icon: Trophy },
      { name: "Contests", to: "/contests", icon: Medal },
      { name: "Marketplace", to: "/marketplace", icon: Store },
      { name: "For Business", to: "/business", icon: Building },
      { name: "About", to: "/about", icon: Info }
    ];
    
    const loggedInLinks = [
      { name: "Leaderboard", to: "/leaderboard", icon: Trophy },
      { name: "Contests", to: "/contests", icon: Medal },
      { name: "Marketplace", to: "/marketplace", icon: Store },
      { name: "For Business", to: "/business", icon: Building },
    ];
    
    return isConnected ? loggedInLinks : loggedOutLinks;
  };

  const handleAirdrop = async () => {
    if (!isConnected || !userHasWallet(civicUser)) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    if (hasReceivedAirdrop) {
      toast.info("You've already received your airdrop", {
        description: "Each user can only receive the airdrop once."
      });
      return;
    }

    setIsAirdropping(true);
    toast.info("Airdrop initiated", {
      description: "Processing your $TASK token airdrop...",
      duration: 5000,
    });

    try {
      // Create connection to Solana devnet
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
      
      // Create treasury wallet from private key
      const treasuryPrivateKey = new Uint8Array(treasuryPrivateKeyArray);
      const treasuryKeypair = Keypair.fromSecretKey(treasuryPrivateKey);
      
      // Get user's wallet address
      const userWalletAddress = new PublicKey(address);
      
      // Get token mint
      const mintPublicKey = new PublicKey(TOKEN_MINT_ADDRESS);
      
      // Get mint info to calculate amount with proper decimals
      const mintInfo = await getMint(connection, mintPublicKey);
      const amountToSend = 200 * Math.pow(10, mintInfo.decimals);
      
      // Get associated token accounts
      const treasuryTokenAccount = await getAssociatedTokenAddress(
        mintPublicKey,
        treasuryKeypair.publicKey
      );
      
      const userTokenAccount = await getAssociatedTokenAddress(
        mintPublicKey,
        userWalletAddress
      );
      
      // Create transaction
      const transaction = new Transaction();
      
      // Check if user token account exists, if not create it
      try {
        await connection.getTokenAccountBalance(userTokenAccount);
      } catch (error) {
        // Token account doesn't exist, add instruction to create it
        const createUserAccountInstruction = createAssociatedTokenAccountInstruction(
          treasuryKeypair.publicKey, // payer
          userTokenAccount, // associated token account address
          userWalletAddress, // owner
          mintPublicKey // token mint
        );
        transaction.add(createUserAccountInstruction);
      }
      
      // Create transfer instruction
      const transferInstruction = createTransferInstruction(
        treasuryTokenAccount,
        userTokenAccount,
        treasuryKeypair.publicKey,
        BigInt(amountToSend)
      );
      
      // Add transfer instruction to transaction
      transaction.add(transferInstruction);
      
      // Set recent blockhash and fee payer
      transaction.feePayer = treasuryKeypair.publicKey;
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      
      // Sign transaction with treasury keypair
      transaction.sign(treasuryKeypair);
      
      // Send and confirm transaction
      const signature = await connection.sendRawTransaction(transaction.serialize());
      await connection.confirmTransaction(signature);
      
      // Update user record to mark airdrop as received
      if (user) {
        const updatedUser = {
          ...user,
          hasReceivedAirdrop: true
        };
        
        await saveUser(updatedUser);
        setHasReceivedAirdrop(true);
      }
      
      // Refresh token balance
      await fetchTokenBalance();
      
      // Refresh user data
      await refreshUser();
      
      toast.success("Airdrop successful!", {
        description: "200 $TASK tokens have been added to your wallet.",
        duration: 5000,
      });
    } catch (error) {
      console.error("Airdrop error:", error);
      toast.error("Airdrop failed", {
        description: error.message || "There was an error processing your airdrop. Please try again.",
        duration: 5000,
      });
    } finally {
      setIsAirdropping(false);
    }
  };

  const navigation = getNavigation();

  return (
    <nav className={`${className} ${vertical ? 'flex-col gap-2' : 'items-center gap-2'}`}>
      {navigation.map((item) => {
        const isActive = location.pathname === item.to;
        return (
          <Link
            key={item.name}
            to={item.to}
            className={`flex items-center ${vertical ? 'gap-3' : 'gap-1'} ${vertical ? 'px-3 py-2' : 'px-2 py-2'} ${vertical ? 'text-base' : 'text-xs'} font-medium rounded-md transition-colors
              ${isActive 
                ? "bg-brand-purple/20 text-brand-purple" 
                : "text-gray-400 hover:text-brand-purple hover:bg-brand-dark-lighter/30"
              }`}
          >
            <item.icon className={`${vertical ? 'h-5 w-5' : 'h-4 w-4'}`} />
            {item.name}
          </Link>
        );
      })}
      
      {isConnected && (
        <>
          <Link
            to="/dashboard"
            className={`flex items-center ${vertical ? 'gap-3' : 'gap-1'} ${vertical ? 'px-3 py-2' : 'px-2 py-2'} ${vertical ? 'text-base' : 'text-xs'} font-medium rounded-md transition-colors
              ${location.pathname === "/dashboard" 
                ? "bg-brand-purple/20 text-brand-purple" 
                : "text-gray-400 hover:text-brand-purple hover:bg-brand-dark-lighter/30"
              }`}
          >
            <BarChart className={`${vertical ? 'h-5 w-5' : 'h-4 w-4'}`} />
            Dashboard
            {user?.leetcodeVerified && (
              <span className="ml-1 text-green-500 flex items-center gap-1 text-xs">
                <Check className="h-3 w-3" />
                {user.leetcodeUsername ? `(${user.leetcodeUsername})` : "Verified"}
              </span>
            )}
          </Link>
          {vertical && (
            <Link
              to="/profile"
              className={`flex items-center ${vertical ? 'gap-3' : 'gap-1'} ${vertical ? 'px-3 py-2' : 'px-2 py-2'} ${vertical ? 'text-base' : 'text-sm'} font-medium rounded-md transition-colors
                ${location.pathname === "/profile" 
                  ? "bg-brand-purple/20 text-brand-purple" 
                  : "text-gray-400 hover:text-brand-purple hover:bg-brand-dark-lighter/30"
                }`}
            >
              <User className={`${vertical ? 'h-5 w-5' : 'h-4 w-4'}`} />
              Profile
            </Link>
          )}
          <Link
            to="/chat"
            className={`flex items-center ${vertical ? 'gap-3' : 'gap-1'} ${vertical ? 'px-3 py-2' : 'px-2 py-2'} ${vertical ? 'text-base' : 'text-xs'} font-medium rounded-md transition-colors
              ${location.pathname === "/chat" 
                ? "bg-brand-purple/20 text-brand-purple" 
                : "text-gray-400 hover:text-brand-purple hover:bg-brand-dark-lighter/30"
              }`}
          >
            <MessageSquare className={`${vertical ? 'h-5 w-5' : 'h-4 w-4'}`} />
            Zappy
          </Link>
          
          {/* Airdrop Button or Received Status */}
          {hasReceivedAirdrop ? (
            <div className={`flex items-center ${vertical ? 'gap-3' : 'gap-1'} ${vertical ? 'px-3 py-2' : 'px-2 py-2'} ${vertical ? 'text-base' : 'text-xs'} font-medium rounded-md
              text-green-500 bg-green-500/10`}
            >
              <Check className={`${vertical ? 'h-5 w-5' : 'h-4 w-4'}`} />
              Airdrop Received
            </div>
          ) : (
            <button
              onClick={handleAirdrop}
              disabled={isAirdropping || !userHasWallet(civicUser) || hasReceivedAirdrop}
              className={`flex items-center ${vertical ? 'gap-3' : 'gap-1'} ${vertical ? 'px-3 py-2' : 'px-2 py-2'} ${vertical ? 'text-base' : 'text-xs'} font-medium rounded-md transition-colors
                ${isAirdropping
                  ? "bg-yellow-500/20 text-yellow-500 cursor-not-allowed"
                  : "text-yellow-400 hover:text-yellow-500 hover:bg-yellow-500/20"
                }`}
            >
              {isAirdropping ? (
                <>
                  <Loader2 className={`${vertical ? 'h-5 w-5' : 'h-4 w-4'} animate-spin`} />
                  Airdropping...
                </>
              ) : (
                <>
                  <Coins className={`${vertical ? 'h-5 w-5' : 'h-4 w-4'}`} />
                  Airdrop $TASK
                </>
              )}
            </button>
          )}
        </>
      )}
    </nav>
  );
};

export default NavLinks;
