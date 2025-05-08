// components/AgentCard.tsx

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Tag, Info, Trash2, Download, Coins, Loader2, Calendar, MapPin, Clock, MessageCircle } from "lucide-react";
import { Agent } from "@/types";
import { useWeb3 } from "@/contexts/Web3Context";
import PurchaseAgentDialog from "./PurchaseAgentDialog";
import AgentDetailsDialog from "./AgentDetailsDialog";
import { deleteAgent } from "@/services/agentService";
import { toast } from "sonner";
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

interface AgentCardProps {
  agent: Agent;
  onDelete: (agentId: string) => void;
  agentType?: 'ai' | 'human';
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onDelete }) => {
  const { user } = useWeb3();
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isPurchased = user?.address && agent.purchasedBy?.includes(user.address);
  const isCreator = user?.id === agent.creatorId;
  const isHumanAgent = agent.agentType === 'human';

  const handleDeleteClick = async () => {
    setIsDeleting(true);
    try {
      await deleteAgent(agent.id);
      toast.success("Agent deleted successfully");
      onDelete(agent.id);
      setConfirmDeleteOpen(false);
    } catch (error) {
      toast.error("Failed to delete agent");
      console.error("Error deleting agent:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md overflow-hidden bg-brand-purple/10 flex items-center justify-center">
              <img 
                src={agent.imageUrl} 
                alt={agent.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl truncate pr-2">{agent.name}</CardTitle>
                <Badge className="ml-auto bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20 whitespace-nowrap">
                  {agent.category}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={agent.creatorAvatarUrl} />
                  <AvatarFallback className="bg-brand-purple/20 text-brand-purple text-xs">
                    {agent.creatorName.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <CardDescription className="truncate">by {agent.creatorName}</CardDescription>
              </div>
            </div>
          </div>
          {isCreator && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-100"
              onClick={() => setConfirmDeleteOpen(true)}
            >
              <Trash2 size={18} />
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <p className="text-sm text-gray-600 line-clamp-2 h-10">
            {agent.description}
          </p>
          
          {/* Display human agent specific info if it's a human agent */}
          {isHumanAgent && agent.experience && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>Experience: {agent.experience}</span>
              </div>
              {agent.location && (
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{agent.location}</span>
                </div>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`h-4 w-4 ${
                    index < Math.round(agent.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">({agent.ratingCount})</span>
            </div>
            <div className="flex items-center">
              <Tag className="h-4 w-4 text-brand-purple mr-1" />
              <span className="font-bold text-brand-purple">{agent.price}</span>
              <span className="text-xs ml-1 text-gray-500">$TASK</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button
            variant="outline"
            className="w-1/2 border-brand-purple/30"
            onClick={() => setDetailsModalOpen(true)}
          >
            <Info className="h-4 w-4 mr-2" />
            Details
          </Button>
          {isPurchased ? (
            <Button className="w-1/2 purple-gradient">
              {isHumanAgent ? (
                <>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </>
              )}
            </Button>
          ) : !isCreator && (
            <Button
              onClick={() => setPurchaseModalOpen(true)}
              className="w-full purple-gradient"
            >
              <Coins className="h-4 w-4 mr-2" />
              Purchase
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your {agent.agentType} agent "{agent.name}" from the marketplace.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClick}
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Purchase Dialog */}
      <PurchaseAgentDialog
        open={purchaseModalOpen}
        onOpenChange={setPurchaseModalOpen}
        agent={agent}
      />

      {/* Details Dialog */}
      <AgentDetailsDialog
        agent={agent}
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
      />
    </>
  );
};

export default AgentCard;