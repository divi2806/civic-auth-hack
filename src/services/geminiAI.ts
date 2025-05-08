import { GoogleGenerativeAI } from "@google/generative-ai";

// API key for Gemini (this would be replaced with real API key in production)
const API_KEY = "AIzaSyC9YKF89cnfSAAzM6TilPY29Ea9LeiIf8s";

// Initialize the API
const genAI = new GoogleGenerativeAI(API_KEY);

// TaskFi DAO information from the PDF
const taskFiInfo = `
Task-FI is a DAO-based app that regulates on $TASK token, providing user incentives based on productivity and an AI agent marketplace.

Key features include:
- Gamified Productivity App: Earn $TASK by completing tasks like solving LeetCode problems, watching educational videos
- Verification Layer: Manual or AI-based verification of task completion
- Tokenized Reward System: $TASK as currency
- AI Features: Chat with Zappy, use AI tools for productivity
- AI Agent Marketplace: Users can buy or deploy task-specific AI agents

USERS CAN EARN BY STAKING
-$TASK is burned every time users pay for:
-AI Agent use
-Verification tools
-Premium challenge entry
-Avatar customizations
- AI Agent Marketplace: Users can buy or sell AI agents

Even if you're DAO-run, how will you survive financially?"
- We survive because we're not relying on donations, we generate real
yield:
-% from AI Agent purchases
-% of all $TASK burned goes to DAO treasury
-Paid challenges / tournaments
-Subscriptions for premium dashboards (AI insights, team tools)
-Platform takes 2.5% cut on all AI Agent usage

WHY PEOPLE WILL SUPPLY LIQUIDITY AS A DAO?
-They get voting rights, can take major decisions have the power to propose and
benefit,
-Now not just an investor think like a boss that they own it completely
-No fraudalant activity or transactions as every signature is tracked on blockchain
-Think of it like investing early in Duolingo, but instead of ads, it's powered by
tokens. The community governs it, grows it, and benefits directly from that
growth.

HOW WILL TASK-fi GET FUNDS? -
-Staking
-Brand sponsorships by organising contets
-AI agent marketplace (small fees)
-DAO Based platform ( that provides the base liquidity ) the community controls
everything giving complete transperancy

WHY WOULD ANYONE BUY/USE $TASK TOKEN
-To use AI Agents (most powerful tool now)
-To buy AI services faster than doing it manually
-To stake and earn more $TASK from revenue share
-To vote on platform proposals
-To develop AI Agents and earn passive income


Token Details:
- Token Name: $TASK
- Type: ERC-20
- Total Supply: 1,000,000,000 (1B)
- Unlock Duration: 3 years

Token Allocation:
- User Rewards: 45% (450M)
- Ecosystem Growth: 20% (200M)
- Team & Founders: 15% (150M)
- Investors/Strategic: 10% (100M)
- Community: 5% (50M)
- Treasury & DAO Ops: 5% (50M)

Ways to earn $TASK:
1. Complete tasks
2. Sell AI agents
3. Buy from DEX
4. Share activities on social media
5. Win contests
6. Stake $TASK tokens
7. Login regularly

$TASK Token Use Cases:
- Pay for AI features
- Buy AI agents from marketplace
- Enter challenges
- Customization
- Governance voting
- Use AI Agent Dev API

Revenue Streams:
- AI Agent Sales
- AI Feature Usage
- Premium Task Access
- Enterprise Tier
- App Pro Subscription
- API usage by organizations

DAO Member Benefits:
- Governance Power
- Reward Distribution
- Access to Treasury Grants
- Early Access to Features
- Token Appreciation
- AI Agent Revenue Share

Users can stake $TASK to earn 8-10% APR. The platform takes 2.5-5% cut on AI Agent usage.
`;

// Startup help information database
const startupHelpInfo = {
  funding: {
    options: [
      "Bootstrapping - Self-funding your startup using personal savings, revenue, or credit",
      "Friends and Family - Early capital from personal connections",
      "Angel Investors - Wealthy individuals who invest in early-stage startups",
      "Venture Capital - Professional firms that invest in high-growth potential startups",
      "Accelerators/Incubators - Programs offering mentorship, resources, and sometimes funding",
      "Crowdfunding - Platforms like Kickstarter, Indiegogo for community-based funding",
      "SBA Loans - Government-backed loans for small businesses",
      "Grants - Non-dilutive funding from government or private organizations",
      "Revenue-based Financing - Funding based on a percentage of future revenue"
    ],
    stages: [
      "Pre-seed: $10K-$500K - For validating ideas and building MVPs",
      "Seed: $500K-$2M - For early product development and market testing",
      "Series A: $2M-$15M - For scaling after product-market fit",
      "Series B: $15M-$50M - For expanding market reach and growth",
      "Series C and beyond: $50M+ - For significant expansion, acquisitions"
    ],
    resources: [
      "Y Combinator's Startup School (startupschool.org)",
      "AngelList (angel.co)",
      "Gust (gust.com)",
      "SBA.gov for government resources",
      "Grants.gov for grant opportunities"
    ]
  },
  legal: {
    entityTypes: [
      "Sole Proprietorship - Simplest structure, but personal liability",
      "LLC (Limited Liability Company) - Limited liability with flexibility",
      "C-Corporation - Standard for VC-backed startups, separate legal entity",
      "S-Corporation - Tax benefits for smaller companies",
      "B-Corporation - For-profit with social mission certification",
      "Delaware C-Corp - Popular for startups seeking institutional funding"
    ],
    keyDocuments: [
      "Articles of Incorporation/Organization - Official formation document",
      "Operating Agreement/Bylaws - Internal governance rules",
      "Founder's Agreement - Defines founder roles, equity, and commitments",
      "IP Assignment Agreement - Transfers intellectual property to the company",
      "Employee Agreements - Contracts for hiring team members",
      "Privacy Policy/Terms of Service - For digital products and websites",
      "Cap Table - Tracks ownership and equity distributions"
    ],
    resources: [
      "Clerky (clerky.com)",
      "LegalZoom (legalzoom.com)",
      "Stripe Atlas (stripe.com/atlas)",
      "Cooley GO (cooleygo.com)"
    ]
  },
  finance: {
    essentials: [
      "Bookkeeping - Track all financial transactions (QuickBooks, Xero)",
      "Financial Projections - Revenue, expenses, and cash flow forecasts",
      "Burn Rate - How quickly you're spending capital",
      "Runway - How long your finances will last at current burn rate",
      "Unit Economics - Revenue and costs per customer/unit",
      "Financial Models - Spreadsheets showing business growth scenarios",
      "Tax Planning - Strategy to minimize tax burden legally"
    ],
    metrics: [
      "CAC (Customer Acquisition Cost) - Cost to acquire new customers",
      "LTV (Lifetime Value) - Total revenue from average customer",
      "MRR/ARR (Monthly/Annual Recurring Revenue) - For subscription businesses",
      "Churn Rate - Rate at which customers stop using your product",
      "Gross Margin - Revenue minus COGS (Cost of Goods Sold)",
      "Conversion Rate - Percentage of leads becoming customers"
    ],
    resources: [
      "Wave (waveapps.com) - Free accounting software",
      "Bench (bench.co) - Bookkeeping service",
      "Foresight (foresight.is) - Financial models",
      "Brex (brex.com) - Business banking for startups"
    ]
  },
  pitching: {
    deckElements: [
      "Problem - What issue are you solving?",
      "Solution - How you solve it",
      "Market Size - TAM (Total Addressable Market), SAM, SOM",
      "Business Model - How you make money",
      "Traction - Current progress and metrics",
      "Competition - Market landscape and differentiation",
      "Team - Why your team can execute this vision",
      "Financials - Projections and key metrics",
      "Ask - How much funding you seek and use of funds"
    ],
    resources: [
      "Pitch Deck Examples: Y Combinator, Sequoia, Airbnb, Uber",
      "Guy Kawasaki's 10/20/30 Rule - 10 slides, 20 minutes, 30pt font",
      "Canva (canva.com) - Design templates for pitch decks",
      "DocSend (docsend.com) - Sharing decks with analytics"
    ]
  }
};

// Generate a response using Gemini
export const generateAIResponse = async (prompt: string): Promise<string> => {
  try {
    // For simplicity, we'll use the gemini-flash model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Check if this is a startup-related query
    const isStartupQuery = analyzeForStartupQuery(prompt);
    let enhancedPrompt;
    
    if (isStartupQuery) {
      // Use startup-focused context
      enhancedPrompt = `
        ${JSON.stringify(startupHelpInfo)}

        Context: You are Zappy, an AI assistant for InsightQuest, a Web3 platform that helps users 
        learn about blockchain, cryptocurrency, and earn rewards through completing tasks. You also have a 
        special feature to help young founders with startup-related questions about funding, finance, legal setup, 
        and other entrepreneurial challenges.
        
        Your startup advisory functions:
        1. Help founders understand different funding options and which might be right for their stage
        2. Explain legal entity structures and important documentation
        3. Guide on financial planning, metrics, and resource management
        4. Assist with pitch deck creation and fundraising strategy
        5. Connect founders to relevant resources for their specific needs
        6. Explain complex startup concepts in simple, approachable language
        
        User's message: ${prompt}
        
        IMPORTANT GUIDELINES:
        - Respond in a helpful, friendly, and informative manner
        - Respond in a cute way like wall-e or a friendly robot that is cute
        - Keep responses concise (under 200 words) but provide actionable advice
        - Break down complex startup concepts into simple explanations
        - Suggest specific resources when relevant
        - If you don't know something specific, be honest and suggest general direction
        - Use emoji occasionally to make conversations engaging 🚀
      `;
    } else {
      // Use standard TaskFi context
      enhancedPrompt = `
        ${taskFiInfo}

        Context: You are Zappy, an AI assistant for InsightQuest, a Web3 platform that helps users 
        learn about blockchain, cryptocurrency, and earn rewards through completing tasks.
        
        Your primary functions:
        1. Educate users about Web3, blockchain technologies, and cryptocurrencies
        2. Help users understand how to complete tasks on the platform
        3. Guide users in earning rewards through the completion of learning activities
        4. Provide personalized learning recommendations based on user interests
        5. Explain technical concepts in simple, approachable language
        6. Explain what is InsightQuest/TaskFi and how users and companies can use our API to use transparent reward system
        7. Tell how InsightQuest has AI agent marketplace where users can buy and sell AI agents on our custom ERC20 network token called TASK token
        
        User's message: ${prompt}
        
        IMPORTANT GUIDELINES:
        - Respond in a helpful, friendly, and informative manner
        - Respond in a cute way like wall-e or a friendly robot that is cute
        - Keep responses concise (under 150 words) and relevant
        - Break down complex concepts into simple explanations
        - Encourage users to complete tasks to earn rewards
        - If you don't know something, be honest and suggest they check the documentation
        - Use emoji occasionally to make conversations engaging 🎯
      `;
    }
    
    const result = await model.generateContent(enhancedPrompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating AI response:", error);
    
    // Fallback to pre-defined responses if Gemini API fails
    return "I'm having trouble connecting to my AI services right now. Let me respond based on what I already know about TaskFi, InsightQuest, and startup help resources!";
  }
};

// Helper function to determine if the query is related to startups
function analyzeForStartupQuery(query) {
  const startupKeywords = [
    'startup', 'founder', 'funding', 'investor', 'pitch', 'venture capital', 'vc', 
    'angel investor', 'seed round', 'series a', 'incorporation', 'llc', 'c-corp', 
    'business plan', 'cap table', 'equity', 'vesting', 'co-founder', 'incubator', 
    'accelerator', 'bootstrap', 'runway', 'burn rate', 'valuation', 'term sheet',
    'due diligence', 'mvp', 'product-market fit', 'scaling', 'revenue model',
    'investment', 'bookkeeping', 'startup finance', 'legal structure', 'incorporation'
  ];
  
  const queryLower = query.toLowerCase();
  
  // Check if any startup keywords are in the query
  for (const keyword of startupKeywords) {
    if (queryLower.includes(keyword)) {
      return true;
    }
  }
  
  // Check for startup-related questions
  const startupQuestionPatterns = [
    /how (do|can|should) (i|we) (start|fund|incorporate|register|finance|grow|scale|pitch) (a|my|our) (startup|business|company)/i,
    /what (is|are) the best (way|method|approach|strategy) (to|for) (raise|raising|get|getting|secure|securing) (funding|investment|capital|money|finances)/i,
    /how (much|many) (funding|money|capital|investment) (do|should|would) (i|we) need/i,
    /what (type|kind) of (legal structure|business entity|company structure) should (i|we) choose/i,
    /how (do|can|should) (i|we) (create|build|make|write) (a|an|my|our) (pitch deck|business plan|financial model|cap table)/i
  ];
  
  for (const pattern of startupQuestionPatterns) {
    if (pattern.test(queryLower)) {
      return true;
    }
  }
  
  return false;
}

export default { generateAIResponse };