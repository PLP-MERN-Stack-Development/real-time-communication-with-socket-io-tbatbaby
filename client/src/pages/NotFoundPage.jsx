import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center px-4">
      <div className="text-center text-white">
        {/* 404 Graphic */}
        <div className="mb-8">
          <div className="text-9xl font-bold mb-4">404</div>
          <div className="w-48 h-48 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
            <div className="text-6xl">🔍</div>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-xl text-blue-100 mb-8 max-w-md">
          Oops! The page you're looking for seems to have wandered off into the digital void.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/">
            <Button
              variant="primary"
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <Home size={18} className="mr-2" />
              Go Home
            </Button>
          </Link>
          
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="text-white border-white hover:bg-white/20"
          >
            <ArrowLeft size={18} className="mr-2" />
            Go Back
          </Button>
        </div>

        {/* Fun Facts */}
        <div className="mt-12 p-6 bg-white/10 backdrop-blur-md rounded-2xl max-w-md mx-auto">
          <h3 className="font-semibold mb-2">Did you know?</h3>
          <p className="text-blue-100 text-sm">
            The average person spends 6 months of their lifetime waiting for red lights to turn green. 
            Hopefully you won't have to wait that long here!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;