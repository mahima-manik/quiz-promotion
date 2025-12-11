'use client';

import { useState } from 'react';
import Quiz from './components/Quiz';
import UserDetails from './components/UserDetails';

export default function Home() {
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [userData, setUserData] = useState<{ name: string; phone: string } | null>(null);

  const handleStartQuiz = () => {
    setShowUserDetails(true);
  };

  const handleUserDetailsContinue = async (data: { name: string; phone: string } | null) => {
    // Save user details to Google Sheets if provided
    if (data && (data.name || data.phone)) {
      try {
        await fetch('/api/save-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        // Don't block quiz start if save fails - fail silently
      } catch (error) {
        console.error('Failed to save user details:', error);
        // Continue with quiz even if save fails
      }
    }

    setUserData(data);
    setShowUserDetails(false);
    setQuizStarted(true);
  };

  const handleCancelQuiz = () => {
    // Reset all state to return to home page
    setShowUserDetails(false);
    setQuizStarted(false);
    setUserData(null);
  };

  if (showUserDetails) {
    return <UserDetails onContinue={handleUserDetailsContinue} onCancel={handleCancelQuiz} />;
  }

  if (quizStarted) {
    return <Quiz userData={userData} onCancel={handleCancelQuiz} />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-16 px-4 sm:px-8 bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-6 text-center w-full">
          <h1 className="text-3xl sm:text-4xl font-semibold leading-tight tracking-tight text-black dark:text-zinc-50 max-w-md">
            Welcome to the Quiz
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Test your knowledge with our interactive quiz. Answer the questions and see how you score!
          </p>
        </div>
        <div className="mt-8 w-full max-w-sm">
          <button
            onClick={handleStartQuiz}
            className="w-full h-14 flex items-center justify-center rounded-full bg-foreground px-6 text-background text-base font-semibold transition-colors hover:opacity-90"
          >
            Start Quiz
          </button>
        </div>
      </main>
    </div>
  );
}
