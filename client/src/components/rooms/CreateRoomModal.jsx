import React, { useState } from 'react';
import { X, Users, Lock, Globe } from 'lucide-react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

const CreateRoomModal = ({ isOpen, onClose, onCreateRoom, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: false
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Room name is required';
    }
    if (formData.name.length > 50) {
      newErrors.name = 'Room name cannot exceed 50 characters';
    }
    if (formData.description.length > 200) {
      newErrors.description = 'Description cannot exceed 200 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onCreateRoom(formData);
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      isPrivate: false
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Room">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Room Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Enter room name"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter room description"
            rows="3"
            className="
              w-full px-3 py-2 border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              resize-none
            "
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        {/* Room Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Room Type
          </label>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, isPrivate: false }))}
              className={`
                p-3 border rounded-lg text-left transition-all
                ${!formData.isPrivate
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
                }
              `}
            >
              <Globe size={20} className="mb-2" />
              <div className="font-medium">Public</div>
              <div className="text-sm text-gray-600">Anyone can join</div>
            </button>

            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, isPrivate: true }))}
              className={`
                p-3 border rounded-lg text-left transition-all
                ${formData.isPrivate
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-300 hover:border-gray-400'
                }
              `}
            >
              <Lock size={20} className="mb-2" />
              <div className="font-medium">Private</div>
              <div className="text-sm text-gray-600">Invite only</div>
            </button>
          </div>
        </div>

        {/* Info Text */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            {formData.isPrivate 
              ? 'Private rooms are invite-only. You can add members after creation.'
              : 'Public rooms are visible to all users and anyone can join.'
            }
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
            className="flex-1"
          >
            Create Room
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateRoomModal;