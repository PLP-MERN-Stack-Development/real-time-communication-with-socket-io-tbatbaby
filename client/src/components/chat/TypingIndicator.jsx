import React from 'react';
import Avatar from '../ui/Avatar';

const TypingIndicator = ({ typingUsers, currentUser }) => {
  if (typingUsers.length === 0) return null;

  // Filter out current user's typing indicator
  const otherTypingUsers = typingUsers.filter(
    user => user.userId !== currentUser._id
  );

  if (otherTypingUsers.length === 0) return null;

  return (
    <div className="flex items-center gap-3 mb-4">
      <Avatar user={otherTypingUsers[0]} size="sm" showStatus={false} />
      <div className="typing-indicator">
        <span className="text-sm text-gray-600">
          {otherTypingUsers.length === 1
            ? `${otherTypingUsers[0].username} is typing`
            : `${otherTypingUsers.length} people are typing`}
        </span>
        <div className="typing-dots">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;