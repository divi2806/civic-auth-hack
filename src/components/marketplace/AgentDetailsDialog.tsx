import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Download, 
  Github, 
  Star, 
  Users, 
  Clock, 
  Tag, 
  ExternalLink, 
  Trash2, 
  AlertCircle,
  MessageCircle,
  MapPin,
  Calendar,
  Award,
  Mail
} from "lucide-react";
import { Agent } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { useWeb3 } from "@/contexts/Web3Context";
import { useState } from "react";
import PurchaseAgentDialog from "./PurchaseAgentDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteAgent } from "@/services/agentService";
import { toast } from "sonner";

interface AgentDetailsDialogProps {
  agent: Agent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: (agentId: string) => void;
}

const AgentDetailsDialog = ({ agent, open, onOpenChange, onDelete }: AgentDetailsDialogProps) => {
  const { user } = useWeb3();
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  if (!agent) return null;
  
  const isPurchased = user?.address && agent.purchasedBy?.includes(user.address);
  const isCreator = user?.id && agent.creatorId === user.id;
  const createdDate = new Date(agent.dateCreated);
  const isHumanAgent = agent.agentType === 'human';

  const handleDeleteAgent = async () => {
    if (!agent.id) return;
    
    setIsDeleting(true);
    try {
      await deleteAgent(agent.id);
      toast.success("Agent deleted successfully");
      setDeleteDialogOpen(false);
      onOpenChange(false);
      if (onDelete) {
        onDelete(agent.id);
      }
    } catch (error) {
      console.error("Error deleting agent:", error);
      toast.error("Failed to delete agent", {
        description: "There was an error deleting your agent. Please try again."
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0">
          <div className="p-6">
            <DialogHeader>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg overflow-hidden bg-brand-purple/10 flex items-center justify-center">
                  <img 
                    src={agent.imageUrl} 
                    alt={agent.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-2xl mb-1">{agent.name}</DialogTitle>
                  <DialogDescription className="flex items-center gap-1">
                    <span>by</span>
                    <Avatar className="h-5 w-5 mr-1">
                      <AvatarImage src={agent.creatorAvatarUrl} alt={agent.creatorName} />
                      <AvatarFallback>{agent.creatorName.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground">{agent.creatorName}</span>
                  </DialogDescription>
                </div>
                <Badge>{agent.category}</Badge>
              </div>
            </DialogHeader>
            
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`w-4 h-4 ${
                          index < Math.floor(agent.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : index < agent.rating
                            ? "text-yellow-400 fill-yellow-400 opacity-60"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium ml-2">{agent.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{agent.ratingCount} reviews</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Created {formatDistanceToNow(createdDate, { addSuffix: true })}</span>
                </div>
              </div>
              <div className="flex items-center text-2xl font-bold">
                <span className="text-brand-purple">{agent.price}</span>
                <span className="text-sm ml-1 text-gray-500 font-normal">$TASK</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-400">{agent.description}</p>
            </div>
            
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {isHumanAgent ? (
                // Human Agent Details
                <>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Service Details</h3>
                    <ul className="space-y-3">
                      {agent.experience && (
                        <li className="flex items-start gap-2">
                          <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                          <span><span className="font-medium">Experience:</span> {agent.experience}</span>
                        </li>
                      )}
                      {agent.location && (
                        <li className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                          <span><span className="font-medium">Location:</span> {agent.location}</span>
                        </li>
                      )}
                      {agent.availability && (
                        <li className="flex items-start gap-2">
                          <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                          <span><span className="font-medium">Availability:</span> {agent.availability}</span>
                        </li>
                      )}
                      {agent.contactMethod && (
                        <li className="flex items-start gap-2">
                          <MessageCircle className="w-4 h-4 text-gray-400 mt-0.5" />
                          <span><span className="font-medium">Contact Method:</span> {agent.contactMethod}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Qualifications</h3>
                    {agent.qualifications && agent.qualifications.length > 0 ? (
                      <ul className="space-y-2">
                        {agent.qualifications.map((qualification, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Award className="w-4 h-4 text-gray-400 mt-0.5" />
                            <span>{qualification}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No specific qualifications listed.</p>
                    )}
                  </div>
                </>
              ) : (
                // AI Agent Details
                <>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Features</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="rounded-full p-1 bg-green-500/10 text-green-500 mt-0.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span>Advanced machine learning algorithms</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="rounded-full p-1 bg-green-500/10 text-green-500 mt-0.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span>Regular updates and improvements</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="rounded-full p-1 bg-green-500/10 text-green-500 mt-0.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span>Easy integration with your workflow</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="rounded-full p-1 bg-green-500/10 text-green-500 mt-0.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span>Detailed documentation and support</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Technical Details</h3>
                    <div className="space-y-3">
                      {agent.githubUrl && (
                        <div className="flex items-center gap-2">
                          <Github className="w-4 h-4 text-gray-400" />
                          <a href={agent.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline flex items-center">
                            GitHub Repository <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                      )}
                      <div className="space-y-1">
                        <p className="text-sm text-gray-400">Compatibility</p>
                        <Progress value={98} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>All InsightQuest Platforms</span>
                          <span>98%</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-400">Performance</p>
                        <Progress value={85} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Response time</span>
                          <span>85%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="mt-8 flex gap-4 flex-wrap">
              {isPurchased ? (
                <Button className="flex-1 bg-green-600 hover:bg-green-700">
                  {isHumanAgent ? (
                    <>
                      <MessageCircle className="mr-2 h-4 w-4" /> Contact
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" /> Download
                    </>
                  )}
                </Button>
              ) : !isCreator ? (
                <Button 
                  className="flex-1 purple-gradient" 
                  onClick={() => setPurchaseModalOpen(true)}
                >
                  <Tag className="mr-2 h-4 w-4" /> Purchase ({agent.price} $TASK)
                </Button>
              ) : null}
              
              {!isHumanAgent && agent.githubUrl && (
                <Button variant="outline" asChild>
                  <a href={agent.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" /> View Source
                  </a>
                </Button>
              )}
              
              {isHumanAgent && (
                <Button variant="outline" asChild>
                  <a href={`mailto:contact@example.com?subject=Inquiry about ${agent.name}`}>
                    <Mail className="mr-2 h-4 w-4" /> Send Inquiry
                  </a>
                </Button>
              )}
              
              {isCreator && (
                <Button 
                  variant="destructive" 
                  onClick={() => setDeleteDialogOpen(true)}
                  className="ml-auto"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Agent
                </Button>
              )}
            </div>
          </div>
          
          <div className="mt-6 bg-muted/30 p-6 border-t">
            <h3 className="text-lg font-semibold mb-4">User Reviews</h3>
            {agent.ratingCount > 0 ? (
              <div className="space-y-4">
                {Array.from({ length: Math.min(3, agent.ratingCount) }).map((_, idx) => (
                  <div key={idx} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://api.dicebear.com/6.x/avataaars/svg?seed=user${idx}`} />
                      <AvatarFallback>U{idx}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">User{idx + 1}</h4>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < 4 + (idx % 2) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        {isHumanAgent ? [
                          "Very professional service, exceeded my expectations. Highly recommended!",
                          "Excellent communication and expertise. Delivered exactly what my startup needed.",
                          "Great value for the price. Would definitely hire again for future projects."
                        ][idx] : [
                          "This agent has been incredibly helpful for my workflow. Highly recommended!",
                          "Excellent tool that saved me hours of work. The integration is seamless.",
                          "Great value for the price. Would definitely buy from this creator again."
                        ][idx]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No reviews yet</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Purchase Dialog */}
      <PurchaseAgentDialog 
        agent={agent} 
        open={purchaseModalOpen} 
        onOpenChange={setPurchaseModalOpen} 
        onSuccess={() => onOpenChange(false)}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Delete {isHumanAgent ? 'Human' : 'AI'} Agent
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-medium">{agent.name}</span>? This action cannot be undone and will remove the agent from the marketplace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteAgent();
              }}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                "Delete Agent"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AgentDetailsDialog;