'use client';

import { useState } from 'react';

interface UserDetailsProps {
  onContinue: (userData: { name: string; phone: string } | null) => void;
  onCancel?: () => void;
}

export default function UserDetails({ onContinue, onCancel }: UserDetailsProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() || phone.trim()) {
      onContinue({ name: name.trim(), phone: phone.trim() });
    } else {
      onContinue(null);
    }
  };

  const handleSkip = () => {
    onContinue(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-md mx-auto px-4 py-8 relative">
        {onCancel && (
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors z-10"
            aria-label="Cancel"
          >
            <span className="text-xl text-foreground">×</span>
          </button>
        )}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
              Enter Your Details
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
              Help us personalize your experience (optional)
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-lg border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-foreground placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:border-foreground transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 rounded-lg border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-foreground placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:border-foreground transition-colors"
              />
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <button
                type="submit"
                className="w-full py-3 px-6 bg-foreground text-background rounded-lg font-semibold text-base hover:opacity-90 transition-opacity"
              >
                Continue to Quiz
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className="w-full py-3 px-6 bg-transparent border-2 border-zinc-300 dark:border-zinc-700 text-foreground rounded-lg font-semibold text-base hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Skip
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

