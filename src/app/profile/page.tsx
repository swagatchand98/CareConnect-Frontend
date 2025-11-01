'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import EnhancedHeader from '@/components/layout/EnhancedHeader';
import Footer from '@/components/layout/Footer';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
    
    // Initialize form data with user data
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: '',
        address: '',
        bio: '',
      });
    }
  }, [isLoading, isAuthenticated, router, user]);

  // Show loading state
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the user profile
    console.log('Profile updated:', formData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <EnhancedHeader user={user} />
      
      <main className="flex-grow py-6 sm:py-10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">My Profile</h1>
            
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6 gap-4 sm:gap-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl sm:text-4xl text-gray-600 font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-semibold">{user.name}</h2>
                  <p className="text-sm sm:text-base text-gray-600">{user.email}</p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                  
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={true} // Email cannot be changed
                    required
                  />
                  
                  <Input
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  
                  <Input
                    label="Address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  
                  <div className="mb-4">
                    <label 
                      htmlFor="bio" 
                      className="block text-sm font-medium mb-1"
                    >
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                      value={formData.bio}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3 sm:gap-0">
                  {isEditing ? (
                    <>
                      <Button 
                        type="button" 
                        variant="secondary" 
                        className="w-full sm:w-auto sm:mr-4 order-2 sm:order-1"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="w-full sm:w-auto order-1 sm:order-2">
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button 
                      type="button" 
                      onClick={() => setIsEditing(true)}
                      className="w-full sm:w-auto"
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </form>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Account Settings</h2>
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b gap-3 sm:gap-0">
                  <div className="flex-1">
                    <h3 className="font-medium text-sm sm:text-base">Change Password</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Update your password for security</p>
                  </div>
                  <Button variant="secondary" className="w-full sm:w-auto text-sm">
                    Change
                  </Button>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b gap-3 sm:gap-0">
                  <div className="flex-1">
                    <h3 className="font-medium text-sm sm:text-base">Notification Settings</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Manage your email and push notifications</p>
                  </div>
                  <Button variant="secondary" className="w-full sm:w-auto text-sm">
                    Manage
                  </Button>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 gap-3 sm:gap-0">
                  <div className="flex-1">
                    <h3 className="font-medium text-red-600 text-sm sm:text-base">Delete Account</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="secondary" className="text-red-600 w-full sm:w-auto text-sm">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
