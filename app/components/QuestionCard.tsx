'use client';

import { Question } from '../lib/quizData';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  level: number;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  level,
  selectedAnswer,
  onAnswerSelect,
}: QuestionCardProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      {/* Level Badge */}
      <div className="mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-foreground/10 dark:bg-foreground/20 text-foreground">
          Level {level}
        </span>
      </div>

      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {Math.round((questionNumber / totalQuestions) * 100)}%
          </span>
        </div>
        <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2">
          <div
            className="bg-foreground h-2 rounded-full transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-6 leading-tight">
        {question.question}
      </h2>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          return (
            <button
              key={index}
              onClick={() => onAnswerSelect(option)}
              className={`w-full text-left px-5 py-4 rounded-lg border-2 transition-all duration-200 min-h-[56px] flex items-center ${
                isSelected
                  ? 'border-foreground bg-foreground/10 dark:bg-foreground/20'
                  : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-foreground/50 hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              <span className="text-base sm:text-lg text-foreground">
                {option}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

