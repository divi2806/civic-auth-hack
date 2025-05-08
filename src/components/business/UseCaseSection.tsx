
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const useCases = [
  {
    id: "enterprise",
    title: "Enterprise Teams",
    description: "Boost productivity and engagement across departments",
    content: [
      {
        title: "Employee Recognition Platform",
        description: "Replace traditional employee recognition programs with a transparent blockchain-based system. Peers can award tokens for exceptional work, which can be redeemed for real benefits."
      },
      {
        title: "Learning & Development",
        description: "Incentivize continuous learning by rewarding employees who complete courses, attend workshops, or share knowledge with colleagues."
      },
      {
        title: "Cross-Department Collaboration",
        description: "Create challenges that require teams from different departments to work together, fostering better company-wide collaboration."
      }
    ]
  },
  {
    id: "startups",
    title: "Startups & Scale-ups",
    description: "Create a culture of achievement and innovation",
    content: [
      {
        title: "Goal Achievement Framework",
        description: "Set company OKRs and reward team members who contribute to achieving these goals with $TASK tokens."
      },
      {
        title: "Innovation Incentives",
        description: "Create bounties for solving specific problems or developing new features, paid out in $TASK tokens."
      },
      {
        title: "Remote Team Engagement",
        description: "Keep distributed teams connected and engaged through shared challenges and visible recognition."
      }
    ]
  },
  {
    id: "education",
    title: "Educational Institutions",
    description: "Motivate students with meaningful rewards",
    content: [
      {
        title: "Course Completion",
        description: "Reward students who complete courses, maintain high grades, or help others understand difficult concepts."
      },
      {
        title: "Project-Based Learning",
        description: "Create token-incentivized projects that require practical application of theoretical knowledge."
      },
      {
        title: "Community Contributions",
        description: "Encourage students to contribute to open-source projects or community initiatives with token rewards."
      }
    ]
  }
];

const UseCaseSection = () => {
  return (
    <div className="py-16 bg-gradient-to-b from-brand-dark-darker to-brand-dark-lighter/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How Businesses Use InsightQuest</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover how different organizations implement our token-based incentive system
          </p>
        </div>
        
        <Tabs defaultValue="enterprise" className="max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-3 mb-8">
            {useCases.map((useCase) => (
              <TabsTrigger key={useCase.id} value={useCase.id}>{useCase.title}</TabsTrigger>
            ))}
          </TabsList>
          
          {useCases.map((useCase) => (
            <TabsContent key={useCase.id} value={useCase.id} className="mt-0">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold">{useCase.title}</h3>
                <p className="text-gray-400">{useCase.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {useCase.content.map((item, i) => (
                  <Card key={i} className="bg-brand-dark-lighter/50 border-brand-purple/10">
                    <CardHeader>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400 text-sm">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default UseCaseSection;
