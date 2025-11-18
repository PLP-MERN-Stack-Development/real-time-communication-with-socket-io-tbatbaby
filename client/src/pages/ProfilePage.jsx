import React, { useState } from 'react';
import { Save, Camera, Mail, Calendar, Edit } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import Header from '../components/layout/Header';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import { usersAPI } from '../utils/api';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    avatar: user?.avatar || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await usersAPI.updateProfile(formData);
      if (response.data.success) {
        updateUser(response.data.data.user);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      avatar: user?.avatar || ''
    });
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <Header showSearch={false} />
        
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
              
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="primary"
                >
                  <Edit size={16} className="mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleCancel}
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    variant="primary"
                    loading={loading}
                  >
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>

            {/* Profile Content */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Avatar Section */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <Avatar user={user} size="xl" showStatus={true} />
                  
                  {isEditing && (
                    <button className="
                      absolute bottom-2 right-2
                      bg-blue-500 text-white p-2 rounded-full
                      hover:bg-blue-600 transition-colors
                      shadow-lg
                    ">
                      <Camera size={16} />
                    </button>
                  )}
                </div>

                {/* Stats */}
                <div className="mt-6 space-y-3">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">1.2K</div>
                    <div className="text-sm text-gray-500">Messages</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">156</div>
                    <div className="text-sm text-gray-500">Friends</div>
                  </div>
                </div>
              </div>

              {/* Info Section */}
              <div className="flex-1 space-y-6">
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter your username"
                      required
                    />

                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />

                    <Input
                      label="Avatar URL"
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleChange}
                      placeholder="Enter avatar URL"
                      helperText="Paste a direct image URL for your avatar"
                    />
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <div className="text-lg text-gray-900">{user?.username}</div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="flex items-center gap-2 text-lg text-gray-900">
                        <Mail size={18} className="text-gray-400" />
                        {user?.email}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Member Since
                      </label>
                      <div className="flex items-center gap-2 text-lg text-gray-900">
                        <Calendar size={18} className="text-gray-400" />
                        {formatDate(user?.createdAt)}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${user?.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className="text-lg text-gray-900">
                          {user?.isOnline ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      placeholder="Tell us about yourself..."
                      rows="4"
                      className="
                        w-full px-3 py-2 border border-gray-300 rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        resize-none
                      "
                    />
                  ) : (
                    <p className="text-gray-600">
                      {user?.bio || 'No bio yet. Tell us about yourself!'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Sections */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Activity Stats */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Messages</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rooms Joined</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Friends</span>
                  <span className="font-semibold">156</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium">Joined Global Chat</div>
                  <div className="text-gray-500">2 hours ago</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Created "Tech Talk" room</div>
                  <div className="text-gray-500">1 day ago</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Updated profile picture</div>
                  <div className="text-gray-500">3 days ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;