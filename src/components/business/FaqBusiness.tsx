
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const businessFaqs = [
  {
    question: "How does the InsightQuest API integrate with our platform?",
    answer: "Our API seamlessly integrates with your existing platforms like Slack, MS Teams, or your custom web applications. We provide comprehensive SDK support for JavaScript, Python, and Java, along with detailed API documentation and implementation examples to make integration quick and straightforward."
  },
  {
    question: "How are rewards tracked and distributed?",
    answer: "All rewards are tracked through our blockchain-based system which provides complete transparency. When users complete tasks in your platform, our API validates the completion and automatically distributes $TASK tokens to their wallet. Every transaction is recorded on the blockchain, eliminating discrepancies and providing an immutable record."
  },
  {
    question: "Can we customize the reward structure for our organization?",
    answer: "Absolutely! You have complete control over your reward structure. You can define custom tasks, set token values for different activities, create team challenges, and even design your own achievement badges. Our dashboard allows you to adjust these parameters in real-time to optimize engagement."
  },
  {
    question: "What makes blockchain-based rewards better than traditional incentives?",
    answer: "Traditional incentive programs often lack transparency, are difficult to track, and don't give users real ownership of their rewards. Our blockchain-based system ensures complete transparency, eliminates fraud, provides portable rewards that users truly own, and creates a more engaging experience through tokenization."
  },
  {
    question: "How secure is the platform?",
    answer: "Security is our top priority. We implement industry-leading encryption standards, regular security audits, and smart contract reviews. All blockchain transactions require multi-signature authentication, and we maintain SOC 2 compliance. Your data and your users' assets are protected by enterprise-grade security protocols."
  }
];

const FaqBusiness = () => {
  return (
    <div className="py-12 bg-brand-dark-darker">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about using InsightQuest for your business
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {businessFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-brand-purple/20">
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-gray-400">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default FaqBusiness;
