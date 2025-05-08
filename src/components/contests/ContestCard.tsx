
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Calendar, Coins, InfoIcon } from "lucide-react";
import ContestDetailsDialog from "./ContestDetailsDialog";

export type ContestCategory = "coding" | "finance" | "productivity" | "learning";

interface ContestCardProps {
  id: string;
  title: string;
  description: string;
  category: ContestCategory;
  entryFee: number;
  prizePool: number;
  participants: number;
  endDate: string;
  featured?: boolean;
  onEnterContest: (contestId: string) => void;
}

const categoryColors: Record<ContestCategory, string> = {
  coding: "bg-blue-500",
  finance: "bg-green-500",
  productivity: "bg-purple-500",
  learning: "bg-amber-500",
};

const ContestCard: React.FC<ContestCardProps> = ({
  id,
  title,
  description,
  category,
  entryFee,
  prizePool,
  participants,
  endDate,
  featured = false,
  onEnterContest,
}) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  const contest = {
    id,
    title,
    description,
    category,
    entryFee,
    prizePool,
    participants,
    endDate,
    featured
  };

  return (
    <>
      <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${featured ? 'border-2 border-brand-purple purple-glow' : 'border-border'}`}>
        <div className={`h-2 ${categoryColors[category]}`} />
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant={featured ? "default" : "outline"} className={featured ? "bg-brand-purple" : ""}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Badge>
            {featured && <Badge className="bg-amber-500">Featured</Badge>}
          </div>
          <CardTitle className="text-xl mt-2">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              <div>
                <p className="text-sm text-muted-foreground">Prize Pool</p>
                <p className="font-medium">{prizePool} $TASK</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-brand-purple" />
              <div>
                <p className="text-sm text-muted-foreground">Entry Fee</p>
                <p className="font-medium">{entryFee} $TASK</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Participants</p>
                <p className="font-medium">{participants}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-red-400" />
              <div>
                <p className="text-sm text-muted-foreground">Ends</p>
                <p className="font-medium">{new Date(endDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button 
            variant="outline"
            size="icon"
            className="w-10 rounded-full flex-shrink-0"
            onClick={() => setDetailsOpen(true)}
          >
            <InfoIcon className="h-4 w-4" />
          </Button>
          <Button 
            className="w-full purple-gradient" 
            onClick={() => onEnterContest(id)}
          >
            Enter Contest
          </Button>
        </CardFooter>
      </Card>
      
      <ContestDetailsDialog
        contest={contest}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </>
  );
};

export default ContestCard;
