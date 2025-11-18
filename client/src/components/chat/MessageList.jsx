import React, { useEffect, useRef } from 'react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

const MessageList = ({ messages, currentUser, typingUsers }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  const shouldShowAvatar = (message, index) => {
    if (index === 0) return true;
    
    const prevMessage = messages[index - 1];
    return (
      prevMessage.sender._id !== message.sender._id ||
      new Date(message.createdAt) - new Date(prevMessage.createdAt) > 300000 // 5 minutes
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-1">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">Start a conversation by sending a message!</p>
          </div>
        </div>
      ) : (
        messages.map((message, index) => (
          <Message
            key={message._id}
            message={message}
            isOwn={message.sender._id === currentUser._id}
            showAvatar={shouldShowAvatar(message, index)}
          />
        ))
      )}
      
      <TypingIndicator typingUsers={typingUsers} currentUser={currentUser} />
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;