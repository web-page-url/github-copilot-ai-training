'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DatabaseService } from '@/lib/supabase';

interface UserInfo {
  name: string;
  email: string;
  mobile?: string;
}

export default function RegisterPage() {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    mobile: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<UserInfo>>({});
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: Partial<UserInfo> = {};
    
    if (!userInfo.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!userInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (userInfo.mobile && !/^[\+]?[1-9][\d]{0,15}$/.test(userInfo.mobile.replace(/\s/g, ''))) {
      newErrors.mobile = 'Please enter a valid mobile number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Create user in database
      const userData = await DatabaseService.createUser({
        id: crypto.randomUUID(),
        name: userInfo.name.trim(),
        email: userInfo.email.trim(),
        created_at: new Date().toISOString(),
        last_active: new Date().toISOString()
      });
      
      // Store user info in localStorage for session management
      localStorage.setItem('learning_user_id', userData.id);
      localStorage.setItem('user_info', JSON.stringify({
        id: userData.id,
        name: userInfo.name.trim(),
        email: userInfo.email.trim(),
        mobile: userInfo.mobile?.trim() || null
      }));
      
      // Redirect to learning platform
      router.push('/learning');
      
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to register. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎓</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Join the Learning Platform
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Enter your details to start your personalized learning journey
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                value={userInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.name 
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                } text-gray-900 dark:text-white`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={userInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.email 
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                } text-gray-900 dark:text-white`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Mobile Field */}
            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mobile Number (Optional)
              </label>
              <input
                type="tel"
                id="mobile"
                value={userInfo.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.mobile 
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                } text-gray-900 dark:text-white`}
                placeholder="Enter your mobile number"
              />
              {errors.mobile && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.mobile}</p>
              )}
            </div>

            {/* Privacy Notice */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                🔒 Your information is secure and will only be used to personalize your learning experience 
                and provide you with individual progress tracking.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Your Profile...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span>🚀 Start Learning Journey</span>
                </div>
              )}
            </button>
          </form>

          {/* Alternative Actions */}
          <div className="mt-6 text-center space-y-4">
            <div className="flex items-center">
              <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
              <span className="px-4 text-sm text-gray-500 dark:text-gray-400">or</span>
              <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            
            <button
              onClick={() => router.push('/learning')}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
            >
              Continue as Guest (Limited Features)
            </button>
            
            <div className="mt-4">
              <a
                href="/"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm"
              >
                ← Back to Home
              </a>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🎯 What you get with registration:
          </h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              Personal progress tracking across all modules
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              Individual score dashboard with detailed analytics
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              Personalized certificates with your name
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              Learning history and achievements
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              Performance comparison with other learners
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 