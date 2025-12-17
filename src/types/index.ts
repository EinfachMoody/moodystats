export type MoodType = 'amazing' | 'good' | 'okay' | 'bad' | 'terrible';

export type TaskCategory = 'work' | 'personal' | 'health' | 'other';

export type TaskPriority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate: Date;
  completed: boolean;
  completedAt?: Date;
  points: number;
}

export interface MoodEntry {
  id: string;
  date: Date;
  mood: MoodType;
  note?: string;
}

export interface JournalEntry {
  id: string;
  date: Date;
  text: string;
  tags: string[];
}

export interface UserStats {
  totalPoints: number;
  currentStreak: number;
  tasksCompleted: number;
  badges: string[];
}

export const MOOD_EMOJIS: Record<MoodType, string> = {
  amazing: '🤩',
  good: '😊',
  okay: '😐',
  bad: '😔',
  terrible: '😢',
};

export const MOOD_LABELS: Record<MoodType, string> = {
  amazing: 'Amazing',
  good: 'Good',
  okay: 'Okay',
  bad: 'Bad',
  terrible: 'Terrible',
};

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  work: 'Work',
  personal: 'Personal',
  health: 'Health',
  other: 'Other',
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};
