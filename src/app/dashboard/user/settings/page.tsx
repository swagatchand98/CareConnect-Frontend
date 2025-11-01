'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import EnhancedHeader from '@/components/layout/EnhancedHeader';
import Footer from '@/components/layout/Footer';
import Button from '@/components/common/Button';
import { TextField, Switch, FormControlLabel } from '@mui/material';

const UserSettingsPage: React.FC = () => {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    notificationPreferences: {
      email: true,
      sms: true,
      push: true
    },
    privacySettings: {
      shareProfileWithProviders: true,
      allowReviewsDisplay: true
    }
  });

  useEffect(() => {
    // Check if user is authenticated
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/dashboard/user/settings');
      return;
    }

    // Populate form with user data when available
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        notificationPreferences: {
          email: true,
          sms: true,
          push: true
        },
        privacySettings: {
          shareProfileWithProviders: true,
          allowReviewsDisplay: true
        }
      });
      setIsLoading(false);
    }
  }, [user, authLoading, router, isAuthenticated]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (setting: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [setting]: e.target.checked
      }
    }));
  };

  const handlePrivacyChange = (setting: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      privacySettings: {
        ...prev.privacySettings,
        [setting]: e.target.checked
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      // Use updateProfile from AuthContext
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber
      });
      
      setSuccessMessage('Settings updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user is not authenticated, show a message or redirect
  if (!isAuthenticated) {
    return null; // We'll redirect in the useEffect hook
  }
  
  // Ensure user is not null before rendering
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <EnhancedHeader user={user} />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="max-w-3xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Account Settings</h1>
              <p className="text-sm sm:text-base text-gray-600">Manage your account preferences and settings</p>
            </div>
            <Button 
              onClick={() => router.push('/dashboard/user')}
              variant="outline"
              className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base"
            >
              Back to Dashboard
            </Button>
          </div>
          
          {/* Settings Form */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            {successMessage && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm sm:text-base">
                {successMessage}
              </div>
            )}
            
            {errorMessage && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm sm:text-base">
                {errorMessage}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <TextField
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      size="small"
                    />
                  </div>
                  <div>
                    <TextField
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      size="small"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <TextField
                      label="Email"
                      name="email"
                      value={formData.email}
                      disabled
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      size="small"
                      helperText="Email cannot be changed"
                    />
                  </div>
                  <div>
                    <TextField
                      label="Phone Number"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      size="small"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Notification Preferences</h2>
                <div className="space-y-3 sm:space-y-4">
                  <div className="border-b border-gray-100 pb-3">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.notificationPreferences.email}
                          onChange={handleNotificationChange('email')}
                          color="primary"
                          size="small"
                        />
                      }
                      label={<span className="text-sm sm:text-base">Email Notifications</span>}
                    />
                    <p className="text-xs sm:text-sm text-gray-500 ml-0 sm:ml-9 mt-1">Receive booking updates and reminders via email</p>
                  </div>
                  
                  <div className="border-b border-gray-100 pb-3">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.notificationPreferences.sms}
                          onChange={handleNotificationChange('sms')}
                          color="primary"
                          size="small"
                        />
                      }
                      label={<span className="text-sm sm:text-base">SMS Notifications</span>}
                    />
                    <p className="text-xs sm:text-sm text-gray-500 ml-0 sm:ml-9 mt-1">Receive booking updates and reminders via text message</p>
                  </div>
                  
                  <div className="pb-3">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.notificationPreferences.push}
                          onChange={handleNotificationChange('push')}
                          color="primary"
                          size="small"
                        />
                      }
                      label={<span className="text-sm sm:text-base">Push Notifications</span>}
                    />
                    <p className="text-xs sm:text-sm text-gray-500 ml-0 sm:ml-9 mt-1">Receive push notifications on your device</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Privacy Settings</h2>
                <div className="space-y-3 sm:space-y-4">
                  <div className="border-b border-gray-100 pb-3">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.privacySettings.shareProfileWithProviders}
                          onChange={handlePrivacyChange('shareProfileWithProviders')}
                          color="primary"
                          size="small"
                        />
                      }
                      label={<span className="text-sm sm:text-base">Share Profile with Service Providers</span>}
                    />
                    <p className="text-xs sm:text-sm text-gray-500 ml-0 sm:ml-9 mt-1">Allow service providers to see your profile information</p>
                  </div>
                  
                  <div className="pb-3">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.privacySettings.allowReviewsDisplay}
                          onChange={handlePrivacyChange('allowReviewsDisplay')}
                          color="primary"
                          size="small"
                        />
                      }
                      label={<span className="text-sm sm:text-base">Display My Reviews Publicly</span>}
                    />
                    <p className="text-xs sm:text-sm text-gray-500 ml-0 sm:ml-9 mt-1">Allow your reviews to be displayed publicly on provider profiles</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 sm:mt-8 flex justify-center sm:justify-end">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="w-full sm:w-auto px-6 py-2 text-sm sm:text-base"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
          
          {/* Danger Zone */}
          <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow-sm p-4 sm:p-6 border-t-4 border-red-500">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-red-600">Danger Zone</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4">These actions are irreversible. Please proceed with caution.</p>
            
            <div className="flex flex-col gap-3 sm:gap-4">
              <Button
                variant="outline"
                className="w-full border-red-500 text-red-500 hover:bg-red-50 text-sm sm:text-base py-2.5"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete all your payment methods? This action cannot be undone.')) {
                    // Handle delete payment methods
                  }
                }}
              >
                Delete Payment Methods
              </Button>
              
              <Button
                variant="outline"
                className="w-full border-red-500 text-red-500 hover:bg-red-50 text-sm sm:text-base py-2.5"
                onClick={() => {
                  if (window.confirm('Are you sure you want to deactivate your account? You can reactivate it later by logging in.')) {
                    // Handle account deactivation
                  }
                }}
              >
                Deactivate Account
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserSettingsPage;
