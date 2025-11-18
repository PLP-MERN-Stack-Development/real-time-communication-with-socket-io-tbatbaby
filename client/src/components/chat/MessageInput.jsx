import React, { useState, useRef } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';
import Button from '../ui/Button';
import { debounce } from '../../utils/helpers';
import { validateMessage } from '../../utils/validation';

const MessageInput = ({ onSendMessage, onTypingStart, onTypingStop }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validation = validateMessage(message);
    if (!validation.isValid) {
      setError(validation.errors.content);
      return;
    }

    onSendMessage(message.trim());
    setMessage('');
    setError('');
    onTypingStop();
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);
    setError('');

    if (value.trim()) {
      onTypingStart();
      debouncedTypingStop();
    } else {
      onTypingStop();
    }
  };

  const debouncedTypingStop = useRef(
    debounce(() => {
      onTypingStop();
    }, 1000)
  ).current;

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      {error && (
        <div className="text-red-500 text-sm mb-2 p-2 bg-red-50 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 flex gap-2">
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Paperclip size={20} />
          </button>
          
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows="1"
              className="
                w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl 
                resize-none focus:outline-none focus:border-blue-500
                focus:ring-2 focus:ring-blue-200
                max-h-32
              "
            />
            
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 
                         text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Smile size={20} />
            </button>
          </div>
        </div>
        
        <Button
          type="submit"
          disabled={!message.trim()}
          className="self-end"
        >
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;