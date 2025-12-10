// Type definitions for quiz data structures
export interface Level {
  id: number;
  limit: number;
  passScore: number;
  file: string;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

export interface QuizData {
  level: number;
  limit: number;
  passScore: number;
  questions: Question[];
}

// Utility functions to load quiz data
export async function loadLevels(): Promise<Level[]> {
  try {
    const response = await fetch('/data/levels.json');
    if (!response.ok) {
      throw new Error('Failed to load levels');
    }
    const data = await response.json();
    return data as Level[];
  } catch (error) {
    console.error('Error loading levels:', error);
    throw error;
  }
}

export async function loadQuestions(levelId: number): Promise<QuizData | null> {
  try {
    const levels = await loadLevels();
    const level = levels.find((l) => l.id === levelId);
    
    if (!level) {
      throw new Error(`Level ${levelId} not found`);
    }

    const response = await fetch(`/data/questions/${level.file}`);
    if (!response.ok) {
      throw new Error(`Failed to load questions for level ${levelId}`);
    }
    const data = await response.json();
    
    // Apply the limit: take only the first N questions based on level.limit
    const limitedQuestions = data.questions.slice(0, level.limit);
    
    return {
      ...data,
      limit: level.limit,
      passScore: level.passScore,
      questions: limitedQuestions,
    } as QuizData;
  } catch (error) {
    console.error(`Error loading questions for level ${levelId}:`, error);
    return null;
  }
}

export async function getNextLevelId(currentLevelId: number): Promise<number | null> {
  try {
    const levels = await loadLevels();
    const currentIndex = levels.findIndex((l) => l.id === currentLevelId);
    if (currentIndex === -1 || currentIndex === levels.length - 1) {
      return null; // No next level
    }
    return levels[currentIndex + 1].id;
  } catch (error) {
    console.error('Error getting next level:', error);
    return null;
  }
}

