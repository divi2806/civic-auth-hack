import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { AlertCircle, Link as LinkIcon, Youtube, Code } from 'lucide-react';
import { Task } from '@/types';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'userId' | 'status' | 'dateCreated'>) => void;
  loading?: boolean;
}

const taskSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  type: z.enum(['leetcode', 'course', 'video']),
  reward: z.coerce.number().min(1, { message: 'Reward must be at least 1 token' }),
  xpReward: z.coerce.number().min(10, { message: 'XP reward must be at least 10' }),
  url: z.string().url({ message: 'Please enter a valid URL' }),
  platformId: z.string().optional(),
});

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, loading = false }) => {
  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'leetcode',
      reward: 10,
      xpReward: 100,
      url: '',
      platformId: '',
    },
  });
  
  const taskType = form.watch('type');
  
  const [urlPlaceholder, setUrlPlaceholder] = useState('https://leetcode.com/problems/problem-name/');
  const [urlLabel, setUrlLabel] = useState('LeetCode URL');
  const [showPlatformId, setShowPlatformId] = useState(true);
  const [platformIdLabel, setPlatformIdLabel] = useState('LeetCode Problem ID');
  const [platformIdPlaceholder, setPlatformIdPlaceholder] = useState('e.g. 217');
  const [platformIdIcon, setPlatformIdIcon] = useState(<Code className="h-4 w-4" />);
  
  useEffect(() => {
    switch (taskType) {
      case 'leetcode':
        setUrlLabel('LeetCode URL');
        setUrlPlaceholder('https://leetcode.com/problems/problem-name/');
        setShowPlatformId(true);
        setPlatformIdLabel('LeetCode Problem ID');
        setPlatformIdPlaceholder('e.g. 217');
        setPlatformIdIcon(<Code className="h-4 w-4" />);
        break;
      case 'course':
        setUrlLabel('Course URL');
        setUrlPlaceholder('https://www.coursera.org/learn/course-name');
        setShowPlatformId(true);
        setPlatformIdLabel('Course Module/Section');
        setPlatformIdPlaceholder('e.g. Module 3');
        setPlatformIdIcon(<LinkIcon className="h-4 w-4" />);
        break;
      case 'video':
        setUrlLabel('Video URL');
        setUrlPlaceholder('https://www.youtube.com/watch?v=video-id');
        setShowPlatformId(false);
        break;
    }
  }, [taskType]);
  
  const handleSubmit = (data: z.infer<typeof taskSchema>) => {
    const taskData: Omit<Task, 'id' | 'userId' | 'status' | 'dateCreated'> = {
      title: data.title,
      description: data.description,
      type: data.type,
      reward: data.reward,
      xpReward: data.xpReward,
      url: data.url,
      platformId: data.platformId || undefined,
    };
    
    onSubmit(taskData);
    form.reset();
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="What will you learn from this task?" 
                  rows={3} 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select task type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="leetcode">
                      <div className="flex items-center">
                        <Code className="mr-2 h-4 w-4" />
                        <span>LeetCode Problem</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="course">
                      <div className="flex items-center">
                        <LinkIcon className="mr-2 h-4 w-4" />
                        <span>Course/Tutorial</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="video">
                      <div className="flex items-center">
                        <Youtube className="mr-2 h-4 w-4" />
                        <span>Educational Video</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="reward"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token Reward</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="xpReward"
            render={({ field }) => (
              <FormItem>
                <FormLabel>XP Reward</FormLabel>
                <FormControl>
                  <Input type="number" min={10} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{urlLabel}</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    {taskType === 'video' ? (
                      <Youtube className="h-4 w-4" />
                    ) : (
                      <LinkIcon className="h-4 w-4" />
                    )}
                  </span>
                  <Input className="pl-10" placeholder={urlPlaceholder} {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {showPlatformId && (
          <FormField
            control={form.control}
            name="platformId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{platformIdLabel}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      {platformIdIcon}
                    </span>
                    <Input className="pl-10" placeholder={platformIdPlaceholder} {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <div className="pt-2">
          <Button type="submit" className="purple-gradient w-full" disabled={loading}>
            {loading ? 'Creating Task...' : 'Create Task'}
          </Button>
        </div>
        
        <div className="text-xs text-gray-400 mt-2 flex items-center">
          <AlertCircle className="h-3 w-3 mr-1" />
          <span>You will need to verify the task completion to earn rewards</span>
        </div>
      </form>
    </Form>
  );
};

export default TaskForm;
