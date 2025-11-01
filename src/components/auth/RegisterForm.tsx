'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '@/contexts/AuthContext';

const RegisterForm: React.FC = () => {
  const { register, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    const newErrors: {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      general?: string;
    } = {};
    
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Handle registration logic
    setIsSubmitting(true);
    try {
      // Combine first and last name for the register function
      const fullName = `${formData.firstName} ${formData.lastName}`;
      await register(fullName, formData.email, formData.password);
      
      // After registration, redirect to the user dashboard
      router.push('/dashboard/user');
    } catch (error: unknown) {
      console.error('Registration error:', error);
      
      // Type guard for Firebase error
      interface FirebaseError {
        code?: string;
        message?: string;
      }
      
      // Handle specific Firebase error codes
      const firebaseError = error as FirebaseError;
      
      if (firebaseError.code) {
        switch (firebaseError.code) {
          case 'auth/email-already-in-use':
            setErrors({ email: 'Email is already in use' });
            break;
          case 'auth/invalid-email':
            setErrors({ email: 'Invalid email format' });
            break;
          case 'auth/weak-password':
            setErrors({ password: 'Password is too weak' });
            break;
          case 'auth/operation-not-allowed':
            setErrors({ general: 'Registration is currently disabled' });
            break;
          default:
            setErrors({ general: firebaseError.message || 'Failed to register. Please try again.' });
        }
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setErrors({
          general: errorMessage || 'Failed to register. Please try again later.'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsSubmitting(true);
    try {
      const userData = await loginWithGoogle();
      
      // Ensure user role is properly set
      const userRole = userData.role || 'user';
      
      // Redirect based on user role
      if (userRole === 'admin') {
        router.push('/dashboard/admin');
      } else if (userRole === 'provider') {
        router.push('/dashboard/provider');
      } else {
        router.push('/dashboard/user');
      }
    } catch (error: unknown) {
      console.error('Google sign-up error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrors({
        general: errorMessage || 'Failed to register with Google. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* Left side - Hero Section with Video Background */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden rounded-br-3xl rounded-tr-3xl">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          onLoadedData={() => console.log("Video loaded successfully")}
          onError={(e) => console.error("Video error:", e)}
        >
          <source src="/videos/signupVdo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-indigo-900/80" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-8 lg:p-12 text-white">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-2xl font-light">
              Care<span className="font-medium">Connect</span>
            </span>
          </motion.div>
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-lg"
            >
              <h1 className="text-4xl lg:text-5xl font-light leading-tight mb-6">
                Join our
                <span className="block font-medium text-blue-300">caring community</span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed mb-8">
                Start your journey with personalized care solutions designed for your unique needs and lifestyle.
              </p>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 text-sm text-blue-200">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Secure Registration</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Instant Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Privacy Protected</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm text-blue-200/70"
          >
            Terms and Conditions Apply*
          </motion.div>
        </div>
      </div>
      
      {/* Right side - Registration Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:hidden flex items-center justify-center gap-3 mb-8"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-2xl font-light text-gray-900">
              Care<span className="font-medium text-blue-600">Connect</span>
            </span>
          </motion.div>
          
          {/* Form Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 text-center lg:text-left"
          >
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-3">
              Create your <span className="font-medium text-blue-600">account</span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">
              Join thousands of families who trust us with their care
            </p>
          </motion.div>
          
          {/* Registration Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                type="text"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                required
                className="w-full"
              />
              
              <Input
                label="Last Name"
                name="lastName"
                type="text"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                required
                className="w-full"
              />
            </div>
            
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              className="w-full"
            />
            
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              className="w-full"
            />
            
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
              className="w-full"
            />
            
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
              >
                {errors.general}
              </motion.div>
            )}
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                type="submit" 
                fullWidth
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 sm:py-4 text-base sm:text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
            </motion.div>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                type="button" 
                variant="google" 
                fullWidth
                onClick={handleGoogleSignUp}
                disabled={isSubmitting}
                className="border-2 border-gray-200 hover:border-gray-300 text-gray-700 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-full transition-all duration-300 hover:shadow-md"
              >
                <Image 
                  src="/icons/google.svg" 
                  alt="Google" 
                  width={24}
                  height={24}
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  onError={(e) => {
                    const imgElement = e.currentTarget as HTMLImageElement;
                    imgElement.src = 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg';
                  }}
                />
                Sign up with Google
              </Button>
            </motion.div>
          </motion.form>

          {/* Footer Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 space-y-4 text-center"
          >
            <p className="text-gray-600 text-sm sm:text-base">
              Already have an account?{' '}
              <Link 
                href="/auth/login" 
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
            
            <p className="text-gray-600 text-sm sm:text-base">
              Want to provide care services?{' '}
              <Link 
                href="/auth/register/provider" 
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Join as a caregiver
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
