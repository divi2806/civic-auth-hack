// services/LeetCodeService.ts
import axios from 'axios';

// LeetCode GraphQL endpoint
const LEETCODE_API = 'https://leetcode.com/graphql';

// GraphQL query to get recent accepted submissions
const RECENT_AC_SUBMISSIONS_QUERY = `
query recentAcSubmissions($username: String!, $limit: Int!) {
  recentAcSubmissionList(username: $username, limit: $limit) {
    id
    title
    titleSlug
    timestamp
  }
}
`;

// GraphQL query to get problem difficulty
const PROBLEM_DIFFICULTY_QUERY = `
query problemData($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    difficulty
    title
  }
}
`;

// Extract problem slug from LeetCode URL
export const extractProblemSlug = (url: string): string | null => {
  try {
    if (!url.includes('leetcode.com/problems/')) {
      return null;
    }
    
    // Extract the slug from URL like https://leetcode.com/problems/two-sum/
    const parts = url.split('/problems/');
    if (parts.length < 2) {
      return null;
    }
    
    const slug = parts[1].split('/')[0];
    return slug;
  } catch (error) {
    console.error('Error extracting problem slug:', error);
    return null;
  }
};

// Verify if a user has solved a specific LeetCode problem
export const verifyLeetCodeProblem = async (
  leetcodeUsername: string, 
  problemUrl: string,
  taskCreatedAt: string
): Promise<{ 
  success: boolean; 
  problem?: { 
    title: string; 
    difficulty: string;
    timestamp: number;
  } 
}> => {
  try {
    const titleSlug = extractProblemSlug(problemUrl);
    
    if (!titleSlug) {
      return { success: false };
    }
    
    // Get user's recent accepted submissions
    const response = await axios.post(LEETCODE_API, {
      query: RECENT_AC_SUBMISSIONS_QUERY,
      variables: {
        username: leetcodeUsername,
        limit: 20 // Get last 20 accepted submissions
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const submissions = response.data?.data?.recentAcSubmissionList || [];
    
    // Check if the problem has been solved
    const solvedSubmission = submissions.find((sub: any) => sub.titleSlug === titleSlug);
    
    if (!solvedSubmission) {
      return { success: false };
    }
    
    // Check if the solution was submitted after the task was created
    if (taskCreatedAt) {
      const taskCreatedTimestamp = new Date(taskCreatedAt).getTime() / 1000;
      const submissionTimestamp = parseInt(solvedSubmission.timestamp);
      
      if (submissionTimestamp < taskCreatedTimestamp) {
        return { success: false };
      }
    }
    
    // Get problem difficulty
    const difficultyResponse = await axios.post(LEETCODE_API, {
      query: PROBLEM_DIFFICULTY_QUERY,
      variables: {
        titleSlug: titleSlug
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const problemData = difficultyResponse.data?.data?.question || {};
    
    return { 
      success: true,
      problem: {
        title: solvedSubmission.title || problemData.title,
        difficulty: problemData.difficulty || 'Easy',
        timestamp: parseInt(solvedSubmission.timestamp)
      }
    };
  } catch (error) {
    console.error('Error verifying LeetCode problem:', error);
    return { success: false };
  }
};

// Calculate reward based on problem difficulty
export const calculateReward = (difficulty: string): number => {
  switch (difficulty.toLowerCase()) {
    case 'hard':
      return 20;
    case 'medium':
      return 10;
    case 'easy':
    default:
      return 5;
  }
};

export default {
  verifyLeetCodeProblem,
  extractProblemSlug,
  calculateReward
};
