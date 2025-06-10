'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sectionData } from '@/data/section-questions';
import { SectionDatabaseService } from '@/lib/section-database-service';

interface UserInfo {
  id: string;
  name: string;
  email: string;
  mobile?: string;
}

interface SectionCompletion {
  sectionNumber: number;
  sectionTitle: string;
  totalQuestions: number;
  questionsCorrect: number;
  score: number;
  accuracy: number;
  timeSpent: number;
  completedAt: string;
}

interface QuestionResponse {
  sectionNumber: number;
  questionId: string;
  answer: string;
  isCorrect: boolean;
  responseTime: number;
  timestamp: string;
}

interface OverallStats {
  totalSectionsCompleted: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  overallAccuracy: number;
  totalTimeSpent: number;
  averageSectionTime: number;
  bestAccuracy: number;
  currentStreak: number;
}

export default function MyScoresPage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [sectionCompletions, setSectionCompletions] = useState<SectionCompletion[]>([]);
  const [questionResponses, setQuestionResponses] = useState<QuestionResponse[]>([]);
  const [overallStats, setOverallStats] = useState<OverallStats>({
    totalSectionsCompleted: 0,
    totalQuestionsAnswered: 0,
    totalCorrectAnswers: 0,
    overallAccuracy: 0,
    totalTimeSpent: 0,
    averageSectionTime: 0,
    bestAccuracy: 0,
    currentStreak: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  useEffect(() => {
    loadUserData();
  }, []);

  // Force refresh data when tab changes to overview
  useEffect(() => {
    if (activeTab === 'overview' && userInfo) {
      loadSectionData();
    }
  }, [activeTab, userInfo]);

  const loadUserData = () => {
    try {
      setLoading(true);
      
      // Get user info from localStorage
      const storedUserInfo = localStorage.getItem('user_info');
      const userId = localStorage.getItem('learning_user_id');
      
      if (!storedUserInfo || !userId) {
        router.push('/register');
        return;
      }
      
      const userInfo = JSON.parse(storedUserInfo);
      setUserInfo(userInfo);
      
      // Load section completion data from localStorage
      loadSectionData();
      
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSectionData = () => {
    try {
      // Load completed sections
      const completedSections = JSON.parse(localStorage.getItem('completed_sections') || '[]') as SectionCompletion[];
      console.log('📊 Loaded completed sections:', completedSections);
      setSectionCompletions(completedSections);
      
      // Load individual question responses
      const questionProgress = JSON.parse(localStorage.getItem('section_progress') || '[]') as QuestionResponse[];
      console.log('📊 Loaded question responses:', questionProgress);
      setQuestionResponses(questionProgress);
      
      // Calculate and update overall statistics
      const calculatedStats = calculateOverallStats(completedSections, questionProgress);
      console.log('📊 Calculated overall stats:', calculatedStats);
      
    } catch (error) {
      console.error('Error loading section data:', error);
    }
  };

  const calculateOverallStats = (completions: SectionCompletion[], responses: QuestionResponse[]) => {
    const totalSections = completions.length;
    const totalQuestions = completions.reduce((sum, comp) => sum + comp.totalQuestions, 0);
    const totalCorrect = completions.reduce((sum, comp) => sum + comp.questionsCorrect, 0);
    const totalTime = completions.reduce((sum, comp) => sum + comp.timeSpent, 0);
    const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    const averageTime = totalSections > 0 ? Math.round(totalTime / totalSections) : 0;
    const bestAccuracy = completions.length > 0 ? Math.max(...completions.map(c => c.accuracy)) : 0;

    const newStats = {
      totalSectionsCompleted: totalSections,
      totalQuestionsAnswered: totalQuestions,
      totalCorrectAnswers: totalCorrect,
      overallAccuracy,
      totalTimeSpent: totalTime,
      averageSectionTime: averageTime,
      bestAccuracy,
      currentStreak: totalSections // Simple implementation - could be enhanced
    };

    // Update the state with calculated statistics
    setOverallStats(newStats);
    
    return newStats;
  };

  const generateCompleteCertificate = () => {
    const participantName = userInfo?.name || 'Learning Participant';
    const completionDate = new Date();
    const courseTitle = 'GitHub Copilot Master Course';
    
    const certificateHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>GitHub Copilot Master Certificate - ${participantName}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;500;600;700&display=swap');
          
          body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            min-height: 100vh;
            color: #2c3e50;
          }
          
          .certificate {
            background: white;
            max-width: 1000px;
            margin: 0 auto;
            padding: 80px;
            border-radius: 20px;
            box-shadow: 0 30px 60px rgba(0,0,0,0.2);
            border: 15px solid #f8f9fa;
            position: relative;
            overflow: hidden;
          }
          
          .certificate::before {
            content: '';
            position: absolute;
            top: 40px;
            left: 40px;
            right: 40px;
            bottom: 40px;
            border: 4px solid #e9ecef;
            border-radius: 12px;
            z-index: 1;
          }
          
          .certificate::after {
            content: '';
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            bottom: 20px;
            border: 2px solid #dee2e6;
            border-radius: 16px;
            z-index: 1;
          }
          
          .content {
            position: relative;
            z-index: 2;
          }
          
          .header {
            text-align: center;
            margin-bottom: 50px;
          }
          
          .master-badge {
            width: 120px;
            height: 120px;
            background: linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%);
            border-radius: 50%;
            margin: 0 auto 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            border: 8px solid #fff;
            box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
          }
          
          .title {
            font-family: 'Playfair Display', serif;
            font-size: 56px;
            color: #2c3e50;
            margin-bottom: 15px;
            font-weight: 900;
            letter-spacing: 2px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
          }
          
          .subtitle {
            font-size: 24px;
            color: #6c757d;
            margin-bottom: 20px;
            font-weight: 300;
          }
          
          .master-title {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 16px 32px;
            border-radius: 30px;
            font-weight: 700;
            font-size: 20px;
            margin-bottom: 40px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .certification-text {
            font-size: 26px;
            color: #495057;
            margin: 40px 0;
            line-height: 1.6;
          }
          
          .recipient {
            font-family: 'Playfair Display', serif;
            font-size: 52px;
            color: #3498db;
            margin: 40px 0;
            font-weight: 700;
            text-decoration: underline;
            text-decoration-color: #e9ecef;
            text-underline-offset: 12px;
            text-decoration-thickness: 4px;
          }
          
          .course-title {
            font-size: 32px;
            color: #2c3e50;
            margin: 30px 0;
            font-weight: 700;
            font-style: italic;
          }
          
          .mastery-statement {
            font-size: 20px;
            color: #495057;
            margin: 40px 0;
            text-align: center;
            line-height: 1.8;
            font-style: italic;
          }
          
          .achievement-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 30px;
            margin: 50px 0;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 40px;
            border-radius: 16px;
            border-left: 6px solid #667eea;
          }
          
          .achievement-item {
            text-align: center;
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          }
          
          .achievement-label {
            font-size: 14px;
            color: #6c757d;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
          }
          
          .achievement-value {
            font-size: 28px;
            color: #2c3e50;
            font-weight: 800;
            margin-bottom: 5px;
          }
          
          .achievement-icon {
            font-size: 20px;
            margin-bottom: 10px;
          }
          
          .skills-mastered {
            margin: 50px 0;
            text-align: center;
          }
          
          .skill-badge {
            display: inline-block;
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 12px 24px;
            margin: 10px;
            border-radius: 30px;
            font-size: 16px;
            font-weight: 600;
            box-shadow: 0 6px 12px rgba(0,0,0,0.1);
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .certification-statement {
            font-size: 20px;
            color: #495057;
            margin: 50px 0;
            text-align: center;
            line-height: 1.8;
            padding: 30px;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
            border-radius: 12px;
            border: 2px solid rgba(102, 126, 234, 0.1);
          }
          
          .signature-section {
            display: flex;
            justify-content: space-between;
            align-items: end;
            margin-top: 80px;
            padding-top: 40px;
            border-top: 3px solid #e9ecef;
          }
          
          .signature {
            text-align: center;
            width: 250px;
          }
          
          .signature-line {
            border-top: 3px solid #2c3e50;
            margin-bottom: 10px;
          }
          
          .signature-title {
            font-weight: 700;
            margin-bottom: 5px;
            color: #2c3e50;
            font-size: 16px;
          }
          
          .signature-subtitle {
            font-size: 12px;
            color: #6c757d;
          }
          
          .verification-section {
            text-align: center;
            flex-shrink: 0;
          }
          
          .master-seal {
            width: 140px;
            height: 140px;
            border: 5px solid #ffd700;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            color: #ffd700;
            font-weight: bold;
            margin: 0 auto 15px;
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%);
            position: relative;
          }
          
          .master-seal::before {
            content: 'MASTER';
            position: absolute;
            bottom: 20px;
            font-size: 10px;
            letter-spacing: 2px;
            font-weight: 800;
          }
          
          .seal-text {
            font-size: 12px;
            color: #6c757d;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
          }
          
          .certificate-id {
            position: absolute;
            bottom: 30px;
            right: 50px;
            font-size: 11px;
            color: #adb5bd;
            font-family: 'Courier New', monospace;
          }
          
          .github-badge {
            background: linear-gradient(135deg, #24292e 0%, #586069 100%);
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-size: 14px;
            margin: 20px auto;
            display: inline-block;
            font-weight: 600;
          }
          
          @media print {
            body { 
              background: white; 
              padding: 20px; 
            }
            .certificate { 
              box-shadow: none; 
              border: 2px solid #ddd; 
              margin: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="content">
            <div class="header">
              <div class="master-badge">🏆</div>
              <div class="title">MASTER CERTIFICATE</div>
              <div class="subtitle">GitHub Copilot Learning Platform</div>
              <div class="master-title">AI-Powered Development Mastery</div>
            </div>
            
            <div class="certification-text">
              This certifies that
            </div>
            
            <div class="recipient">${participantName}</div>
            
            <div class="certification-text">
              has successfully completed the comprehensive
            </div>
            
            <div class="course-title">${courseTitle}</div>
            
            <div class="mastery-statement">
              "Demonstrating exceptional proficiency in AI-assisted software development, modern coding practices, and GitHub Copilot mastery across all 6 specialized learning modules."
            </div>
            
            <div class="achievement-grid">
              <div class="achievement-item">
                <div class="achievement-icon">🎯</div>
                <div class="achievement-label">Overall Accuracy</div>
                <div class="achievement-value">${overallStats.overallAccuracy}%</div>
              </div>
              <div class="achievement-item">
                <div class="achievement-icon">📚</div>
                <div class="achievement-label">Sections Mastered</div>
                <div class="achievement-value">6/6</div>
              </div>
              <div class="achievement-item">
                <div class="achievement-icon">❓</div>
                <div class="achievement-label">Questions Answered</div>
                <div class="achievement-value">${overallStats.totalQuestionsAnswered}</div>
              </div>
              <div class="achievement-item">
                <div class="achievement-icon">⏱️</div>
                <div class="achievement-label">Study Time</div>
                <div class="achievement-value">${Math.floor(overallStats.totalTimeSpent / 60)}m</div>
              </div>
            </div>
            
            <div class="skills-mastered">
              <span class="skill-badge">🤖 GitHub Copilot Fundamentals</span>
              <span class="skill-badge">⚙️ Feature Mastery</span>
              <span class="skill-badge">💻 VS Code Integration</span>
              <span class="skill-badge">🔧 Framework Capabilities</span>
              <span class="skill-badge">🛡️ Responsible AI</span>
              <span class="skill-badge">🛠️ Practical Applications</span>
            </div>
            
            <div class="certification-statement">
              <strong>This Master Certificate</strong> validates comprehensive understanding and practical application of GitHub Copilot across all learning domains. The recipient has demonstrated expertise in AI-assisted development, ethical AI practices, and modern software engineering workflows. This certification represents dedication to continuous learning and mastery of cutting-edge development tools.
            </div>
            
            <div class="github-badge">
              🤖 Powered by GitHub Copilot Learning Platform • Professional Certification
            </div>
            
            <div class="signature-section">
              <div class="signature">
                <div class="signature-line"></div>
                <div class="signature-title">Learning Platform</div>
                <div class="signature-subtitle">Automated Certification Authority</div>
              </div>
              
              <div class="verification-section">
                <div class="master-seal">★</div>
                <div class="seal-text">Verified Master Certificate</div>
              </div>
              
              <div class="signature">
                <div class="signature-line"></div>
                <div class="signature-title">Date Awarded</div>
                <div class="signature-subtitle">${completionDate.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</div>
              </div>
            </div>
            
            <div class="certificate-id">
              Master Certificate ID: GCP-MASTER-${Date.now()}-${userInfo?.id?.substring(0, 8) || 'ANON'}
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create and download the certificate
    const blob = new Blob([certificateHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GitHub-Copilot-MASTER-Certificate-${participantName.replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Show success message
    alert(`🎉 MASTER CERTIFICATE DOWNLOADED!\n\nCongratulations ${participantName}!\n\nYour GitHub Copilot Master Certificate has been downloaded.\n\n✅ Ready for LinkedIn Profile\n✅ Portfolio Showcase\n✅ Professional Documentation\n\nYou can open the HTML file in any browser and print it as a PDF.`);
  };

  const handleLogout = () => {
    localStorage.removeItem('learning_user_id');
    localStorage.removeItem('user_info');
    router.push('/login');
  };

  const clearAllData = async () => {
    const choice = confirm(
      'Choose how to clear your data:\n\n' +
      'OK = Clear progress only (keep account)\n' +
      'Cancel = Keep everything\n\n' +
      'This action cannot be undone!'
    );
    
    if (!choice) return;

    try {
      console.log('🗑️ Starting data clearing process...');
      
      // Clear localStorage first
      localStorage.removeItem('completed_sections');
      localStorage.removeItem('section_progress');
      console.log('✅ Cleared localStorage data');

      // Clear database if available and user exists
      if (userInfo?.id) {
        console.log('🔄 Attempting to clear database data...');
        const dbCleared = await SectionDatabaseService.deleteUserProgress(userInfo.id);
        
        if (dbCleared) {
          console.log('✅ Successfully cleared database data');
        } else {
          console.log('⚠️ Database clear failed or not available');
        }
      }

      // Update UI state
      setSectionCompletions([]);
      setQuestionResponses([]);
      setOverallStats({
        totalSectionsCompleted: 0,
        totalQuestionsAnswered: 0,
        totalCorrectAnswers: 0,
        overallAccuracy: 0,
        totalTimeSpent: 0,
        averageSectionTime: 0,
        bestAccuracy: 0,
        currentStreak: 0
      });

      alert('✅ Progress data cleared successfully!\n\nYour account is still active.');
      
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('❌ Error clearing data. Please try again.');
    }
  };

  const clearAccount = async () => {
    const confirmed = confirm(
      '⚠️ DELETE ENTIRE ACCOUNT?\n\n' +
      'This will permanently delete:\n' +
      '• Your account\n' +
      '• All progress data\n' +
      '• All quiz responses\n\n' +
      'You will need to re-register.\n\n' +
      'Are you absolutely sure?'
    );
    
    if (!confirmed) return;

    const doubleConfirm = confirm(
      '🚨 FINAL WARNING!\n\n' +
      'This action is PERMANENT and IRREVERSIBLE.\n\n' +
      'Type "DELETE" in the next prompt to confirm.'
    );

    if (!doubleConfirm) return;

    const finalConfirm = prompt('Type "DELETE" to permanently delete your account:');
    if (finalConfirm !== 'DELETE') {
      alert('Account deletion cancelled.');
      return;
    }

    try {
      console.log('🗑️ Starting account deletion process...');
      
      // Clear localStorage first
      localStorage.removeItem('completed_sections');
      localStorage.removeItem('section_progress');
      localStorage.removeItem('learning_user_id');
      localStorage.removeItem('user_info');
      console.log('✅ Cleared all localStorage data');

      // Delete from database if available
      if (userInfo?.id) {
        console.log('🔄 Attempting to delete account from database...');
        const accountDeleted = await SectionDatabaseService.deleteUserAccount(userInfo.id);
        
        if (accountDeleted) {
          console.log('✅ Successfully deleted account from database');
        } else {
          console.log('⚠️ Database account deletion failed or not available');
        }
      }

      alert('✅ Account deleted successfully!\n\nRedirecting to login page...');
      router.push('/login');
      
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('❌ Error deleting account. Please try again.');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'advanced': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              📊 Loading Your Scores
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Gathering your learning progress...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                📊 My Learning Scores
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Welcome back, <span className="font-semibold">{userInfo?.name}</span>! 
                Track your progress across all learning sections.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                🏠 Home
              </button>
              <button
                onClick={() => {
                  console.log('🔄 Manual refresh triggered');
                  loadSectionData();
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                🔄 Refresh Data
              </button>
              <button
                onClick={clearAllData}
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                🗑️ Clear Progress
              </button>
              <button
                onClick={clearAccount}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                🚨 Delete Account
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            {['overview', 'sections', 'detailed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
                }`}
              >
                {tab === 'overview' && '📈 Overview'}
                {tab === 'sections' && '📚 Sections'}
                {tab === 'detailed' && '🔍 Detailed'}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Overall Statistics */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">📊 Overall Statistics</h2>
                <button
                  onClick={() => {
                    console.log('🔍 DEBUG - Current localStorage data:');
                    console.log('completed_sections:', localStorage.getItem('completed_sections'));
                    console.log('section_progress:', localStorage.getItem('section_progress'));
                    console.log('Current overallStats state:', overallStats);
                    alert('Check browser console for localStorage debug info');
                  }}
                  className="text-xs bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                >
                  🔍 Debug Data
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {overallStats.totalSectionsCompleted}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Sections Completed</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {overallStats.overallAccuracy}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Overall Accuracy</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {overallStats.totalQuestionsAnswered}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Questions Answered</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {Math.floor(overallStats.totalTimeSpent / 60)}m
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Total Time</div>
                </div>
              </div>

              {/* Course Completion Certificate */}
              {overallStats.totalSectionsCompleted === 6 && (
                <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200/50 dark:border-yellow-700/50">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <span className="text-5xl">🏆</span>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          Course Completed!
                        </h3>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                          Congratulations! You've mastered all 6 sections
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-3">
                        <div className="text-lg font-bold text-blue-600">6/6</div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">Sections Complete</div>
                      </div>
                      <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-3">
                        <div className="text-lg font-bold text-green-600">{overallStats.overallAccuracy}%</div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">Final Grade</div>
                      </div>
                      <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-3">
                        <div className="text-lg font-bold text-purple-600">{overallStats.totalQuestionsAnswered}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">Total Questions</div>
                      </div>
                      <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-3">
                        <div className="text-lg font-bold text-orange-600">{Math.floor(overallStats.totalTimeSpent / 60)}m</div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">Study Time</div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => generateCompleteCertificate()}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-lg"
                    >
                      <span className="flex items-center gap-3">
                        <span>🎓</span>
                        <span>Download Complete Course Certificate</span>
                      </span>
                    </button>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                      Official GitHub Copilot Master Certificate - Ready for LinkedIn & Portfolio
                    </p>
                  </div>
                </div>
              )}

              {/* Progress toward completion */}
              {overallStats.totalSectionsCompleted < 6 && (
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      🎯 Course Progress
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Complete all 6 sections to earn your GitHub Copilot Master Certificate
                    </p>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 h-4 rounded-full transition-all duration-300"
                        style={{ width: `${(overallStats.totalSectionsCompleted / 6) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {overallStats.totalSectionsCompleted}/6 Sections Complete 
                      ({Math.round((overallStats.totalSectionsCompleted / 6) * 100)}%)
                    </div>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {6 - overallStats.totalSectionsCompleted} more section{6 - overallStats.totalSectionsCompleted !== 1 ? 's' : ''} to go!
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Achievements */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">🏆 Achievements</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg border-2 ${overallStats.totalSectionsCompleted >= 1 ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 bg-gray-50 dark:bg-gray-700'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌟</span>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">First Steps</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Complete your first section</div>
                    </div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg border-2 ${overallStats.overallAccuracy >= 80 ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 bg-gray-50 dark:bg-gray-700'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Accuracy Master</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Achieve 80%+ accuracy</div>
                    </div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg border-2 ${overallStats.totalSectionsCompleted >= 3 ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 bg-gray-50 dark:bg-gray-700'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚡</span>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Speed Learner</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Complete 3 sections</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sections Tab */}
        {activeTab === 'sections' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">📚 Section Progress</h2>
              
              {Object.values(sectionData).map((section) => {
                const completion = sectionCompletions.find(c => c.sectionNumber === section.id);
                const isCompleted = !!completion;
                
                return (
                  <div key={section.id} className="mb-6 last:mb-0">
                    <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">{section.id}</span>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {section.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {section.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(section.difficulty)}`}>
                              {section.difficulty}
                            </span>
                            <span className="text-xs text-gray-500">
                              {section.questions.length} questions
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {isCompleted ? (
                          <div>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                              {completion.accuracy}%
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              {completion.questionsCorrect}/{completion.totalQuestions} correct
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatTime(completion.timeSpent)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(completion.completedAt).toLocaleDateString()}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="text-gray-400 dark:text-gray-500">
                              Not completed
                            </div>
                            <button
                              onClick={() => router.push(`/section-${section.id}`)}
                              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded transition-colors"
                            >
                              Start
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {sectionCompletions.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No sections completed yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Start learning by completing your first section!
                  </p>
                  <button
                    onClick={() => router.push('/section-1')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Start Section 1: What is GitHub Copilot?
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Detailed Tab */}
        {activeTab === 'detailed' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">🔍 Detailed Question Responses</h2>
              
              {questionResponses.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {questionResponses.slice(-20).reverse().map((response, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          Section {response.sectionNumber} - Question {response.questionId}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Answer: {response.answer} • Response time: {response.responseTime}s
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(response.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        response.isCorrect 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {response.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📝</div>
                  <p className="text-gray-600 dark:text-gray-300">
                    No question responses recorded yet. Start answering questions to see detailed analytics here.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}