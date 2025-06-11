import Image from "next/image";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | GitHub Copilot Learning Platform',
  description: 'Master GitHub Copilot with our comprehensive learning platform featuring AI-powered development training, hands-on exercises, and professional certification.',
  openGraph: {
    title: 'GitHub Copilot Learning Platform - Master AI-Powered Development',
    description: 'Professional GitHub Copilot training with real-time analytics and certification',
    images: ['/images/og/co-pilot-1.0.png'],
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-600/5 dark:to-purple-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          <div className="text-center">
            {/* Logo/Brand */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Image
                    src="/images/icons/co-pilot-1.0.png"
                    alt="Interactive Learning Platform Co-pilot Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded"
                    priority
                  />
                </div>
                <div className="text-left">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    GitHub Copilot Learning Platform
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Professional AI-Powered Development Training
                  </p>
                </div>
              </div>
            </div>

            {/* Hero Content */}
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Master GitHub Copilot
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  with AI-Powered Development
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Comprehensive GitHub Copilot training platform with individual progress tracking, 
                real-time analytics, and professional certification. Built for 100+ concurrent learners.
              </p>

              {/* Key Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur rounded-lg p-6 border border-gray-200/50 dark:border-gray-700/50">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-3">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 4L10 12L17 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 16H17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Individual Tracking</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Personal progress analytics with detailed performance insights</p>
                </div>
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur rounded-lg p-6 border border-gray-200/50 dark:border-gray-700/50">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mb-3">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 2L13 8H20L14.5 13L16 20L10 16L4 20L5.5 13L0 8H7L10 2Z" fill="white"/>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Real-time Updates</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Live dashboard with instant progress monitoring</p>
                </div>
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur rounded-lg p-6 border border-gray-200/50 dark:border-gray-700/50">
                  <div className="text-3xl mb-3">🏆</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Professional Certification</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Earn verifiable certificates with achievement tracking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Learning Path Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              🚀 Start Your Learning Journey
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose your path and begin learning GitHub Copilot AI with our interactive platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Login Card */}
            <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white text-xl">🔐</span>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Login</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Access your dashboard and personal progress with your registered email
                </p>
                <a
                  href="/login"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 w-full justify-center"
                >
                  <span>Sign In</span> 🔓
                </a>
              </div>
            </div>

            {/* Registration Card */}
            <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white text-xl">👤</span>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Register & Start</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Create your profile with personal details for individualized tracking and certificates
                </p>
                <a
                  href="/register"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 w-full justify-center"
                >
                  <span>Register Now</span> 🚀
                </a>
              </div>
            </div>

            {/* Learning Platform Card */}
            <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white text-xl">🎓</span>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Interactive Learning</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  6 comprehensive modules with timed quizzes, discussions, and real-time progress tracking
                </p>
                <a
                  href="/section-1"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 w-full justify-center"
                >
                  <span>Start Learning</span> ⚡
                </a>
              </div>
            </div>

            {/* Personal Scores Card */}
            <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white text-xl">🏆</span>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Personal Analytics</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  View your individual scores, achievements, and detailed performance analytics
                </p>
                <a
                  href="/my-scores"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 w-full justify-center"
                >
                  <span>View My Scores</span> 📊
                </a>
              </div>
            </div>
          </div>

          {/* 5 Individual Sections */}
          <div className="mt-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                🤖 GitHub Copilot Learning Sections
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Master GitHub Copilot through structured learning modules. Each section contains targeted questions and practical exercises.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Section 1: HTML Fundamentals */}
              <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                    <Image
                      src="/images/sections/html-icon.svg"
                      alt="HTML Fundamentals"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Section 1</h4>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Beginner</span>
                  </div>
                  <h5 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">What is GitHub Copilot?</h5>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                    Introduction to GitHub Copilot, AI pair programming and its role in modern development
                  </p>
                  <a
                    href="/section-1"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 w-full justify-center"
                  >
                    <span>Start Section 1</span> 🚀
                  </a>
                </div>
              </div>

              {/* Section 2: CSS Styling */}
              <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <Image
                      src="/images/sections/css-icon.svg"
                      alt="CSS Styling & Layout"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Section 2</h4>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Beginner</span>
                  </div>
                  <h5 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Key Features and Plans</h5>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                    Explore Copilot's features, pricing plans, and subscription options
                  </p>
                  <a
                    href="/section-2"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 w-full justify-center"
                  >
                    <span>Start Section 2</span> 🚀
                  </a>
                </div>
              </div>

              {/* Section 3: JavaScript */}
              <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center mb-4">
                    <Image
                      src="/images/sections/javascript-icon.svg"
                      alt="JavaScript Essentials"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Section 3</h4>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Intermediate</span>
                  </div>
                  <h5 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Using Copilot in Visual Studio Code</h5>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                    Hands-on experience with Copilot installation, setup, and VS Code integration
                  </p>
                  <a
                    href="/section-3"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 w-full justify-center"
                  >
                    <span>Start Section 3</span> 🚀
                  </a>
                </div>
              </div>

              {/* Section 4: React */}
              <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-white text-xl">⚛️</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Section 4</h4>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Intermediate</span>
                  </div>
                  <h5 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Framework-Specific Capabilities</h5>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                    Using Copilot with React, Node.js, Python, and other popular frameworks
                  </p>
                  <a
                    href="/section-4"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 w-full justify-center"
                  >
                    <span>Start Section 4</span> 🚀
                  </a>
                </div>
              </div>

              {/* Section 5: Full-Stack */}
              <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🔗</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Section 5</h4>
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Advanced</span>
                  </div>
                  <h5 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Responsible Use and Limitations (Responsible AI)</h5>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                    Understanding AI ethics, code review practices, and responsible AI development
                  </p>
                  <a
                    href="/section-5"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 w-full justify-center"
                  >
                    <span>Start Section 5</span> 🚀
                  </a>
                </div>
              </div>

              {/* Section 6: Hands-On Examples */}
              <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🛠️</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Section 6</h4>
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Advanced</span>
                  </div>
                  <h5 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Hands-On Examples Overview</h5>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                    Practical examples of using GitHub Copilot
                  </p>
                  <a
                    href="/section-6"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 w-full justify-center"
                  >
                    <span>Start Section 6</span> 🚀
                  </a>
                </div>
              </div>

              {/* All Sections Overview */}
              <div className="group relative bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600">
                <div className="relative p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <span className="text-white text-xl">📋</span>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">All Sections</h4>
                  <h5 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Complete Overview</h5>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                    View progress across all sections and track your learning journey
                  </p>
                  <a
                    href="/my-scores"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-500 to-blue-600 hover:from-gray-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 w-full justify-center"
                  >
                    <span>View Progress</span> 📊
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Admin Section */}
      

        {/* Platform Features */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Platform Capabilities
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built with modern technologies to support professional learning at scale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-3">⚡</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Real-time Updates</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Live progress tracking with WebSocket connections</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-3">👥</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">100+ Users</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Scalable architecture for concurrent learners</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-3">📊</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Advanced Analytics</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Comprehensive reporting and data visualization</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-3">🏆</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Certification</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Professional certificates with achievement tracking</p>
            </div>
          </div>
        </section>

        {/* Technical Transparency */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8 border border-blue-200/50 dark:border-blue-700/50">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              🔍 Built with Transparency
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Explore the technical implementation and architecture behind this learning platform
            </p>
            <a
              href="/transparency"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors font-medium"
            >
              <span>🔍</span>
              <span>View Technical Documentation</span>
              <span>→</span>
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🎓</span>
              </div>
              <span className="text-xl font-bold">Interactive Learning Platform</span>
            </div>
            
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Professional Github Copilot training with real-time analytics and individual progress tracking
            </p>
            
            
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <a href="/login" className="text-gray-400 hover:text-white transition-colors">Login</a>
              <a href="/" className="text-gray-400 hover:text-white transition-colors">Home</a>
              <a href="/section-1" className="text-gray-400 hover:text-white transition-colors">Learning Modules</a>
              <a href="/admin-scores" className="text-gray-400 hover:text-white transition-colors">Admin Dashboard</a>
              <a href="/transparency" className="text-gray-400 hover:text-white transition-colors">Documentation</a>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-800">
              <p className="text-gray-500 text-sm">
                © 2025 Interactive Learning Platform. Create by - Anubhav.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
