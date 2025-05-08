// In your App.tsx file
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import Civic Auth components
import { CivicAuthProvider } from "@civic/auth-web3/react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

// Import your providers
import { Web3Provider } from "@/contexts/Web3Context";
import { TaskProvider } from "@/contexts/TaskContext";

// Import pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";
import ZappyChat from "./pages/ZappyChat";
import UserProfile from "./pages/UserProfile";
import ContestsPage from "./pages/ContestsPage";
import BusinessPage from "./pages/BusinessPage";
import MarketplacePage from "./pages/MarketplacePage";
import { Buffer } from 'buffer';

// Required for Solana
window.Buffer = Buffer;

// Civic Auth client ID
const CIVIC_CLIENT_ID = "b37b246a-1b8f-4cb2-8296-0e20fec6e1b3";

// Solana connection endpoint
const SOLANA_ENDPOINT = clusterApiUrl('devnet');

// Create React Query client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ConnectionProvider endpoint={SOLANA_ENDPOINT}>
          <WalletProvider wallets={[]} autoConnect>
            <WalletModalProvider>
              <CivicAuthProvider 
                clientId={CIVIC_CLIENT_ID}
                displayMode="redirect" // Change from default iframe mode to redirect mode
              >
                <Web3Provider>
                  <TaskProvider>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/leaderboard" element={<Leaderboard />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/contests" element={<ContestsPage />} />
                      <Route path="/business" element={<BusinessPage />} />
                      <Route path="/chat" element={<ZappyChat />} />
                      <Route path="/profile" element={<UserProfile />} />
                      <Route path="/marketplace" element={<MarketplacePage />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </TaskProvider>
                </Web3Provider>
              </CivicAuthProvider>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
