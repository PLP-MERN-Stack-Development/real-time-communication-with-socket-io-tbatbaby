// Update src/contexts/AuthContext.jsx to wrap with SocketProvider
import { SocketProvider } from './SocketContext';

// In the return statement, wrap children with SocketProvider
return (
  <AuthContext.Provider value={value}>
    <SocketProvider>
      {children}
    </SocketProvider>
  </AuthContext.Provider>
);