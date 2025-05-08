import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Loader, 
  ArrowRight, 
  RefreshCw, 
  Trophy, 
  AlertTriangle,
  Coins,
  ExternalLink
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { saveQuizAttempt, getQuizAttempts } from '@/services/firebase';
import { useWeb3 } from '@/contexts/Web3Context';
import { useTasks } from '@/contexts/TaskContext';
import { Task } from '@/types';
import QuizService, { QuizQuestion, QuizAnswer, QuizVerificationResponse } from '@/services/quizService';

interface TaskQuizProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onFailure: () => void;
}

const TaskQuiz: React.FC<TaskQuizProps> = ({ task, open, onOpenChange, onSuccess, onFailure }) => {
  const { user, address } = useWeb3();
  const { generateTaskQuiz } = useTasks();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [maxAttemptsReached, setMaxAttemptsReached] = useState(false);
  const [allOptions, setAllOptions] = useState<string[][]>([]);
  const [userAnswers, setUserAnswers] = useState<QuizAnswer[]>([]);
  const [verificationResult, setVerificationResult] = useState<{
    passed: boolean;
    reward?: number;
    txHash?: string;
  } | null>(null);
  

  // Initialize quiz when opened
  useEffect(() => {
    if (open && user) {
      initializeQuiz();
    }
  }, [open, user]);
  
  const initializeQuiz = async () => {
    setLoading(true);
    try {
      // Check previous attempts
      if (user?.id) {
        const previousAttempts = await getQuizAttempts(user.id, task.id);
        const attemptsCount = previousAttempts.length;
        
        if (attemptsCount >= 2) {
          setMaxAttemptsReached(true);
          setLoading(false);
          return;
        }
        
        setAttemptNumber(attemptsCount + 1);
      }
      
      // Generate new questions using Gemini AI
      const quizResponse = await QuizService.generateQuiz(
        task.type,
        task.title,
        task.description,
        5 // Number of questions
      );
      
      if (!quizResponse.success || quizResponse.questions.length === 0) {
        toast.error("Failed to generate quiz questions");
        onFailure();
        onOpenChange(false);
        return;
      }
      
      setQuestions(quizResponse.questions);
      
      // Prepare all options (correct + incorrect) for each question
      const optionsArray = quizResponse.questions.map(q => {
        const options = [...q.incorrect_answers, q.correct_answer];
        return shuffleArray(options);
      });
      
      setAllOptions(optionsArray);
      
      // Reset quiz state
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setCorrectAnswers(0);
      setQuizCompleted(false);
      setUserAnswers([]);
      setVerificationResult(null);
    } catch (error) {
      console.error("Error initializing quiz:", error);
      toast.error("Failed to load quiz. Please try again.");
      onFailure();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };
  
  const handleOptionSelect = (optionIndex: number) => {
    if (!isAnswerSubmitted) {
      setSelectedOption(optionIndex);
    }
  };
  
  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    
    setIsAnswerSubmitted(true);
    
    const currentQuestion = questions[currentQuestionIndex];
    const selectedOptionText = allOptions[currentQuestionIndex][selectedOption];
    const isCorrect = selectedOptionText === currentQuestion.correct_answer;
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    
    // Save this answer
    const answer: QuizAnswer = {
      questionId: `q-${currentQuestionIndex}`,
      question: currentQuestion.question,
      selected_answer: selectedOptionText,
      correct_answer: currentQuestion.correct_answer,
      is_correct: isCorrect,
      difficulty: currentQuestion.difficulty
    };
    
    setUserAnswers(prev => [...prev, answer]);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      finishQuiz();
    }
  };
  
  const finishQuiz = async () => {
    setQuizCompleted(true);
    setVerifying(true);
    
    try {
      // Verify quiz with backend
      if (user?.id && address) {
        const verificationResponse = await QuizService.verifyQuiz(
          user.id,
          task.id,
          userAnswers,
          address
        );
        
        if (verificationResponse.success) {
          setVerificationResult({
            passed: verificationResponse.passed,
            reward: verificationResponse.reward,
            txHash: verificationResponse.txHash
          });
          
          // Save attempt to Firebase
          await saveQuizAttempt({
            userId: user.id,
            taskId: task.id,
            score: verificationResponse.score,
            totalQuestions: verificationResponse.totalQuestions,
            passed: verificationResponse.passed,
            attemptNumber,
            timestamp: new Date().toISOString(),
            reward: verificationResponse.reward,
            txHash: verificationResponse.txHash
          });
          
          // If passed, call success callback
          if (verificationResponse.passed) {
            toast.success(`Quiz passed! You've earned ${verificationResponse.reward} $TASK tokens.`, {
              icon: <Coins className="h-4 w-4 text-yellow-500" />
            });
            
            // Wait a moment before closing
            setTimeout(() => {
              onSuccess();
            }, 2000);
          } else if (attemptNumber >= 2) {
            toast.error("Maximum attempts reached. Try another task.");
            setTimeout(() => {
              onFailure();
            }, 2000);
          }
        } else {
          toast.error(verificationResponse.message || "Verification failed");
          setVerificationResult({
            passed: false
          });
        }
      }
    } catch (error) {
      console.error("Error verifying quiz:", error);
      toast.error("Failed to verify quiz results");
    } finally {
      setVerifying(false);
    }
  };
  
  const handleRetry = () => {
    if (attemptNumber < 2) {
      setAttemptNumber(prev => prev + 1);
      initializeQuiz();
    } else {
      setMaxAttemptsReached(true);
    }
  };
  
  // Calculate progress percentage
  const progressPercentage = ((currentQuestionIndex + (isAnswerSubmitted ? 1 : 0)) / questions.length) * 100;
  
  // Shuffle array helper function
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="glass-card border-brand-purple/20">
          <div className="py-10 flex flex-col items-center justify-center">
            <Loader className="h-10 w-10 animate-spin text-brand-purple mb-4" />
            <p>Loading quiz questions...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  if (maxAttemptsReached) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="glass-card border-brand-purple/20">
          <DialogHeader>
            <DialogTitle className="text-xl text-center">Maximum Attempts Reached</DialogTitle>
          </DialogHeader>
          
          <div className="py-6 flex flex-col items-center">
            <AlertTriangle className="h-16 w-16 text-yellow-400 mb-4" />
            <p className="text-center mb-4">
              You've already used all your attempts for this quiz. You need to pass the quiz to earn $TASK tokens.
            </p>
            <p className="text-center text-sm text-gray-400">
              Try another task or revisit the learning material to improve your knowledge.
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                onFailure();
                onOpenChange(false);
              }}
              className="w-full"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-brand-purple/20 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Knowledge Check: {task.title}</DialogTitle>
        </DialogHeader>
        
        {!quizCompleted ? (
          <>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>Attempt {attemptNumber}/2</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            
            <div className="py-2">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-1">
                  {questions[currentQuestionIndex]?.question}
                </h3>
                <p className="text-sm text-gray-400">
                  Select the best answer
                </p>
              </div>
              
              <div className="space-y-3">
                {allOptions[currentQuestionIndex]?.map((option, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-md border cursor-pointer transition-colors ${
                      selectedOption === idx
                        ? "border-brand-purple bg-brand-purple/10"
                        : "border-gray-700 hover:border-gray-500"
                    } ${
                      isAnswerSubmitted
                        ? option === questions[currentQuestionIndex].correct_answer
                          ? "border-green-500 bg-green-500/10"
                          : selectedOption === idx
                            ? "border-red-500 bg-red-500/10"
                            : ""
                        : ""
                    }`}
                    onClick={() => handleOptionSelect(idx)}
                  >
                    <div className="flex items-start">
                      <div className="flex-1">{option}</div>
                      
                      {isAnswerSubmitted && (
                        <>
                          {option === questions[currentQuestionIndex].correct_answer && (
                            <CheckCircle2 className="h-5 w-5 text-green-500 ml-2 flex-shrink-0" />
                          )}
                          {selectedOption === idx && option !== questions[currentQuestionIndex].correct_answer && (
                            <XCircle className="h-5 w-5 text-red-500 ml-2 flex-shrink-0" />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <DialogFooter>
              {!isAnswerSubmitted ? (
                <Button
                  className="purple-gradient"
                  disabled={selectedOption === null}
                  onClick={handleSubmitAnswer}
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  className="purple-gradient"
                  onClick={handleNextQuestion}
                >
                  {currentQuestionIndex < questions.length - 1 ? (
                    <>
                      Next Question
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    "Complete Quiz"
                  )}
                </Button>
              )}
            </DialogFooter>
          </>
        ) : verifying ? (
          <div className="py-10 flex flex-col items-center justify-center">
            <Loader className="h-10 w-10 animate-spin text-brand-purple mb-4" />
            <p>Verifying your answers and processing rewards...</p>
          </div>
        ) : verificationResult ? (
          <div className="py-4">
            <div className="flex flex-col items-center mb-6">
              {verificationResult.passed ? (
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <Trophy className="h-10 w-10 text-yellow-400" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-orange-500/20 flex items-center justify-center mb-4">
                  <AlertCircle className="h-10 w-10 text-orange-400" />
                </div>
              )}
              
              <h3 className="text-xl font-bold mb-2">
                {verificationResult.passed
                  ? "Quiz Passed!"
                  : "Keep Learning"
                }
              </h3>
              
              <div className="text-center mb-4">
                <p className="text-2xl font-bold">
                  {correctAnswers} / {questions.length}
                </p>
                <p className="text-sm text-gray-400">
                  {verificationResult.passed
                    ? `Great job! You've earned ${verificationResult.reward} $TASK tokens.`
                    : `You need ${Math.ceil(questions.length * 0.6)} correct answers to pass.`
                  }
                </p>
              </div>
              
              {verificationResult.txHash && (
                <a 
                  href={`https://explorer.solana.com/tx/${verificationResult.txHash}?cluster=devnet`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-green-500 hover:underline mb-4"
                >
                  <ExternalLink className="h-3 w-3" />
                  View Transaction on Solana
                </a>
              )}
              
              {!verificationResult.passed && attemptNumber < 2 && (
                <div className="bg-brand-dark-lighter/50 rounded-md p-3 text-sm mb-4">
                  <p>
                    Don't worry! You have another attempt available. Review the material and try again.
                  </p>
                </div>
              )}
            </div>
            
            <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
              {!verificationResult.passed && attemptNumber < 2 ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => onOpenChange(false)}
                    className="w-full sm:w-auto"
                  >
                    Review Material
                  </Button>
                  <Button 
                    className="purple-gradient w-full sm:w-auto"
                    onClick={handleRetry}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                </>
              ) : (
                <Button 
                  className={verificationResult.passed 
                    ? "purple-gradient w-full" 
                    : "w-full"
                  }
                  variant={verificationResult.passed ? "default" : "outline"}
                  onClick={() => {
                    if (verificationResult.passed) {
                      onSuccess();
                    } else {
                      onFailure();
                    }
                    onOpenChange(false);
                  }}
                >
                  {verificationResult.passed ? "Claim Rewards" : "Close"}
                </Button>
              )}
            </DialogFooter>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default TaskQuiz;
