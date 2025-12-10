'use client';

import { useState, useEffect } from 'react';
import { loadQuestions, getNextLevelId, QuizData } from '../lib/quizData';
import QuestionCard from './QuestionCard';
import Results from './Results';

interface QuizProps {
  userData?: { name: string; phone: string } | null;
}

export default function Quiz({ userData }: QuizProps) {
  // userData is available for future use (e.g., saving results, personalization)
  void userData; // Suppress unused variable warning
  
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [nextLevelId, setNextLevelId] = useState<number | null>(null);

  // Load quiz data when level changes
  useEffect(() => {
    async function initializeQuiz() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await loadQuestions(currentLevelId);
        if (data) {
          setQuizData(data);
          setAnswers(new Array(data.questions.length).fill(null));
          setCurrentQuestionIndex(0);
          setIsComplete(false);
          
          // Check if there's a next level
          const nextId = await getNextLevelId(currentLevelId);
          setNextLevelId(nextId);
        } else {
          setError('Failed to load quiz data');
        }
      } catch (err) {
        setError('An error occurred while loading the quiz');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    initializeQuiz();
  }, [currentLevelId]);

  const handleAnswerSelect = (answer: string) => {
    if (!quizData) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);

    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < quizData.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setIsComplete(true);
      }
    }, 300);
  };

  const handleRestart = () => {
    // Reset to Level 1 - this will trigger useEffect to reload quiz data
    setCurrentLevelId(1);
  };

  const handleNextLevel = () => {
    if (nextLevelId !== null) {
      setCurrentLevelId(nextLevelId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-foreground border-r-transparent mb-4"></div>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-foreground text-background rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!quizData) {
    return null;
  }

  if (isComplete) {
    return (
      <Results
        quizData={quizData}
        answers={answers}
        onRestart={handleRestart}
        onNextLevel={nextLevelId !== null ? handleNextLevel : undefined}
      />
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <QuestionCard
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={quizData.questions.length}
        level={currentLevelId}
        selectedAnswer={answers[currentQuestionIndex]}
        onAnswerSelect={handleAnswerSelect}
      />
    </div>
  );
}

