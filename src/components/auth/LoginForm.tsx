'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

const LoginForm: React.FC = () => {
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
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
      email?: string;
      password?: string;
      general?: string;
    } = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Handle login logic
    setIsSubmitting(true);
    try {
      const userData = await login(formData.email, formData.password);
      
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
      console.error('Login error:', error);
      
      // Handle specific Firebase error codes
      const firebaseError = error as { code?: string; message?: string };
      if (firebaseError.code) {
        switch (firebaseError.code) {
          case 'auth/invalid-email':
            setErrors({ email: 'Invalid email format' });
            break;
          case 'auth/user-disabled':
            setErrors({ general: 'This account has been disabled' });
            break;
          case 'auth/user-not-found':
            setErrors({ email: 'No account found with this email' });
            break;
          case 'auth/wrong-password':
            setErrors({ password: 'Incorrect password' });
            break;
          case 'auth/too-many-requests':
            setErrors({ general: 'Too many failed login attempts. Please try again later.' });
            break;
          default:
            setErrors({ general: firebaseError.message || 'Failed to login. Please try again.' });
        }
      } else {
        setErrors({
          general: (error as Error).message || 'Failed to login. Please check your credentials and try again.'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
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
      console.error('Google sign-in error:', error);
      setErrors({
        general: (error as Error).message || 'Failed to login with Google. Please try again.'
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
          <source src="/videos/loginVdo.mp4" type="video/mp4" />
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
                Welcome back to
                <span className="block font-medium text-blue-300">compassionate care</span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed mb-8">
                Continue your journey of providing and receiving care that feels like family.
              </p>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 text-sm text-blue-200">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Secure Login</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Trusted Platform</span>
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
      
      {/* Right side - Login Form */}
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
              Welcome <span className="font-medium text-blue-600">back</span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">
              Sign in to continue your caregiving journey
            </p>
          </motion.div>
          
          {/* Login Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-4">
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
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                className="w-full"
              />
            </div>
            
            <div className="flex justify-end">
              <Link 
                href="/auth/reset-password" 
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Forgot your password?
              </Link>
            </div>
            
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
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
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
                onClick={handleGoogleSignIn}
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
                    const imgElement = e.target as HTMLImageElement;
                    imgElement.onerror = null;
                    imgElement.src = 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg';
                  }}
                />
                Sign in with Google
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
              Don&apos;t have an account?{' '}
              <Link 
                href="/auth/register" 
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Create account
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

export default LoginForm;
