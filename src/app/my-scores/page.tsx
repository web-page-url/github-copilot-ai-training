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
      setSectionCompletions(completedSections);
      
      // Load individual question responses
      const questionProgress = JSON.parse(localStorage.getItem('section_progress') || '[]') as QuestionResponse[];
      setQuestionResponses(questionProgress);
      
      // Calculate overall statistics
      calculateOverallStats(completedSections, questionProgress);
      
    } catch (error) {
      console.error('Error loading section data:', error);
    }
  };

  const calculateOverallStats = (completions: SectionCompletion[], responses: QuestionResponse[]) => {
    const totalSectionsCompleted = completions.length;
    const totalQuestionsAnswered = responses.length;
    const totalCorrectAnswers = responses.filter(r => r.isCorrect).length;
    const overallAccuracy = totalQuestionsAnswered > 0 ? Math.round((totalCorrectAnswers / totalQuestionsAnswered) * 100) : 0;
    const totalTimeSpent = completions.reduce((sum, c) => sum + c.timeSpent, 0);
    const averageSectionTime = totalSectionsCompleted > 0 ? Math.round(totalTimeSpent / totalSectionsCompleted) : 0;
    const bestAccuracy = completions.length > 0 ? Math.max(...completions.map(c => c.accuracy)) : 0;
    
    // Calculate streak (consecutive sections completed)
    const sortedCompletions = completions.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
    let currentStreak = 0;
    for (let i = 0; i < sortedCompletions.length; i++) {
      const completion = sortedCompletions[i];
      const completionDate = new Date(completion.completedAt);
      const daysSinceCompletion = Math.floor((new Date().getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceCompletion <= 7) { // Within a week
        currentStreak++;
      } else {
        break;
      }
    }

    setOverallStats({
      totalSectionsCompleted,
      totalQuestionsAnswered,
      totalCorrectAnswers,
      overallAccuracy,
      totalTimeSpent,
      averageSectionTime,
      bestAccuracy,
      currentStreak
    });
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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">📊 Overall Statistics</h2>
              
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
                    Start Section 1: HTML Fundamentals
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