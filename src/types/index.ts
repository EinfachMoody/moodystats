export type MoodType = 'amazing' | 'good' | 'okay' | 'bad' | 'terrible';

export type TaskCategory = 'work' | 'personal' | 'health' | 'other';

export type TaskPriority = 'high' | 'medium' | 'low';

export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly';

export type TaskViewMode = 'compact' | 'standard' | 'cards';

export type TextSize = 'small' | 'normal' | 'large';

export type UIDensity = 'compact' | 'normal';

export type GlassIntensity = 'light' | 'normal' | 'strong';

export type NavPosition = 'bottom' | 'top' | 'left' | 'right';

// App version info
export const APP_VERSION = '0.2 Alpha 4';
export const APP_BUILD = '54';

// Custom Page/Category for Tasks
export interface TaskPage {
  id: string;
  name: string;
  accentColor: string;
  order: number;
  createdAt: Date;
}

// Subtask
export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  notes?: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate: Date;
  dueTime?: string;
  repeat: RepeatType;
  completed: boolean;
  completedAt?: Date;
  points: number;
  // New fields
  pageId?: string; // Custom page ID
  subtasks?: Subtask[];
  order?: number; // For drag & drop sorting
  isFocus?: boolean; // Daily focus task (max 3)
  marked?: boolean; // Visual marking (no priority levels)
}

export const REPEAT_LABELS: Record<RepeatType, string> = {
  none: 'Never',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

export interface MoodEntry {
  id: string;
  date: Date;
  mood: MoodType;
  note?: string;
  completedTaskIds?: string[]; // Tasks completed on this day
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  isAllDay?: boolean;
  location?: string;
  reminder?: number;
  color?: string;
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

// Mood labels are now dynamically translated via t() function
// This is kept for backwards compatibility but use t('amazing'), t('good'), etc.
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

// Preset accent colors for pages
export const PAGE_COLORS = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#EF4444', // Red
  '#F97316', // Orange
  '#EAB308', // Yellow
  '#22C55E', // Green
  '#14B8A6', // Teal
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
];

// App Settings Interface
export interface AppSettings {
  // Layout & View
  taskViewMode: TaskViewMode;
  textSize: TextSize;
  uiDensity: UIDensity;
  // Colors
  accentColor: string;
  glassIntensity: GlassIntensity;
  // Theme
  themeMode: 'light' | 'dark' | 'system';
  // Navigation
  navPosition: NavPosition;
}

export const DEFAULT_SETTINGS: AppSettings = {
  taskViewMode: 'standard',
  textSize: 'normal',
  uiDensity: 'normal',
  accentColor: '#3B82F6',
  glassIntensity: 'normal',
  themeMode: 'system',
  navPosition: 'bottom',
};
