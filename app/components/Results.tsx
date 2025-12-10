'use client';

import { Question, QuizData } from '../lib/quizData';

interface ResultsProps {
  quizData: QuizData;
  answers: string[];
  onRestart: () => void;
  onNextLevel?: () => void;
  onCancel?: () => void;
}

export default function Results({ quizData, answers, onRestart, onNextLevel, onCancel }: ResultsProps) {
  // Calculate score
  const correctAnswers = quizData.questions.filter(
    (question: Question, index: number) => question.answer === answers[index]
  ).length;
  const totalQuestions = quizData.questions.length;
  const score = correctAnswers;
  const percentage = Math.round((score / totalQuestions) * 100);
  const passed = true || score >= quizData.passScore;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 relative">
      {onCancel && (
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors z-10"
          aria-label="Cancel quiz"
        >
          <span className="text-xl text-foreground">×</span>
        </button>
      )}
      {/* Result Header */}
      <div className="text-center mb-8">
        <div
          className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
            passed
              ? 'bg-green-100 dark:bg-green-900/30'
              : 'bg-red-100 dark:bg-red-900/30'
          }`}
        >
          <span className="text-4xl">{passed ? '✓' : '✗'}</span>
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {passed ? 'Congratulations!' : 'Try Again'}
        </h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          {passed
            ? `You passed with ${score}/${totalQuestions} correct answers`
            : `You got ${score}/${totalQuestions} correct answers. You need ${quizData.passScore} to pass.`}
        </p>
      </div>

      {/* Score Display */}
      <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium text-foreground">Your Score</span>
          <span className="text-2xl font-bold text-foreground">
            {score}/{totalQuestions}
          </span>
        </div>
        <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-3 mb-2">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              passed ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
          {percentage}% correct
        </p>
      </div>

      {/* Breakdown */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-foreground mb-4">
          Question Breakdown
        </h3>
        <div className="space-y-3">
          {quizData.questions.map((question, index) => {
            const isCorrect = question.answer === answers[index];
            return (
              <div
                key={question.id}
                className={`p-4 rounded-lg border-2 ${
                  isCorrect
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                }`}
              >
                <div className="flex items-start gap-3 mb-2">
                  <span
                    className={`text-xl font-bold ${
                      isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {isCorrect ? '✓' : '✗'}
                  </span>
                  <div className="flex-1">
                    <p className="text-base font-medium text-foreground mb-1">
                      {question.question}
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Your answer: <span className="font-medium">{answers[index] || 'Not answered'}</span>
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        Correct answer: <span className="font-medium">{question.answer}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {passed && onNextLevel && (
          <button
            onClick={onNextLevel}
            className="w-full py-4 px-6 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors"
          >
            Next Level
          </button>
        )}
        <button
          onClick={onRestart}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-opacity ${
            passed && onNextLevel
              ? 'bg-zinc-200 dark:bg-zinc-800 text-foreground hover:opacity-90'
              : 'bg-foreground text-background hover:opacity-90'
          }`}
        >
          {passed && onNextLevel ? 'Restart Level' : 'Restart Quiz'}
        </button>
      </div>
    </div>
  );
}

