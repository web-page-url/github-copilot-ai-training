'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sectionData, Question, SectionData } from '@/data/section-questions';
import QuizCard from '@/components/quiz/QuizCard';
import Timer from '@/components/ui/Timer';
import { SectionDatabaseService } from '@/lib/section-database-service';

interface SimpleSectionLearningProps {
  sectionNumber: number;
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
  mobile?: string;
}

interface UserProgress {
  currentQuestionIndex: number;
  answeredQuestions: Set<string>;
  userAnswers: Record<string, string>;
  score: number;
  totalQuestions: number;
  startTime: Date;
  questionsCorrect: number;
}

export default function SimpleSectionLearning({ sectionNumber }: SimpleSectionLearningProps) {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [sectionInfo, setSectionInfo] = useState<SectionData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [progress, setProgress] = useState<UserProgress>({
    currentQuestionIndex: 0,
    answeredQuestions: new Set(),
    userAnswers: {},
    score: 0,
    totalQuestions: 0,
    startTime: new Date(),
    questionsCorrect: 0
  });
  const [sessionStarted, setSessionStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentQuestionStartTime, setCurrentQuestionStartTime] = useState<Date | null>(null);
  const [isDatabaseConnected, setIsDatabaseConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Check authentication and load data
  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (userInfo) {
      loadSectionData();
      initializeDatabaseConnection();
    }
  }, [userInfo, sectionNumber]);

  // Start timer when question appears
  useEffect(() => {
    if (sessionStarted && questions.length > 0) {
      setCurrentQuestionStartTime(new Date());
    }
  }, [sessionStarted, progress.currentQuestionIndex, questions.length]);

  const checkAuthentication = () => {
    setIsCheckingAuth(true);
    
    try {
      const storedUserInfo = localStorage.getItem('user_info');
      const userId = localStorage.getItem('learning_user_id');
      
      if (!storedUserInfo || !userId) {
        router.push('/login');
        return;
      }
      
      const userInfo = JSON.parse(storedUserInfo);
      setUserInfo(userInfo);
      
    } catch (error) {
      console.error('Authentication check failed:', error);
      router.push('/login');
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const initializeDatabaseConnection = async () => {
    const isConnected = await SectionDatabaseService.testDatabaseConnection();
    setIsDatabaseConnected(isConnected);
    
    if (isConnected && userInfo) {
      console.log('✅ Database connected - enabling hybrid storage');
      // Sync any existing localStorage data to database
      await SectionDatabaseService.syncLocalStorageToDatabase(userInfo.id);
    } else {
      console.log('📱 Database not available - using localStorage only');
    }
  };

  const loadSectionData = () => {
    const section = sectionData[sectionNumber];
    if (section) {
      setSectionInfo(section);
      setQuestions(section.questions);
      setProgress(prev => ({
        ...prev,
        totalQuestions: section.questions.length
      }));
    }
  };

  const startSection = () => {
    setSessionStarted(true);
    setProgress(prev => ({
      ...prev,
      startTime: new Date()
    }));
    // Timer will start when first question renders
  };

  const handleQuestionAnswer = (questionId: string, answer: string | number, isCorrect: boolean) => {
    const responseTime = currentQuestionStartTime 
      ? Math.floor((new Date().getTime() - currentQuestionStartTime.getTime()) / 1000)
      : 0;

    // Update progress
    setProgress(prev => ({
      ...prev,
      answeredQuestions: new Set([...Array.from(prev.answeredQuestions), questionId]),
      userAnswers: { ...prev.userAnswers, [questionId]: answer.toString() },
      score: isCorrect ? prev.score + 1 : prev.score,
      questionsCorrect: isCorrect ? prev.questionsCorrect + 1 : prev.questionsCorrect
    }));

    // Save to localStorage for persistence
    const sectionProgress = {
      sectionNumber,
      questionId,
      answer: answer.toString(),
      isCorrect,
      responseTime,
      timestamp: new Date().toISOString()
    };
    
    const existingProgress = JSON.parse(localStorage.getItem('section_progress') || '[]');
    existingProgress.push(sectionProgress);
    localStorage.setItem('section_progress', JSON.stringify(existingProgress));

    // Also save to database if connected
    if (isDatabaseConnected && userInfo) {
      console.log('💾 Saving question response to database...', {
        userId: userInfo.id,
        responseData: sectionProgress
      });
      
      SectionDatabaseService.saveQuestionResponse(userInfo.id, sectionProgress)
        .then((success) => {
          console.log('💾 Question response save result:', success);
        })
        .catch((error) => {
          console.error('❌ Question response save error:', error);
        });
    }

    // Move to next question or show results
    setTimeout(() => {
      if (progress.currentQuestionIndex < questions.length - 1) {
        setProgress(prev => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1
        }));
        setCurrentQuestionStartTime(new Date());
      } else {
        completeSection();
      }
    }, 2000);
  };

  const completeSection = () => {
    const completionData = {
      sectionNumber,
      sectionTitle: sectionInfo?.title || `Section ${sectionNumber}`,
      totalQuestions: questions.length,
      questionsCorrect: progress.questionsCorrect,
      score: progress.score,
      accuracy: Math.round((progress.questionsCorrect / questions.length) * 100),
      timeSpent: Math.floor((new Date().getTime() - progress.startTime.getTime()) / 1000),
      completedAt: new Date().toISOString()
    };

    console.log('🎯 Section Completion Data:', completionData);

    // Save completion data to localStorage
    const completedSections = JSON.parse(localStorage.getItem('completed_sections') || '[]');
    completedSections.push(completionData);
    localStorage.setItem('completed_sections', JSON.stringify(completedSections));
    console.log('✅ Saved to localStorage');

    // Also save to database if connected
    if (isDatabaseConnected && userInfo) {
      console.log('💾 Attempting to save to database...', {
        userId: userInfo.id,
        userData: userInfo,
        completionData
      });
      
      setIsSyncing(true);
      
      // First ensure database is properly set up
      Promise.all([
        SectionDatabaseService.initializeSections(),
        SectionDatabaseService.ensureUserExists(userInfo.id, userInfo.name, userInfo.email)
      ])
      .then(([sectionsInitialized, userEnsured]) => {
        console.log('🔧 Database setup results:', { sectionsInitialized, userEnsured });
        
        if (sectionsInitialized && userEnsured) {
          return SectionDatabaseService.saveSectionCompletion(userInfo.id, completionData);
        } else {
          console.log('❌ Database setup failed, cannot save section completion');
          return false;
        }
      })
      .then((success) => {
        console.log('💾 Database save result:', success);
        if (success) {
          console.log('✅ Successfully saved to database!');
        } else {
          console.log('❌ Database save failed');
        }
      })
      .catch((error) => {
        console.error('❌ Database save error:', error);
      })
      .finally(() => setIsSyncing(false));
    } else {
      console.log('⚠️ Not saving to database:', {
        isDatabaseConnected,
        hasUserInfo: !!userInfo
      });
    }

    setShowResults(true);
  };

  const getProgressPercentage = () => {
    if (!questions.length) return 0;
    return Math.round(((progress.currentQuestionIndex + 1) / questions.length) * 100);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'advanced': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const currentQuestion = questions[progress.currentQuestionIndex];

  // Show loading screen while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              🔐 Verifying Access
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Checking your login status...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show results page
  if (showResults) {
    const accuracy = Math.round((progress.questionsCorrect / questions.length) * 100);
    const timeSpent = Math.floor((new Date().getTime() - progress.startTime.getTime()) / 1000);

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Section Completed!
            </h1>
            <h2 className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              {sectionInfo?.title}
            </h2>
            
            {/* Results Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {progress.questionsCorrect}/{questions.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Questions Correct</div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {accuracy}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Accuracy</div>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {progress.score}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total Points</div>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {Math.round(timeSpent / 60)}m
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Time Spent</div>
              </div>
            </div>

            {/* Sync Status */}
            {isDatabaseConnected && (
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400">
                  {isSyncing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm font-medium">Syncing to database...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg">✅</span>
                      <span className="text-sm font-medium">Data saved to database & available across devices</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {!isDatabaseConnected && (
              <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-center justify-center gap-2 text-orange-700 dark:text-orange-400">
                  <span className="text-lg">📱</span>
                  <span className="text-sm font-medium">Data saved locally on this device only</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button
                onClick={() => router.push('/')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                🏠 Back to Home
              </button>
              
              <button
                onClick={() => router.push('/my-scores')}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                📊 View All My Scores
              </button>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              📝 Question Review
            </h2>
            
                         <div className="space-y-6">
               {questions.map((question, index) => {
                 const userAnswer = progress.userAnswers[question.id];
                 const correctAnswer = question.type === 'multiple-choice' 
                   ? question.options?.[question.correctAnswer as number]
                   : question.correctAnswer;
                 const isCorrect = userAnswer === correctAnswer?.toString();
                
                return (
                  <div key={question.id} className={`p-6 rounded-lg border-2 ${
                    isCorrect 
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                      : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  }`}>
                    {/* Question Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          isCorrect ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            question.category === 'warmup' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                              : question.category === 'general'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                              : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                          }`}>
                            {question.category}
                          </span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isCorrect 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </div>
                    </div>

                    {/* Question Text */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {question.question}
                      </h3>
                    </div>

                                        {/* Answers Section */}
                    {question.type === 'multiple-choice' ? (
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">
                          All Options:
                        </div>
                        <div className="space-y-3">
                          {question.options?.map((option, optionIndex) => {
                            const isUserChoice = userAnswer === optionIndex.toString();
                            const isCorrectOption = optionIndex === (question.correctAnswer as number);
                            
                            return (
                              <div key={optionIndex} className={`p-4 rounded-lg border-2 flex items-center gap-3 ${
                                isCorrectOption 
                                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                                  : isUserChoice 
                                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                  : 'border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600'
                              }`}>
                                {/* Option Label */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                                  isCorrectOption 
                                    ? 'bg-green-500' 
                                    : isUserChoice 
                                    ? 'bg-red-500'
                                    : 'bg-gray-400'
                                }`}>
                                  {String.fromCharCode(65 + optionIndex)}
                                </div>
                                
                                {/* Option Text */}
                                <div className="flex-1">
                                  <div className={`font-medium ${
                                    isCorrectOption 
                                      ? 'text-green-700 dark:text-green-400' 
                                      : isUserChoice 
                                      ? 'text-red-700 dark:text-red-400'
                                      : 'text-gray-700 dark:text-gray-300'
                                  }`}>
                                    {option}
                                  </div>
                                </div>
                                
                                {/* Status Icons */}
                                <div className="flex items-center gap-2">
                                  {isCorrectOption && (
                                    <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded text-xs font-medium">
                                      ✓ Correct
                                    </span>
                                  )}
                                  {isUserChoice && !isCorrectOption && (
                                    <span className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded text-xs font-medium">
                                      Your Choice
                                    </span>
                                  )}
                                  {isUserChoice && isCorrectOption && (
                                    <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded text-xs font-medium">
                                      ✓ Your Choice
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      /* True/False Questions */
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Your Answer */}
                        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                            Your Answer:
                          </div>
                          <div className={`font-semibold ${
                            isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                          }`}>
                            {userAnswer === 'true' ? 'True' : userAnswer === 'false' ? 'False' : userAnswer || 'No answer'}
                          </div>
                        </div>

                        {/* Correct Answer */}
                        <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                            Correct Answer:
                          </div>
                          <div className="font-semibold text-green-700 dark:text-green-400">
                            {correctAnswer === 'true' ? 'True' : correctAnswer === 'false' ? 'False' : correctAnswer}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Explanation */}
                    {question.explanation && (
                      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                        <div className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-1">
                          💡 Explanation:
                        </div>
                        <div className="text-blue-700 dark:text-blue-300">
                          {question.explanation}
                        </div>
                      </div>
                    )}

                                         {/* Question Stats */}
                     <div className="mt-4 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                       <span>⏱️ Time limit: {question.timeLimit}s</span>
                       <span>🎯 Points: {question.points}</span>
                       <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded text-xs">
                         {question.type}
                       </span>
                     </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Stats */}
            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                📊 Final Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {questions.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Total Questions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {progress.questionsCorrect}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Correct Answers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {questions.length - progress.questionsCorrect}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Incorrect Answers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {accuracy}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Final Accuracy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main section page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        {sectionInfo && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">📚</span>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Section {sectionNumber}
                  </h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(sectionInfo.difficulty)}`}>
                    {sectionInfo.difficulty}
                  </span>
                </div>
                <h2 className="text-xl text-gray-600 dark:text-gray-300 mb-2">
                  {sectionInfo.title}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {sectionInfo.description}
                </p>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-500 dark:text-gray-400">Duration</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  ~{sectionInfo.duration} minutes
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {questions.length} questions
                </div>
                {/* Database Status Indicator */}
                <div className="mt-2 flex items-center justify-end gap-2">
                  {isSyncing ? (
                    <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Syncing...
                    </span>
                  ) : isDatabaseConnected ? (
                    <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                      🔗 Database Connected
                    </span>
                  ) : (
                    <span className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                      📱 Local Storage Only
                    </span>
                  )}
                </div>
              </div>
            </div>

            {!sessionStarted ? (
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Ready to start this section? You'll answer {questions.length} questions 
                  covering {sectionInfo.title.toLowerCase()}.
                </p>
                <button
                  onClick={startSection}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    <span>🚀</span>
                    Start Section {sectionNumber}
                  </span>
                </button>
              </div>
            ) : (
              /* Progress Bar */
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Question {progress.currentQuestionIndex + 1} of {questions.length}
                  </span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {getProgressPercentage()}% Complete
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Question Display */}
        {sessionStarted && currentQuestion && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-sm font-medium">
                    {currentQuestion.category}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {currentQuestion.points} point{currentQuestion.points !== 1 ? 's' : ''}
                  </span>
                </div>
                <Timer 
                  initialTime={180} 
                  onComplete={() => {
                    handleQuestionAnswer(currentQuestion.id, '', false);
                  }}
                  autoStart={true}
                  size="sm"
                />
              </div>
            </div>

            <div className="p-8">
              <QuizCard
                key={currentQuestion.id}
                question={{
                  id: currentQuestion.id,
                  question: currentQuestion.question,
                  type: currentQuestion.type,
                  options: currentQuestion.options || [],
                  correctAnswer: currentQuestion.correctAnswer,
                  explanation: currentQuestion.explanation,
                  timeLimit: currentQuestion.timeLimit,
                  aiGenerated: false
                }}
                onAnswer={(answer, correct) => handleQuestionAnswer(currentQuestion.id, answer, correct)}
                onTimeUp={() => handleQuestionAnswer(currentQuestion.id, '', false)}
                autoStart={true}
                showExplanation={progress.answeredQuestions.has(currentQuestion.id)}
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
} 