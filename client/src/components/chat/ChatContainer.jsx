import React from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatContainer = ({ 
  messages, 
  onSendMessage, 
  onTypingStart, 
  onTypingStop, 
  typingUsers, 
  currentUser 
}) => {
  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <MessageList
          messages={messages}
          currentUser={currentUser}
          typingUsers={typingUsers}
        />
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={onSendMessage}
        onTypingStart={onTypingStart}
        onTypingStop={onTypingStop}
      />
    </div>
  );
};

export default ChatContainer;