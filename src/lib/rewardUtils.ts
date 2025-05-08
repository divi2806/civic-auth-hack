
/**
 * Calculates task reward based on type and complexity
 */
export const calculateTaskReward = (taskType: "leetcode" | "course" | "video", complexity: number = 1): { tokens: number, xp: number } => {
  // Base rewards by task type
  const baseRewards = {
    leetcode: { tokens: 10, xp: 100 },
    course: { tokens: 8, xp: 120 },
    video: { tokens: 5, xp: 80 }
  };
  
  // Apply complexity multiplier (1-3 scale)
  const validComplexity = Math.max(1, Math.min(3, complexity));
  
  return {
    tokens: Math.round(baseRewards[taskType].tokens * validComplexity),
    xp: Math.round(baseRewards[taskType].xp * validComplexity)
  };
};

/**
 * Gets reward range for task type
 */
export const getRewardRange = (taskType: "leetcode" | "course" | "video"): { tokens: string, xp: string } => {
  const min = calculateTaskReward(taskType, 1);
  const max = calculateTaskReward(taskType, 3);
  
  return {
    tokens: `${min.tokens}-${max.tokens}`,
    xp: `${min.xp}-${max.xp}`
  };
};

/**
 * Calculate task complexity based on description length, title, etc.
 */
export const estimateTaskComplexity = (title: string, description: string): number => {
  // Simplified complexity estimation
  let complexity = 1;
  
  // Check title for complexity indicators
  const complexWords = ['advanced', 'complex', 'difficult', 'expert', 'hard'];
  const simpleWords = ['basic', 'simple', 'easy', 'beginner', 'introductory'];
  
  const lowerTitle = title.toLowerCase();
  
  // Check for complexity words in title
  if (complexWords.some(word => lowerTitle.includes(word))) {
    complexity += 1;
  }
  
  // Check for simplicity words in title
  if (simpleWords.some(word => lowerTitle.includes(word))) {
    complexity -= 0.5;
  }
  
  // Consider description length
  if (description.length > 100) {
    complexity += 0.5;
  }
  
  // Ensure complexity is between 1-3
  return Math.max(1, Math.min(3, complexity));
};
