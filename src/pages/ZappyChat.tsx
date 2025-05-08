import { useState, useRef, useEffect } from "react";
import { Loader, Send, Bot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MainLayout from "@/components/layout/MainLayout";
import { useWeb3 } from "@/contexts/Web3Context";
import { generateAIResponse } from "@/services/geminiAI";
import { saveChatMessage, getUserChatHistory, ChatMessage } from "@/services/firebase";
import { updateUserXP } from "@/services/firebase";
import { toast } from "sonner";

// Zappy's advanced 3D avatar URL
const ZAPPY_AVATAR_URL = "https://api.dicebear.com/7.x/bottts/svg?seed=zappy&backgroundColor=6366f1";

// Function to parse markdown-style formatting (* for bold)
const parseMessageContent = (content) => {
  if (!content) return '';
  
  // Split the content by bold markers (*)
  const parts = content.split(/(\*[^*]+\*)/g);
  
  return parts.map((part, index) => {
    // Check if this part is surrounded by asterisks (bold)
    if (part.startsWith('*') && part.endsWith('*')) {
      // Return the part without asterisks and wrapped in <strong>
      return <strong key={index}>{part.slice(1, -1)}</strong>;
    }
    // Return the regular text
    return part;
  });
};

const ZappyChat = () => {
  const { user } = useWeb3();
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedResponseText, setDisplayedResponseText] = useState("");
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [interactionCount, setInteractionCount] = useState(0);
  const [currentTypingMessage, setCurrentTypingMessage] = useState<ChatMessage | null>(null);
  
  // Typing animation effect
  useEffect(() => {
    if (!currentTypingMessage || !isTyping) return;
    
    let currentText = currentTypingMessage.content;
    let index = 0;
    
    const typingInterval = setInterval(() => {
      if (index < currentText.length) {
        setDisplayedResponseText(prev => prev + currentText.charAt(index));
        index++;
      } else {
        clearInterval(typingInterval);
        // Only add the message to the messages array after typing is complete
        setMessages(prev => [...prev, currentTypingMessage]);
        setIsTyping(false);
        setCurrentTypingMessage(null);
        setDisplayedResponseText("");
      }
    }, 15); // typing speed
    
    return () => clearInterval(typingInterval);
  }, [currentTypingMessage, isTyping]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, displayedResponseText]);
  
  // Load chat history on first render
  useEffect(() => {
    const loadChatHistory = async () => {
      if (user?.id) {
        setIsLoading(true);
        try {
          const history = await getUserChatHistory(user.id);
          
          if (history.length === 0) {
            // Add welcome message if no chat history
            const welcomeMessage: ChatMessage = {
              userId: user.id,
              sender: "zappy",
              content: "Hello! I'm Zappy, your TASK-fi AI assistant. I can help you learn about blockchain, get all details you require as a young founder who wants a defined path, TaskFi, $TASK tokens, and guide you through completing tasks to earn rewards. How can I help you today? 🤖✨",
              timestamp: new Date().toISOString()
            };
            
            await saveChatMessage(welcomeMessage);
            setMessages([welcomeMessage]);
          } else {
            setMessages(history);
          }
        } catch (error) {
          console.error("Error loading chat history:", error);
        } finally {
          setIsLoading(false);
          setIsFirstLoad(false);
        }
      }
    };
    
    if (isFirstLoad && user) {
      loadChatHistory();
    }
  }, [user, isFirstLoad]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Randomly reward active users
  const checkForRandomXP = async () => {
    const newCount = interactionCount + 1;
    setInteractionCount(newCount);
    
    // Random chance to reward XP (roughly 10% chance)
    if (user?.id && Math.random() < 0.1) {
      const xpAmount = Math.floor(Math.random() * 20) + 10; // Random XP between 10-30
      const result = await updateUserXP(user.id, xpAmount);
      
      if (result.success) {
        toast.success(`You earned ${xpAmount} bonus XP for being active!`, {
          description: "Keep chatting with Zappy to learn more."
        });
        
        // Check if user leveled up
        if (result.newLevel > result.oldLevel) {
          // Show level up message in chat
          const levelUpMessage: ChatMessage = {
            userId: user.id,
            sender: "zappy",
            content: `🎉 Congratulations! You've reached Level ${result.newLevel}! Keep going to unlock more features and rewards.`,
            timestamp: new Date().toISOString()
          };
          
          await saveChatMessage(levelUpMessage);
          setMessages(prev => [...prev, levelUpMessage]);
        }
      }
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !user) return;
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      userId: user.id,
      sender: "user",
      content: inputMessage,
      timestamp: new Date().toISOString()
    };
    
    // Save to state and clear input
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    
    try {
      // Save user message to Firebase
      await saveChatMessage(userMessage);
      
      // Increment interaction count and check for random XP
      await checkForRandomXP();
      
      // Get AI response
      const aiResponseText = await generateAIResponse(inputMessage);
      
      // Create AI message object
      const aiMessage: ChatMessage = {
        userId: user.id,
        sender: "zappy",
        content: aiResponseText,
        timestamp: new Date().toISOString()
      };
      
      // Save to Firebase but don't add to messages array yet
      await saveChatMessage(aiMessage);
      
      // Set current typing message and trigger typing animation
      setCurrentTypingMessage(aiMessage);
      setIsTyping(true);
      
    } catch (error) {
      console.error("Error processing message:", error);
      
      // Fallback response if AI fails
      const fallbackMessage: ChatMessage = {
        userId: user.id,
        sender: "zappy",
        content: "I'm having trouble processing your request right now. Please try again in a moment. If you were asking about TaskFi or $TASK tokens, I'd be happy to help once my connection is restored! 🔄",
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
      await saveChatMessage(fallbackMessage);
      
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <MainLayout>
      <div className="container px-4 mx-auto max-w-4xl py-6">
        <div className="flex flex-col bg-black/20 backdrop-blur-sm border border-brand-purple/20 rounded-lg shadow-lg overflow-hidden h-[75vh] md:h-[80vh]">
          <div className="p-4 bg-brand-dark-lighter border-b border-brand-purple/20 flex items-center space-x-3">
            <Avatar className="h-10 w-10 border-2 border-brand-purple/30">
              <AvatarImage src={ZAPPY_AVATAR_URL} />
              <AvatarFallback className="bg-brand-purple/30">
                <Bot className="h-6 w-6 text-white" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-bold text-lg">Zappy AI</h2>
              <p className="text-sm text-gray-400">Your TASK-fi Assistant</p>
            </div>
          </div>
          
          {/* Chat messages container */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <Avatar className={`h-8 w-8 ${message.sender === "user" ? "ml-2" : "mr-2"}`}>
                    {message.sender === "user" ? (
                      <>
                        <AvatarImage src={user?.avatarUrl} />
                        <AvatarFallback className="bg-brand-dark-lighter text-white">
                          {user?.username?.charAt(0) || user?.address?.slice(0, 2)}
                        </AvatarFallback>
                      </>
                    ) : (
                      <>
                        <AvatarImage src={ZAPPY_AVATAR_URL} />
                        <AvatarFallback className="bg-brand-purple/30">Z</AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  <div 
                    className={`py-2 px-4 rounded-lg ${
                      message.sender === "user" 
                        ? "bg-brand-purple/80 text-white" 
                        : "bg-brand-dark-lighter/70 border border-brand-purple/20"
                    }`}
                  >
                    {/* Apply parseMessageContent to render bold text */}
                    <p className="whitespace-pre-wrap">{parseMessageContent(message.content)}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing animation with markdown parsing */}
            {isTyping && currentTypingMessage && (
              <div className="flex justify-start">
                <div className="flex max-w-[80%] flex-row">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={ZAPPY_AVATAR_URL} />
                    <AvatarFallback className="bg-brand-purple/30">Z</AvatarFallback>
                  </Avatar>
                  <div className="py-2 px-4 rounded-lg bg-brand-dark-lighter/70 border border-brand-purple/20">
                    <p className="whitespace-pre-wrap">{parseMessageContent(displayedResponseText)}<span className="animate-pulse">▋</span></p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(currentTypingMessage.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Loading indicator */}
            {isLoading && !isTyping && (
              <div className="flex justify-center items-center py-2">
                <Loader className="h-5 w-5 animate-spin text-brand-purple" />
                <span className="ml-2 text-sm text-gray-400">Zappy is thinking...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <div className="p-3 border-t border-brand-purple/20 bg-black/30">
            <div className="flex items-center space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask Zappy about TaskFi, $TASK tokens, or productivity..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                onClick={sendMessage} 
                disabled={isLoading || !inputMessage.trim()} 
                className="purple-gradient"
              >
                {isLoading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ZappyChat;