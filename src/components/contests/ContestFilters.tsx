
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

interface ContestFiltersProps {
  onFilterChange: (filters: {
    category: string;
    sortBy: string;
    minPrize: number | null;
    maxEntryFee: number | null;
    searchQuery: string;
  }) => void;
}

const ContestFilters: React.FC<ContestFiltersProps> = ({ onFilterChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("endingSoon");
  const [minPrize, setMinPrize] = useState<string>("");
  const [maxEntryFee, setMaxEntryFee] = useState<string>("");

  const handleFilterApply = () => {
    onFilterChange({
      category,
      sortBy,
      minPrize: minPrize ? Number(minPrize) : null,
      maxEntryFee: maxEntryFee ? Number(maxEntryFee) : null,
      searchQuery
    });
  };

  return (
    <div className="bg-brand-dark-lighter/50 p-4 rounded-lg mb-6 border border-brand-purple/10">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contests..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          className="flex gap-2 border-brand-purple/30 text-brand-purple"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
        </Button>
        <Button onClick={handleFilterApply}>Apply</Button>
      </div>
      
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div>
            <p className="text-sm font-medium mb-2">Category</p>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="coding">Coding</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="productivity">Productivity</SelectItem>
                <SelectItem value="learning">Learning</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Sort By</p>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="endingSoon">Ending Soon</SelectItem>
                <SelectItem value="mostParticipants">Most Participants</SelectItem>
                <SelectItem value="highestPrize">Highest Prize</SelectItem>
                <SelectItem value="lowestEntry">Lowest Entry Fee</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Min Prize ($TASK)</p>
            <Input
              type="number"
              placeholder="Minimum prize"
              value={minPrize}
              onChange={(e) => setMinPrize(e.target.value)}
            />
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Max Entry Fee ($TASK)</p>
            <Input
              type="number"
              placeholder="Maximum entry fee"
              value={maxEntryFee}
              onChange={(e) => setMaxEntryFee(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ContestFilters;
