import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      {children}
    </div>
  );
};

export default Layout;