import { useState, useEffect } from "react";
import { Loader2, Rocket } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useWeb3 } from "@/contexts/Web3Context";
import { addAgent } from "@/services/agentService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

// AI Agent form schema
const aiFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }).max(50),
  displayName: z.string().min(2, { message: "Display name must be at least 2 characters" }).max(30),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }).max(300),
  category: z.string().min(1, { message: "Please select a category" }),
  githubUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  price: z.number().min(10, { message: "Minimum price is 10 $TASK" }).max(10000, { message: "Maximum price is 10,000 $TASK" }),
  agentType: z.literal("ai")
});

// Human Agent form schema
const humanFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }).max(50),
  displayName: z.string().min(2, { message: "Display name must be at least 2 characters" }).max(30),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }).max(300),
  category: z.string().min(1, { message: "Please select a category" }),
  price: z.number().min(10, { message: "Minimum price is 10 $TASK" }).max(10000, { message: "Maximum price is 10,000 $TASK" }),
  experience: z.string().min(2, { message: "Experience is required" }).max(50),
  location: z.string().min(2, { message: "Location is required" }).max(100),
  availability: z.string().min(2, { message: "Availability is required" }).max(100),
  contactMethod: z.string().min(2, { message: "Contact method is required" }).max(100),
  qualifications: z.array(z.string()).optional(),
  agentType: z.literal("human")
});

type AIFormValues = z.infer<typeof aiFormSchema>;
type HumanFormValues = z.infer<typeof humanFormSchema>;

interface CreateAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgentCreated: (agent: any) => void;
}

const AI_CATEGORIES = [
  "Data Analysis", 
  "Code Assistant", 
  "Chatbot", 
  "Image Generation", 
  "Text Processing", 
  "Finance", 
  "Education", 
  "Productivity", 
  "Health & Fitness"
];

const HUMAN_CATEGORIES = [
  "Healthcare", 
  "Finance", 
  "Legal Services", 
  "Software Development", 
  "Marketing", 
  "Human Resources", 
  "Product Management", 
  "Design", 
  "Business Strategy", 
  "Sales", 
  "Customer Support", 
  "Education", 
  "Consulting"
];

const CreateAgentDialog: React.FC<CreateAgentDialogProps> = ({
  open,
  onOpenChange,
  onAgentCreated
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"ai" | "human">("ai");
  const { user } = useWeb3();
  const [selectedQualifications, setSelectedQualifications] = useState<string[]>([]);

  // Initialize AI form with default values
  const aiForm = useForm<AIFormValues>({
    resolver: zodResolver(aiFormSchema),
    defaultValues: {
      name: "",
      displayName: user?.username || "",
      description: "",
      category: "",
      githubUrl: "",
      price: 100,
      agentType: "ai"
    },
  });

  // Initialize Human form with default values
  const humanForm = useForm<HumanFormValues>({
    resolver: zodResolver(humanFormSchema),
    defaultValues: {
      name: "",
      displayName: user?.username || "",
      description: "",
      category: "",
      price: 200,
      experience: "",
      location: "",
      availability: "",
      contactMethod: "",
      qualifications: [],
      agentType: "human"
    },
  });

  // Update form default values when user changes
  useEffect(() => {
    if (user?.username) {
      aiForm.setValue('displayName', user.username);
      humanForm.setValue('displayName', user.username);
    }
  }, [user, aiForm, humanForm]);

  const handleQualificationChange = (qualification: string, checked: boolean) => {
    if (checked) {
      setSelectedQualifications([...selectedQualifications, qualification]);
    } else {
      setSelectedQualifications(selectedQualifications.filter(q => q !== qualification));
    }
    
    // Update the form value
    humanForm.setValue('qualifications', 
      checked 
        ? [...selectedQualifications, qualification]
        : selectedQualifications.filter(q => q !== qualification)
    );
  };

  const onSubmitAI = async (data: AIFormValues) => {
    if (!user?.id) {
      toast.error("You need to connect your wallet first");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create a new AI agent
      const newAgent = {
        name: data.name,
        description: data.description,
        category: data.category,
        githubUrl: data.githubUrl,
        price: data.price,
        rating: 0,
        ratingCount: 0,
        creatorId: user.id,
        creatorName: data.displayName || user.username || "Anonymous",
        creatorAvatarUrl: user.avatarUrl || `https://api.dicebear.com/6.x/avataaars/svg?seed=${user.id}`,
        imageUrl: `https://api.dicebear.com/6.x/bottts/svg?seed=${Date.now()}`,
        purchasedBy: [],
        agentType: "ai" as const
      };

      // Add to Firebase
      const createdAgent = await addAgent(newAgent);
      
      toast.success("Agent listed successfully!", {
        description: "Your AI agent is now available on the marketplace.",
      });
      
      onAgentCreated(createdAgent);
      aiForm.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating agent:", error);
      toast.error("Failed to list agent", {
        description: "There was an error while creating your agent. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitHuman = async (data: HumanFormValues) => {
    if (!user?.id) {
      toast.error("You need to connect your wallet first");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create a new Human agent
      const newAgent = {
        name: data.name,
        description: data.description,
        category: data.category,
        price: data.price,
        rating: 0,
        ratingCount: 0,
        creatorId: user.id,
        creatorName: data.displayName || user.username || "Anonymous",
        creatorAvatarUrl: user.avatarUrl || `https://api.dicebear.com/6.x/avataaars/svg?seed=${user.id}`,
        imageUrl: `https://api.dicebear.com/6.x/personas/svg?seed=${Date.now()}`,
        purchasedBy: [],
        agentType: "human" as const,
        experience: data.experience,
        location: data.location,
        availability: data.availability,
        contactMethod: data.contactMethod,
        qualifications: selectedQualifications
      };

      // Add to Firebase
      const createdAgent = await addAgent(newAgent);
      
      toast.success("Human agent listed successfully!", {
        description: "Your human agent is now available on the marketplace.",
      });
      
      onAgentCreated(createdAgent);
      humanForm.reset();
      setSelectedQualifications([]);
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating human agent:", error);
      toast.error("Failed to list human agent", {
        description: "There was an error while creating your human agent. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Common qualifications for human agents
  const commonQualifications = [
    "PhD", "MBA", "MD", "JD", "CPA", "PMP", "SHRM-CP", "AWS Certified", 
    "Google Cloud Certified", "Microsoft Certified", "Scrum Master", 
    "Six Sigma", "CISSP", "CFA", "Series 7", "Series 63"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Rocket className="h-6 w-6 text-brand-purple" />
            List Your Agent
          </DialogTitle>
          <DialogDescription>
            Share your custom agent with the community and earn $TASK tokens.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="ai" value={activeTab} onValueChange={(value) => setActiveTab(value as "ai" | "human")}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="ai">AI Agent</TabsTrigger>
            <TabsTrigger value="human">Human Agent</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ai">
            <Form {...aiForm}>
              <form onSubmit={aiForm.handleSubmit(onSubmitAI)} className="space-y-4">
                <FormField
                  control={aiForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agent Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Code Genius" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={aiForm.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Creator Display Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your display name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={aiForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what your AI agent does and why it's useful..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={aiForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {AI_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={aiForm.control}
                  name="githubUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://github.com/yourusername/repository" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={aiForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($TASK tokens)</FormLabel>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{field.value} $TASK</span>
                      </div>
                      <FormControl>
                        <Slider
                          min={10}
                          max={1000}
                          step={10}
                          onValueChange={(value) => field.onChange(value[0])}
                          value={[field.value]}
                          className="py-4"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="border-brand-purple/30"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="purple-gradient">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    List AI Agent
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="human">
            <Form {...humanForm}>
              <form onSubmit={humanForm.handleSubmit(onSubmitHuman)} className="space-y-4">
                <FormField
                  control={humanForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Dr. Sarah Johnson" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={humanForm.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business/Brand Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your business or brand name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={humanForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the services you offer and how you can help startups..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={humanForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {HUMAN_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={humanForm.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 10+ years" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={humanForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Remote (US-based)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={humanForm.control}
                    name="availability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Availability</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Mon-Fri, 9am-5pm EST" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={humanForm.control}
                    name="contactMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Methods</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Video call, Email, Phone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={humanForm.control}
                  name="qualifications"
                  render={() => (
                    <FormItem>
                      <FormLabel>Qualifications & Certifications</FormLabel>
                      <FormDescription>
                        Select all that apply or add your own
                      </FormDescription>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                        {commonQualifications.map((qualification) => (
                          <div key={qualification} className="flex items-center space-x-2">
                            <Checkbox 
                              id={qualification} 
                              checked={selectedQualifications.includes(qualification)}
                              onCheckedChange={(checked) => 
                                handleQualificationChange(qualification, checked as boolean)
                              }
                            />
                            <label 
                              htmlFor={qualification}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {qualification}
                            </label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={humanForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hourly Rate ($TASK tokens)</FormLabel>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{field.value} $TASK</span>
                      </div>
                      <FormControl>
                        <Slider
                          min={50}
                          max={1000}
                          step={10}
                          onValueChange={(value) => field.onChange(value[0])}
                          value={[field.value]}
                          className="py-4"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="border-brand-purple/30"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="purple-gradient">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    List Human Agent
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAgentDialog;