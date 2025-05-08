
import { Check, Zap } from "lucide-react";

const TokenomicsSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-xl p-8 mb-8">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-purple/20 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-brand-purple" />
                </div>
                <h2 className="text-2xl font-bold">$TASK Token Overview</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Token Name</span>
                    <span className="font-medium">$TASK</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Type</span>
                    <span className="font-medium">ERC-20</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Total Supply</span>
                    <span className="font-medium">1,000,000,000 (1B)</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Unlock Duration</span>
                    <span className="font-medium">3 years</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Network</span>
                    <span className="font-medium">Sepolia / Ethereum (Later)</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Initial Distribution</span>
                    <span className="font-medium">Free to users via tasks (Testnet)</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Live Launch</span>
                    <span className="font-medium">After critical mass → go Mainnet</span>
                  </div>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-4">Token Allocation Breakdown</h3>
            <div className="overflow-x-auto mb-8">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="py-3 px-4 text-left">Category</th>
                    <th className="py-3 px-4 text-left">% of Supply</th>
                    <th className="py-3 px-4 text-left">Tokens</th>
                    <th className="py-3 px-4 text-left">Unlock Schedule</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  <tr>
                    <td className="py-3 px-4">🔄 User Rewards (REWARD POOL)</td>
                    <td className="py-3 px-4">45%</td>
                    <td className="py-3 px-4">450M</td>
                    <td className="py-3 px-4">Linear over 3 years</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">📈 Ecosystem Growth</td>
                    <td className="py-3 px-4">20%</td>
                    <td className="py-3 px-4">200M</td>
                    <td className="py-3 px-4">Vesting + DAO-controlled</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">👨‍💻 Team & Founders (TREASURY)</td>
                    <td className="py-3 px-4">15%</td>
                    <td className="py-3 px-4">150M</td>
                    <td className="py-3 px-4">1-year cliff + 3-year vesting</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">🤝 Investors / Strategic</td>
                    <td className="py-3 px-4">10%</td>
                    <td className="py-3 px-4">100M</td>
                    <td className="py-3 px-4">Strategic rounds only</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">🎁 Community (airdrops)</td>
                    <td className="py-3 px-4">5%</td>
                    <td className="py-3 px-4">50M</td>
                    <td className="py-3 px-4">First 6–12 months</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">🏦 Treasury & DAO Ops</td>
                    <td className="py-3 px-4">5%</td>
                    <td className="py-3 px-4">50M</td>
                    <td className="py-3 px-4">Controlled by DAO</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Token Utility</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Use AI Agents for productivity and learning assistance</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Stake tokens to earn passive income through revenue sharing</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Participate in governance through DAO voting</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Access premium features and boost learning rewards</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Develop and monetize AI Agents in the marketplace</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Revenue Model</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>2.5-5% fee from AI Agent marketplace transactions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Brand sponsorships for challenges and tournaments</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>API licensing for companies to implement reward systems</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Premium subscription features for advanced analytics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TokenomicsSection;
