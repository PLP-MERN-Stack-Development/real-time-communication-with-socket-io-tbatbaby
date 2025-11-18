import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Users, Zap, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Real-time Messaging',
      description: 'Instant message delivery with Socket.io technology'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Online Users',
      description: 'See who\'s online and available to chat'
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'Group & Private Chats',
      description: 'Chat in global rooms or private conversations'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure & Private',
      description: 'Your conversations are encrypted and secure'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-8 h-8 text-white" />
              <span className="text-xl font-bold text-white">ChatApp</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-white">Welcome, {user?.username}!</span>
                  <Link to="/chat">
                    <Button variant="primary">Go to Chat</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="text-white hover:bg-white/20">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="primary">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Real-Time Chat
            <span className="block text-blue-200">For Everyone</span>
          </h1>
          
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Experience seamless real-time communication with our modern chat application. 
            Connect with friends, collaborate with teams, and chat instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            {isAuthenticated ? (
              <Link to="/chat">
                <Button size="large" variant="primary" className="bg-white text-blue-600 hover:bg-blue-50">
                  Enter Chat Room
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="large" variant="primary" className="bg-white text-blue-600 hover:bg-blue-50">
                  Start Chatting Now
                </Button>
              </Link>
            )}
            
            <Button size="large" variant="ghost" className="text-white border-white hover:bg-white/20">
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto mb-20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">1000+</div>
              <div className="text-blue-200">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50K+</div>
              <div className="text-blue-200">Messages Daily</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">99.9%</div>
              <div className="text-blue-200">Uptime</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center text-white border border-white/20 hover-lift"
            >
              <div className="flex justify-center mb-4 text-blue-200">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-blue-100 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Chatting?
          </h2>
          <p className="text-blue-100 mb-8">
            Join thousands of users already connected on our platform
          </p>
          <Link to={isAuthenticated ? "/chat" : "/login"}>
            <Button size="large" variant="primary" className="bg-white text-blue-600 hover:bg-blue-50">
              {isAuthenticated ? 'Open Chat' : 'Create Account'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/5 backdrop-blur-md border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-blue-200">
            Built with ❤️ using React, Node.js, and Socket.io
          </p>
          <p className="text-blue-300 text-sm mt-2">
            © 2024 ChatApp. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;