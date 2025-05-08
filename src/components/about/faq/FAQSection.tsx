
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

const FAQSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          
          <Accordion type="single" collapsible className="glass-card rounded-xl overflow-hidden p-1">
            <AccordionItem value="item-1" className="border-gray-800">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-800/20">
                <span className="text-lg">What is InsightQuest?</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pt-0 pb-4 text-gray-300">
                InsightQuest is a gamified productivity platform that rewards users with $TASK tokens for completing tasks that benefit them, such as solving LeetCode problems or watching educational content. We're combining learning with blockchain technology to create verifiable achievements and real rewards.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border-gray-800">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-800/20">
                <span className="text-lg">How do you verify completed tasks?</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pt-0 pb-4 text-gray-300">
                We use two verification methods: (1) API integrations with platforms like LeetCode to automatically verify completion, and (2) a community-based verification system where users can earn karma and tokens by verifying other users' tasks. We're also developing AI-based verification for image, PDF, and text proof submissions.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border-gray-800">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-800/20">
                <span className="text-lg">What can I do with $TASK tokens?</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pt-0 pb-4 text-gray-300">
                $TASK tokens have multiple utilities: (1) Purchase AI services like image verification or streak boosts, (2) Access the AI Agent marketplace, (3) Stake tokens to earn passive income, (4) Participate in governance through DAO voting, and (5) Develop and monetize your own AI agents on our platform.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="border-gray-800">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-800/20">
                <span className="text-lg">Why would anyone invest in $TASK?</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pt-0 pb-4 text-gray-300">
                Investors benefit from: (1) Early token acquisition before broader adoption, (2) Consistent buyback by the team to maintain token value, (3) Required token usage for premium features, (4) Staking rewards with 8-10% APR, (5) Revenue from brand sponsorships and API licensing, and (6) Percentage fees from the AI Agent marketplace.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5" className="border-gray-800">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-800/20">
                <span className="text-lg">What is the AI Agent Marketplace?</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pt-0 pb-4 text-gray-300">
                The AI Agent Marketplace is a platform where users can buy task-specific AI agents to enhance productivity. Developers can contribute their agents and earn 97.5% of the payment in $TASK tokens, with 2.5% going to platform fees. It's similar to Hugging Face but with a focus on productivity and financial incentives.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6" className="border-gray-800">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-800/20">
                <span className="text-lg">How is InsightQuest financially sustainable?</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pt-0 pb-4 text-gray-300">
                We generate revenue through multiple channels: (1) 2.5-5% fee from AI Agent marketplace transactions, (2) Staking fees, (3) Brand sponsorship for contests and challenges, (4) API licensing for corporate integration, (5) Subscription fees for premium features, and (6) DAO treasury management of platform resources.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-7" className="border-gray-800">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-800/20">
                <span className="text-lg">Why is the platform DAO-governed?</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pt-0 pb-4 text-gray-300">
                DAO governance gives users ownership and voting rights in the platform. It allows community members to propose and vote on changes, ensures transparency through blockchain verification, and creates a sense of ownership that drives engagement. Think of it like investing early in Duolingo, but with community governance and direct token benefits instead of ads.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
