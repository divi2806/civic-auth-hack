
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark-darker">
      <div className="glass-card max-w-md w-full p-8 rounded-xl">
        <div className="text-center mb-6">
          <div className="w-24 h-24 rounded-full bg-brand-purple/10 flex items-center justify-center mb-4">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-purple-light">
              404
            </div>
          </div>
          <h1 className="text-xl font-bold mb-2">Page Not Found</h1>
          <p className="text-gray-400">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button variant="outline" className="w-full gap-2" asChild>
            <Link to="/">
              <Home className="h-4 w-4" />
              Return to Home
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            className="w-full gap-2" 
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
