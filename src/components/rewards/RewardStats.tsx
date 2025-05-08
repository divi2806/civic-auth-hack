
import { CircleDollarSign, Clock, Zap, Award } from "lucide-react";
import { formatTokenAmount } from "@/lib/web3Utils";
import { User } from "@/types";

interface RewardStatsProps {
  user: User;
  isCompact?: boolean;
}

const RewardStats = ({ user, isCompact = false }: RewardStatsProps) => {
  if (isCompact) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          icon={<Award />} 
          value={formatTokenAmount(user.tokensEarned)} 
          label="Tokens" 
          isCompact
        />
        <StatCard 
          icon={<Zap />}
          value={user.level.toString()} 
          label="Level" 
          isCompact
        />
        <StatCard 
          icon={<CircleDollarSign />} 
          value={`$${formatTokenAmount(user.insightValue)}`} 
          label="Value" 
          isCompact
        />
        <StatCard 
          icon={<Clock />} 
          value={`${user.timeSaved}h`} 
          label="Saved" 
          isCompact
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <StatCard 
        icon={<Award className="h-5 w-5 text-yellow-500" />} 
        value={formatTokenAmount(user.tokensEarned)} 
        label="Tokens Earned" 
        description="Total reward tokens earned"
      />
      <StatCard 
        icon={<Zap className="h-5 w-5 text-brand-purple" />}
        value={user.level.toString()} 
        label="Current Level" 
        description={`${user.xp} XP gathered so far`}
      />
      <StatCard 
        icon={<CircleDollarSign className="h-5 w-5 text-green-500" />} 
        value={`$${formatTokenAmount(user.insightValue)}`} 
        label="Insight Value" 
        description="Estimated value of insights"
      />
      <StatCard 
        icon={<Clock className="h-5 w-5 text-blue-500" />} 
        value={`${user.timeSaved}h`} 
        label="Time Saved" 
        description="Hours of productivity gained"
      />
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  description?: string;
  isCompact?: boolean;
}

const StatCard = ({ icon, value, label, description, isCompact = false }: StatCardProps) => {
  if (isCompact) {
    return (
      <div className="glass-card rounded-lg p-3 flex flex-col items-center justify-center">
        <div className="flex items-center justify-center gap-2">
          <span className="text-brand-purple">{icon}</span>
          <span className="font-bold text-sm">{value}</span>
        </div>
        <span className="text-xs text-gray-400 mt-1">{label}</span>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-lg p-5 card-hover">
      <div className="flex items-center justify-between">
        <span className="text-brand-purple">{icon}</span>
        <span className="text-xs px-2 py-1 bg-brand-purple/10 text-brand-purple rounded-full">
          +{Math.floor(Math.random() * 20)}% this week
        </span>
      </div>
      <div className="mt-4">
        <span className="block text-2xl font-bold">{value}</span>
        <span className="text-sm font-medium text-gray-300">{label}</span>
        {description && (
          <p className="text-xs text-gray-400 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
};

export default RewardStats;
