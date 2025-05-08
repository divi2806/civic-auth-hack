
import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Award, Rocket, Star } from "lucide-react";

interface LevelUpDialogProps {
  level: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LevelUpDialog: React.FC<LevelUpDialogProps> = ({ level, open, onOpenChange }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    if (open) {
      setShowConfetti(true);
      
      // Trigger confetti animation
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // Since particles fall down, start from the top
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);
      
      return () => {
        clearInterval(interval);
      };
    }
  }, [open]);
  
  // Get appropriate icon based on level
  const getLevelIcon = () => {
    if (level >= 15) return <Rocket className="h-12 w-12 text-purple-400" />;
    if (level >= 10) return <Sparkles className="h-12 w-12 text-yellow-400" />;
    if (level >= 5) return <Star className="h-12 w-12 text-blue-400" />;
    return <Award className="h-12 w-12 text-green-400" />;
  };
  
  // Get level message based on level
  const getLevelMessage = () => {
    if (level >= 15) return "You've reached expert status! Your dedication to learning is impressive.";
    if (level >= 10) return "You're now an advanced learner! Your journey is really taking off.";
    if (level >= 5) return "You're making great progress on your learning journey!";
    return "You're off to a great start! Keep up the good work!";
  };
  
  // Get rewards based on level
  const getLevelRewards = () => {
    const rewards = [];
    
    // All levels get XP bonus
    rewards.push(`${level * 10} XP Bonus`);
    
    // Higher levels get more rewards
    if (level >= 3) rewards.push(`${level * 5} $TASK Tokens`);
    if (level >= 5) rewards.push("New task types unlocked");
    if (level >= 10) rewards.push("Premium content access");
    if (level >= 15) rewards.push("Special profile badge");
    
    return rewards;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-brand-purple/20 max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Level Up! 🎉
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-purple/30 to-brand-purple-dark/30 flex items-center justify-center mb-4">
            {getLevelIcon()}
          </div>
          
          <h3 className="text-xl font-bold text-center mb-2">
            You've Reached Level {level}!
          </h3>
          
          <p className="text-center text-gray-300 mb-4">
            {getLevelMessage()}
          </p>
          
          <div className="space-y-2 w-full max-w-xs">
            <p className="text-sm font-semibold text-brand-purple mb-1">Rewards Unlocked:</p>
            {getLevelRewards().map((reward, index) => (
              <div key={index} className="flex items-center p-2 bg-brand-purple/10 rounded-md border border-brand-purple/20">
                <Award className="h-4 w-4 mr-2 text-yellow-400" />
                <span>{reward}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button 
            className="purple-gradient px-8" 
            onClick={() => onOpenChange(false)}
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LevelUpDialog;
