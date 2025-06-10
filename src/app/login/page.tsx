'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DatabaseService, supabase } from '@/lib/supabase';

interface LoginForm {
  email: string;
  rememberMe: boolean;
}

export default function LoginPage() {
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    rememberMe: false
  });
  const [isLogging, setIsLogging] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginForm.email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLogging(true);
    setError('');
    
    try {
      // Try to find user by email in Supabase
      const { data: users, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('email', loginForm.email.trim().toLowerCase())
        .limit(1);

      if (dbError) {
        throw new Error('Database connection failed. Please try again.');
      }

      if (!users || users.length === 0) {
        setError('No account found with this email. Please register first.');
        return;
      }

      const user = users[0];

      // Update last_active timestamp
      await supabase
        .from('users')
        .update({ last_active: new Date().toISOString() })
        .eq('id', user.id);

      // Store user info in localStorage
      localStorage.setItem('learning_user_id', user.id);
      localStorage.setItem('user_info', JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile
      }));

      // Redirect to personal scores
      router.push('/my-scores');
      
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLogging(false);
    }
  };

  const handleInputChange = (field: keyof LoginForm, value: string | boolean) => {
    setLoginForm(prev => ({ ...prev, [field]: value }));
    if (error) {
      setError('');
    }
  };

  // Quick demo login (for testing)
  const handleDemoLogin = async () => {
    setIsLogging(true);
    try {
      // Get first available user for demo
      const { data: users } = await supabase
        .from('users')
        .select('*')
        .limit(1);

      if (users && users.length > 0) {
        const user = users[0];
        localStorage.setItem('learning_user_id', user.id);
        localStorage.setItem('user_info', JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          mobile: user.mobile
        }));
        router.push('/my-scores');
      } else {
        setError('No demo users available. Please register first.');
      }
    } catch (error) {
      setError('Demo login failed. Please try manual login.');
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Sign in to access your personal learning dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={loginForm.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  error 
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                } text-gray-900 dark:text-white`}
                placeholder="Enter your registered email"
                disabled={isLogging}
              />
              {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={loginForm.rememberMe}
                onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                disabled={isLogging}
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                Keep me signed in
              </label>
            </div>

            {/* Login Info */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>📧 Email-based login:</strong> Enter the email you used during registration. 
                No password required - we'll verify your account and log you in securely.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLogging}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {isLogging ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing you in...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span>🔓 Sign In to Dashboard</span>
                </div>
              )}
            </button>
          </form>

          {/* Alternative Actions */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center">
              <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
              <span className="px-4 text-sm text-gray-500 dark:text-gray-400">or</span>
              <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            
            {/* Demo Login */}
            <button
              onClick={handleDemoLogin}
              disabled={isLogging}
              className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
            >
              🚀 Try Demo Login
            </button>
            
            {/* Register Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <a
                  href="/register"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                  Register now
                </a>
              </p>
            </div>
            
            <div className="text-center">
              <a
                href="/"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm"
              >
                ← Back to Home
              </a>
            </div>
          </div>
        </div>

        {/* Login Benefits */}
        <div className="mt-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🎯 Access Your Learning Dashboard:
          </h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">📊</span>
              View your personal progress and scores
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">🏆</span>
              Track achievements and learning milestones
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">📈</span>
              See detailed performance analytics
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">🎓</span>
              Access your certificates and completion history
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">⚡</span>
              Resume learning from where you left off
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            🔒 Your data is secure. We use email-based authentication with encrypted storage.
          </p>
        </div>
      </div>
    </div>
  );
} 