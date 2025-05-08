import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Connection, PublicKey, clusterApiUrl, Transaction, SystemProgram } from '@solana/web3.js';
import { ConnectionProvider, WalletProvider, useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { CivicAuthProvider, useUser } from '@civic/auth-web3/react';
import { userHasWallet } from "@civic/auth-web3";
import { toast } from 'sonner';
import { getUserStage, getStageEmoji, getRandomToken, calculateInsightValue } from '../lib/web3Utils';
import { saveUser, getUser, updateUserXP } from '@/services/firebase';
import LevelUpDialog from '@/components/notifications/LevelUpDialog';
import TokenService from '../lib/tokenContract';
import { User } from '@/types';
import { useNavigate } from 'react-router-dom';
import '@solana/wallet-adapter-react-ui/styles.css';

// Define the Solana devnet cluster
const SOLANA_NETWORK = 'devnet';
const SOLANA_ENDPOINT = clusterApiUrl(SOLANA_NETWORK);

// Your custom token contract address
const TOKEN_MINT_ADDRESS = 'FGn3YwW5iMDe2Sz7ekYTV8ZvAdmQmzeSGpFEsAjHEQnm';

// Civic Auth Client ID
const CIVIC_CLIENT_ID = 'b37b246a-1b8f-4cb2-8296-0e20fec6e1b3';

// Type definition for Civic Auth user with wallet
interface CivicSolanaUser {
  solana: {
    address: string;
    wallet: any;
  }
}

interface Web3ContextType {
  isConnected: boolean;
  connecting: boolean;
  address: string | null;
  user: User | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshUser: () => Promise<void>;
  updateUsername: (username: string) => void;
  addUserXP: (amount: number) => Promise<void>;
  tokenBalance: string;
  fetchTokenBalance: () => Promise<void>;
  createEmbeddedWallet: () => Promise<void>;
  walletCreationInProgress: boolean;
}

const Web3Context = createContext<Web3ContextType>({
  isConnected: false,
  connecting: false,
  address: null,
  user: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  refreshUser: async () => {},
  updateUsername: () => {},
  addUserXP: async () => {},
  tokenBalance: "0",
  fetchTokenBalance: async () => {},
  createEmbeddedWallet: async () => {},
  walletCreationInProgress: false
});

export const useWeb3 = () => useContext(Web3Context);

// Web3Provider component that provides the wallet adapter context
export const Web3ProviderWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <ConnectionProvider endpoint={SOLANA_ENDPOINT}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <CivicAuthProvider clientId={CIVIC_CLIENT_ID}>
            <Web3ProviderImplementation>
              {children}
            </Web3ProviderImplementation>
          </CivicAuthProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const Web3ProviderImplementation = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const civicUser = useUser();
  const { publicKey, connected, connecting } = useWallet();
  const { connection } = useConnection();
  
  const [user, setUser] = useState<User | null>(null);
  const [dailyLoginChecked, setDailyLoginChecked] = useState<boolean>(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  const [tokenBalance, setTokenBalance] = useState<string>("0");
  const [walletCreationInProgress, setWalletCreationInProgress] = useState<boolean>(false);

  // Function to fetch the token balance
  const fetchTokenBalance = async (): Promise<void> => {
    if (!civicUser.user || !userHasWallet(civicUser)) return;
    
    try {
      // Type assertion to access solana property
      const walletAddress = (civicUser as unknown as CivicSolanaUser).solana.address;
      const balance = await TokenService.getTokenBalance(walletAddress);
      const formattedBalance = balance.toFixed(2);
      setTokenBalance(formattedBalance);
    } catch (error) {
      console.error("Error fetching token balance:", error);
    }
  };

  // Function to generate a unique avatar URL based on wallet address
  const generateAvatarUrl = (address: string): string => {
    const seed = address.slice(0, 8);
    return `https://api.dicebear.com/6.x/avataaars/svg?seed=${seed}`;
  };

  const checkDailyLogin = async (currentUser: User) => {
    const today = new Date().toISOString().split('T')[0];
    const lastLogin = currentUser.lastLogin;
    
    if (!currentUser.loginStreak) {
      currentUser.loginStreak = 0;
    }
    
    if (lastLogin !== today) {
      let streak = currentUser.loginStreak || 0;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastLogin === yesterdayStr) {
        streak += 1;
      } else if (lastLogin) {
        streak = 1;
      } else {
        streak = 1;
      }
      
      let xpReward = 100;
      let streakBonus = 0;
      
      if (streak >= 7) {
        streakBonus = 100;
      } else if (streak >= 3) {
        streakBonus = 50;
      }
      
      const totalXp = xpReward + streakBonus;
      
      const updatedUser: User = {
        ...currentUser,
        xp: currentUser.xp + totalXp,
        lastLogin: today,
        loginStreak: streak
      };
      
      const oldLevel = currentUser.level;
      const newLevel = Math.floor(Math.sqrt(updatedUser.xp / 100)) + 1;
      updatedUser.level = newLevel;
      
      if (oldLevel !== newLevel) {
        updatedUser.stage = getUserStage(newLevel) as User['stage'];
      }
      
      await saveUser(updatedUser);
      
      if (streak > 1) {
        toast.success(`${streak}-Day Streak! +${totalXp} XP`, {
          description: `You've logged in ${streak} days in a row! Keep it up for more rewards.`,
          duration: 5000,
        });
      } else {
        toast.success(`Daily Login Reward! +${totalXp} XP`, {
          description: `Welcome back! You've earned ${totalXp} XP for logging in today.`,
          duration: 5000,
        });
      }
      
      if (oldLevel !== newLevel) {
        setNewLevel(newLevel);
        setShowLevelUp(true);
      }
      
      return updatedUser;
    }
    
    return currentUser;
  };

  // Create embedded wallet function
  const createEmbeddedWallet = async () => {
    if (civicUser.user && !userHasWallet(civicUser)) {
      try {
        setWalletCreationInProgress(true);
        await civicUser.createWallet();
        toast.success("Embedded wallet created successfully!");
        
        // After wallet creation, fetch the user again and redirect to dashboard
        setTimeout(() => {
          refreshUser().then(() => {
            navigate('/dashboard');
          });
        }, 1000);
      } catch (error) {
        console.error("Error creating embedded wallet:", error);
        toast.error("Failed to create embedded wallet");
      } finally {
        setWalletCreationInProgress(false);
      }
    }
  };

  // Handle wallet connected event
  const handleWalletConnected = async (address: string) => {
    try {
      let fbUser = await getUser(address);
      let isNewUser = false;
      
      if (!fbUser) {
        isNewUser = true;
        const newUser: User = {
          id: address,
          address: address,
          xp: 0,
          level: 1,
          stage: "Spark",
          loginStreak: 0,
          tokensEarned: 0,
          tokens: 0,
          timeSaved: 0,
          tasksCompleted: 0,
          insightValue: 0,
          leetcodeVerified: false,
          verificationToken: getRandomToken(),
          signatureVerified: true, // With Civic Auth, we can consider users verified
          hasReceivedAirdrop: false
        };
        
        newUser.avatarUrl = generateAvatarUrl(address);
        
        await saveUser(newUser);
        fbUser = newUser;
      } else if (!fbUser.avatarUrl) {
        fbUser.avatarUrl = generateAvatarUrl(address);
        await saveUser(fbUser);
      }
      
      fbUser = {
        ...fbUser,
        stage: getUserStage(fbUser.level) as User['stage']
      };
      
      // Fetch token balance since we're using Civic Auth
      setTimeout(() => fetchTokenBalance(), 500);
      
      if (!dailyLoginChecked) {
        fbUser = await checkDailyLogin(fbUser);
        setDailyLoginChecked(true);
      }
      
      setUser(fbUser);
      
      // Redirect to dashboard after successful connection
      if (isNewUser) {
        navigate('/dashboard');
      }
      
      toast.success('Wallet connected!');
    } catch (error) {
      console.error("Error handling wallet connection:", error);
    }
  };

  // Connect wallet function - triggers Civic Auth sign-in
  const connectWallet = async () => {
    try {
      await civicUser.signIn();
      toast.success('Authentication started');
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet', {
        description: error.message || 'Please try again or use a different wallet'
      });
    }
  };
  
  // Disconnect wallet function
  const disconnectWallet = () => {
    civicUser.signOut();
    setUser(null);
    setTokenBalance("0");
    toast.info('Wallet disconnected');
  };
  
  // Update username function
  const updateUsername = async (username: string) => {
    if (!civicUser.user || !userHasWallet(civicUser) || !user) return;
    
    const updatedUser: User = {
      ...user,
      username
    };
    
    const success = await saveUser(updatedUser);
    
    if (success) {
      setUser(updatedUser);
      toast.success('Username updated successfully!');
    } else {
      toast.error('Failed to update username');
    }
  };

  // Add XP function
  const addUserXP = async (amount: number) => {
    if (!user?.id) return;
    
    try {
      const result = await updateUserXP(user.id, amount);
      
      if (result.success) {
        const updatedUser: User = {
          ...user,
          xp: result.newXP,
          level: result.newLevel,
          stage: getUserStage(result.newLevel) as User['stage']
        };
        
        setUser(updatedUser);
        toast.success(`+${amount} XP earned!`);
        
        if (result.oldLevel !== result.newLevel) {
          setNewLevel(result.newLevel);
          setShowLevelUp(true);
        }
      }
    } catch (error) {
      console.error("Error adding XP:", error);
    }
  };
  
  // Refresh user function
  const refreshUser = async () => {
    if (civicUser.user && userHasWallet(civicUser)) {
      try {
        // Type assertion to access solana property
        const walletAddress = (civicUser as unknown as CivicSolanaUser).solana.address;
        let refreshedUser = await getUser(walletAddress);
        
        if (!refreshedUser) {
          refreshedUser = {
            id: walletAddress,
            address: walletAddress,
            xp: 0,
            level: 1,
            stage: "Spark",
            loginStreak: 0,
            tokensEarned: 0,
            tokens: 0,
            timeSaved: 0,
            tasksCompleted: 0,
            insightValue: 0,
            leetcodeVerified: false,
            signatureVerified: true,
            hasReceivedAirdrop: false,
            avatarUrl: generateAvatarUrl(walletAddress)
          };
          
          await saveUser(refreshedUser);
        } else if (!refreshedUser.avatarUrl) {
          refreshedUser.avatarUrl = generateAvatarUrl(refreshedUser.address);
          await saveUser(refreshedUser);
        }
        
        if (refreshedUser) {
          refreshedUser = {
            ...refreshedUser,
            stage: getUserStage(refreshedUser.level) as User['stage']
          };
          
          setUser(refreshedUser);
          await fetchTokenBalance();
        }
      } catch (error) {
        console.error("Error refreshing user:", error);
      }
    }
  };

  // Watch for Civic Auth user changes
  useEffect(() => {
    const handleCivicUserChange = async () => {
      if (civicUser.user) {
        // User is authenticated with Civic
        if (userHasWallet(civicUser)) {
          // User has a wallet, update our state
          // Type assertion to access solana property
          const walletAddress = (civicUser as unknown as CivicSolanaUser).solana.address;
          await handleWalletConnected(walletAddress);
        } else {
          // User is authenticated but doesn't have a wallet yet
          // Prompt them to create a wallet
          toast.info("Authentication successful! Create your wallet to continue.", {
            action: {
              label: "Create Wallet",
              onClick: () => createEmbeddedWallet()
            },
          });
        }
      }
    };
    
    handleCivicUserChange();
  }, [civicUser.user]);
  
  // Check for token balance updates periodically
  useEffect(() => {
    if (civicUser.user && userHasWallet(civicUser)) {
      fetchTokenBalance();
      
      const intervalId = setInterval(() => {
        fetchTokenBalance();
      }, 30000);
      
      return () => clearInterval(intervalId);
    }
  }, [civicUser.user]);
  
  // Redirect to dashboard after successful login if on homepage
  useEffect(() => {
    if (civicUser.user && userHasWallet(civicUser) && window.location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [civicUser.user, window.location.pathname]);
  
  // Determine if connected based on Civic Auth status
  const isConnected = civicUser.user !== null;
  const address = civicUser.user && userHasWallet(civicUser) 
    ? (civicUser as unknown as CivicSolanaUser).solana.address 
    : null;
  
  return (
    <Web3Context.Provider 
      value={{ 
        isConnected, 
        connecting: civicUser.isLoading || connecting, 
        address, 
        user,
        connectWallet, 
        disconnectWallet,
        refreshUser,
        updateUsername,
        addUserXP,
        tokenBalance,
        fetchTokenBalance,
        createEmbeddedWallet,
        walletCreationInProgress
      }}
    >
      {children}
      
      <LevelUpDialog 
        level={newLevel}
        open={showLevelUp}
        onOpenChange={setShowLevelUp}
      />
    </Web3Context.Provider>
  );
};

export const Web3Provider = Web3ProviderWrapper;
