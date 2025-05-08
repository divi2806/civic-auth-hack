import { useState, useEffect } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import MainLayout from "@/components/layout/MainLayout";
import { getAllAgents } from "@/services/agentService";
import { Agent } from "@/types";
import AgentCard from "@/components/marketplace/AgentCard";
import CreateAgentDialog from "@/components/marketplace/CreateAgentDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Search } from "lucide-react";

// Define the categories for each agent type
const AI_CATEGORIES = ["All", "Data Analysis", "Code Assistant", "Chatbot", "Image Generation", "Text Processing", "Finance", "Education", "Productivity", "Health & Fitness"];
const HUMAN_CATEGORIES = ["All", "Healthcare", "Finance", "Legal Services", "Software Development", "Marketing", "Human Resources", "Product Management", "Design", "Business Strategy", "Sales", "Customer Support", "Education", "Consulting"];

export default function Marketplace() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"ai" | "human">("ai");
  const { user } = useWeb3();

  // Fetch agents on component mount
  useEffect(() => {
    fetchAgents();
  }, [activeTab]);

  // Fetch agents from the service
  const fetchAgents = async () => {
    setIsLoading(true);
    try {
      const fetchedAgents = await getAllAgents(activeTab);
      setAgents(fetchedAgents);
      setFilteredAgents(fetchedAgents);
    } catch (error) {
      console.error("Error fetching agents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter agents based on search query and category
  useEffect(() => {
    let result = agents;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (agent) =>
          agent.name.toLowerCase().includes(query) ||
          agent.description.toLowerCase().includes(query) ||
          agent.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== "All") {
      result = result.filter((agent) => agent.category === selectedCategory);
    }

    setFilteredAgents(result);
  }, [searchQuery, selectedCategory, agents]);

  // Handle agent creation
  const handleAgentCreated = (newAgent: Agent) => {
    setAgents((prev) => [newAgent, ...prev]);
    fetchAgents(); // Refresh the list
  };

  // Handle agent deletion
  const handleAgentDeleted = (agentId: string) => {
    setAgents((prev) => prev.filter((agent) => agent.id !== agentId));
    setFilteredAgents((prev) => prev.filter((agent) => agent.id !== agentId));
  };

  return (
    <MainLayout>
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Agent Marketplace</h1>
          <p className="text-gray-500 mt-1">
            Discover and purchase AI and human agents for your startup needs
          </p>
        </div>
        <Button
          onClick={() => setCreateDialogOpen(true)}
          className="purple-gradient"
        >
          <Plus className="mr-2 h-4 w-4" />
          List Your Agent
        </Button>
      </div>

      <Tabs 
        defaultValue="ai" 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as "ai" | "human")}
        className="mb-8"
      >
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="ai">AI Agents</TabsTrigger>
          <TabsTrigger value="human">Human Agents</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search agents..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {(activeTab === "ai" ? AI_CATEGORIES : HUMAN_CATEGORIES).map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
        </div>
      ) : filteredAgents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onDelete={handleAgentDeleted}
              agentType={activeTab}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="text-xl font-semibold mb-2">No agents found</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery || selectedCategory !== "All"
              ? "Try adjusting your search or filters"
              : `No ${activeTab} agents are currently available.`}
          </p>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="purple-gradient"
          >
            <Plus className="mr-2 h-4 w-4" />
            Be the first to list a{activeTab === "ai" ? "n AI" : " human"} agent
          </Button>
        </div>
      )}

      <CreateAgentDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onAgentCreated={handleAgentCreated}
      />
    </div>
    </MainLayout>
  );
}