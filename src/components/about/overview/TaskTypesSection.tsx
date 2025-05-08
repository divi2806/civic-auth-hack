
import { BookOpen, ChevronRight, Code, PlayCircle } from "lucide-react";

const TaskTypesSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 hero-gradient">Task Types</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            InsightQuest supports various learning activities to help you build diverse skills
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="glass-card rounded-lg p-6 card-hover">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
              <Code className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">LeetCode Problems</h3>
            <p className="text-gray-400 mb-4">
              Sharpen your algorithm and data structure skills by completing coding challenges on LeetCode.
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <ChevronRight className="h-4 w-4 text-brand-purple" />
                <span>Automatic verification through LeetCode API</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <ChevronRight className="h-4 w-4 text-brand-purple" />
                <span>Track problems solved over time</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <ChevronRight className="h-4 w-4 text-brand-purple" />
                <span>Earn rewards based on problem difficulty</span>
              </li>
            </ul>
          </div>
          
          <div className="glass-card rounded-lg p-6 card-hover">
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Online Courses</h3>
            <p className="text-gray-400 mb-4">
              Complete courses on platforms like Coursera, Udemy, and edX to gain comprehensive knowledge.
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <ChevronRight className="h-4 w-4 text-brand-purple" />
                <span>Verification through course completion certificates</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <ChevronRight className="h-4 w-4 text-brand-purple" />
                <span>Knowledge verification through quizzes</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <ChevronRight className="h-4 w-4 text-brand-purple" />
                <span>Higher rewards for accredited courses</span>
              </li>
            </ul>
          </div>
          
          <div className="glass-card rounded-lg p-6 card-hover">
            <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center mb-4">
              <PlayCircle className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Educational Videos</h3>
            <p className="text-gray-400 mb-4">
              Watch curated videos on topics like productivity, finance, technology, and personal growth.
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <ChevronRight className="h-4 w-4 text-brand-purple" />
                <span>Verification through comprehension questions</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <ChevronRight className="h-4 w-4 text-brand-purple" />
                <span>Short summaries to demonstrate understanding</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <ChevronRight className="h-4 w-4 text-brand-purple" />
                <span>Quick rewards for bite-sized learning</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TaskTypesSection;
