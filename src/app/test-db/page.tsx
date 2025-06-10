'use client';

import { useState, useEffect } from 'react';
import { SectionDatabaseService } from '@/lib/section-database-service';

export default function TestDatabasePage() {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'failed'>('checking');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [envVars, setEnvVars] = useState<{
    supabaseUrl: boolean;
    supabaseKey: boolean;
  }>({ supabaseUrl: false, supabaseKey: false });

  useEffect(() => {
    testConnection();
    checkEnvironmentVariables();
  }, []);

  const checkEnvironmentVariables = () => {
    setEnvVars({
      supabaseUrl: !!(process.env.NEXT_PUBLIC_SUPABASE_URL),
      supabaseKey: !!(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    });
  };

  const testConnection = async () => {
    console.log('🧪 Starting database connection test...');
    
    try {
      // Check if database service is available
      const isAvailable = SectionDatabaseService.isDatabaseAvailable();
      console.log('📋 Database service available:', isAvailable);
      
      if (!isAvailable) {
        setConnectionStatus('failed');
        setErrorMessage('Database service not available. Missing environment variables.');
        return;
      }

      // Test actual connection
      const isConnected = await SectionDatabaseService.testDatabaseConnection();
      
      if (isConnected) {
        setConnectionStatus('connected');
        setErrorMessage('');
        
        // Try to initialize sections and test user creation
        console.log('🔧 Testing database operations...');
        const sectionsInitialized = await SectionDatabaseService.initializeSections();
        console.log('📚 Sections initialized:', sectionsInitialized);
        
        const userEnsured = await SectionDatabaseService.ensureUserExists(
          'test-user-id',
          'Test User',
          'test@example.com'
        );
        console.log('👤 Test user ensured:', userEnsured);
        
      } else {
        setConnectionStatus('failed');
        setErrorMessage('Database connection test failed. Check console for details.');
      }
    } catch (error) {
      console.error('❌ Connection test error:', error);
      setConnectionStatus('failed');
      setErrorMessage(`Connection test error: ${error}`);
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'checking': return '🔄';
      case 'connected': return '✅';
      case 'failed': return '❌';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'checking': return 'Checking connection...';
      case 'connected': return 'Database Connected!';
      case 'failed': return 'Connection Failed';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">🗄️ Database Connection Test</h1>
        
        {/* Connection Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{getStatusIcon()}</span>
            <span className={`text-lg font-medium ${
              connectionStatus === 'connected' ? 'text-green-600' : 
              connectionStatus === 'failed' ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {getStatusText()}
            </span>
          </div>
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Environment Variables Check */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className={envVars.supabaseUrl ? '✅' : '❌'}></span>
              <span>NEXT_PUBLIC_SUPABASE_URL</span>
              <span className={`text-sm px-2 py-1 rounded ${
                envVars.supabaseUrl ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {envVars.supabaseUrl ? 'Set' : 'Missing'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className={envVars.supabaseKey ? '✅' : '❌'}></span>
              <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
              <span className={`text-sm px-2 py-1 rounded ${
                envVars.supabaseKey ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {envVars.supabaseKey ? 'Set' : 'Missing'}
              </span>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📖 Setup Instructions</h2>
          <div className="prose max-w-none">
            <p className="mb-4">If you see connection failures, follow these steps:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                <strong>Create Supabase Project:</strong> Go to{' '}
                <a 
                  href="https://supabase.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  supabase.com
                </a>{' '}
                and create a free account + project
              </li>
              <li>
                <strong>Get Credentials:</strong> Go to Settings → API in your Supabase dashboard
              </li>
              <li>
                <strong>Create .env.local:</strong> Create a file in your project root with:
                <pre className="bg-gray-100 p-3 rounded mt-2 text-sm">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
                </pre>
              </li>
              <li>
                <strong>Restart Dev Server:</strong> Stop (Ctrl+C) and restart <code>npm run dev</code>
              </li>
              <li>
                <strong>See Full Instructions:</strong> Check <code>DATABASE_SETUP.md</code> in your project
              </li>
            </ol>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">🔧 Actions</h2>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={testConnection}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              🔄 Retest Connection
            </button>
            <button
              onClick={async () => {
                console.log('🔄 Updating section titles...');
                const success = await SectionDatabaseService.updateSectionTitles();
                if (success) {
                  alert('✅ Section titles updated to GitHub Copilot topics!');
                  testConnection(); // Refresh the test
                } else {
                  alert('❌ Failed to update section titles. Check console for details.');
                }
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
            >
              🚀 Update Section Titles
            </button>
            <button
              onClick={() => window.open('https://supabase.com', '_blank')}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              🚀 Create Supabase Project
            </button>
          </div>
        </div>

        {/* Console Logs Notice */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <span className="text-yellow-600">💡</span>
            <div>
              <p className="text-yellow-800 font-medium">Check Browser Console</p>
              <p className="text-yellow-700 text-sm">
                Open Developer Tools (F12) → Console tab to see detailed debugging information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 