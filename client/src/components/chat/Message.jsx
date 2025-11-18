import React from 'react';
import { formatMessageTime } from '../../utils/helpers';
import Avatar from '../ui/Avatar';

const Message = ({ message, isOwn, showAvatar = true }) => {
  return (
    <div className={`flex gap-3 mb-4 ${isOwn ? 'flex-row-reverse' : ''}`}>
      {showAvatar && !isOwn && (
        <Avatar user={message.sender} size="sm" showStatus={false} />
      )}
      
      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
        {!isOwn && showAvatar && (
          <span className="text-sm text-gray-600 mb-1 ml-1">
            {message.sender?.username}
          </span>
        )}
        
        <div
          className={`
            message-bubble ${isOwn ? 'own' : 'other'}
            fade-in
          `.trim()}
        >
          <p className="text-sm">{message.content}</p>
          <div
            className={`message-time ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}
          >
            {formatMessageTime(message.createdAt)}
          </div>
        </div>
      </div>
      
      {showAvatar && isOwn && (
        <Avatar user={message.sender} size="sm" showStatus={false} />
      )}
    </div>
  );
};

export default Message;