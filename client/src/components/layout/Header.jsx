import React, { useState } from 'react';
import { LogOut, Settings, User, Bell, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Avatar from '../ui/Avatar';
import Dropdown from '../ui/Dropdown';
import Input from '../ui/Input';

const Header = ({ onSearch, showSearch = true }) => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const userDropdownItems = [
    {
      label: 'Profile',
      onClick: () => console.log('Go to profile'),
      icon: <User size={16} />
    },
    {
      label: 'Settings',
      onClick: () => console.log('Open settings'),
      icon: <Settings size={16} />
    },
    {
      type: 'divider'
    },
    {
      label: 'Logout',
      onClick: logout,
      icon: <LogOut size={16} />,
      className: 'text-red-600 hover:text-red-700'
    }
  ];

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        {showSearch && (
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Search messages, users..."
              value={searchQuery}
              onChange={handleSearch}
              icon={<Search size={18} />}
              className="pl-10"
            />
          </div>
        )}

        {/* User Menu */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Notifications */}
          <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Dropdown */}
          <Dropdown items={userDropdownItems} position="right">
            <button className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Avatar user={user} size="sm" showStatus={true} />
              <div className="text-left hidden sm:block">
                <div className="text-sm font-medium text-gray-900">
                  {user?.username}
                </div>
                <div className="text-xs text-gray-500">
                  {user?.email}
                </div>
              </div>
            </button>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default Header;