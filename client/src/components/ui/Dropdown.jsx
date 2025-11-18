import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ 
  children, 
  items = [], 
  position = "bottom",
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-0 top-0',
    right: 'left-0 top-0'
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)}>
        {children}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`
            absolute ${positionClasses[position]} z-50
            bg-white border border-gray-200 rounded-lg shadow-lg
            min-w-48 py-1
          `}
        >
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {item.type === 'divider' ? (
                <div className="my-1 border-t border-gray-100" />
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    item.onClick?.();
                    setIsOpen(false);
                  }}
                  disabled={item.disabled}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2 text-sm
                    transition-colors ${
                      item.disabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : `${
                            item.className || 
                            'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                          }`
                    }
                  `}
                >
                  {item.icon && (
                    <span className="flex-shrink-0">{item.icon}</span>
                  )}
                  <span className="flex-1 text-left">{item.label}</span>
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;