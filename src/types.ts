export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string; // YYYY-MM-DD
  category: string; // e.g., 'Work', 'Personal', 'Health'
}

export interface Habit {
  id: string;
  name: string;
  streak: number;
  bestStreak: number;
  targetFrequency: string; // e.g., 'Daily', '4x / week'
  history: { [date: string]: boolean }; // YYYY-MM-DD -> completed (true/false)
  createdAt: string;
}

export interface TimerSession {
  id: string;
  duration: number; // in minutes
  category: string; // e.g., 'React Study', 'Project Work', 'Reading'
  timestamp: string; // ISO String
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g., '09:00 AM', '11:00 AM'
  category: string; // 'Workout' | 'Deep Work' | 'Project Work' | 'Reading' | 'Meeting' | etc.
}

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string; // ISO String
  tags: string[];
}

export interface UserSettings {
  workStartTime: string; // '09:00'
  workEndTime: string; // '18:00'
  defaultFocusDuration: number; // minutes, e.g. 25
  theme: 'light' | 'dark';
}
