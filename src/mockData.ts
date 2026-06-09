import type { Task, Habit, CalendarEvent, Note, TimerSession, UserSettings } from './types';

// Helper to get formatted date string (YYYY-MM-DD)
export const getRelativeDateString = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Complete Planner UI',
    description: 'Design and polish the dashboard, sidebar, and layout spacing.',
    priority: 'high',
    status: 'completed',
    dueDate: getRelativeDateString(0),
    category: 'Work',
  },
  {
    id: 't2',
    title: 'Workout Session',
    description: '45-minute strength training and cardio routine.',
    priority: 'medium',
    status: 'completed',
    dueDate: getRelativeDateString(0),
    category: 'Health',
  },
  {
    id: 't3',
    title: 'Team Meeting',
    description: 'Sync up with design and engineering teams to discuss deliverables.',
    priority: 'high',
    status: 'completed',
    dueDate: getRelativeDateString(0),
    category: 'Work',
  },
  {
    id: 't4',
    title: 'Read Book',
    description: 'Read 20 pages of "Atomic Habits" and take notes in the Notes panel.',
    priority: 'low',
    status: 'todo',
    dueDate: getRelativeDateString(0),
    category: 'Personal',
  },
  {
    id: 't5',
    title: 'Learn React Hooks',
    description: 'Dive deep into React context API, custom hooks, and useMemo.',
    priority: 'medium',
    status: 'todo',
    dueDate: getRelativeDateString(0),
    category: 'Work',
  },
  {
    id: 't6',
    title: 'Weekly Review',
    description: 'Summarize accomplishments, reflect on habits, and plan the upcoming week.',
    priority: 'low',
    status: 'todo',
    dueDate: getRelativeDateString(2),
    category: 'Personal',
  },
  {
    id: 't7',
    title: 'Update Portfolio website',
    description: 'Refactor main projects section and add the new case study.',
    priority: 'medium',
    status: 'in_progress',
    dueDate: getRelativeDateString(3),
    category: 'Work',
  },
  {
    id: 't8',
    title: 'Meal Prep',
    description: 'Prepare high-protein meals for the remainder of the week.',
    priority: 'low',
    status: 'completed',
    dueDate: getRelativeDateString(-1),
    category: 'Health',
  }
];

// Generate habit history helper
const generateHabitHistory = (rate: number, streak: number) => {
  const history: { [date: string]: boolean } = {};
  // Set up completions for the past 30 days
  for (let i = 30; i >= 0; i--) {
    const dateStr = getRelativeDateString(-i);
    if (i <= streak && i > 0) {
      // Must be true to maintain current streak
      history[dateStr] = true;
    } else {
      // Randomly complete based on completion rate
      history[dateStr] = Math.random() < rate;
    }
  }
  // Make sure today is handled correctly in mock depending on streak
  history[getRelativeDateString(0)] = streak > 0;
  return history;
};

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'h1',
    name: 'Exercise',
    streak: 12,
    bestStreak: 18,
    targetFrequency: 'Daily',
    history: generateHabitHistory(0.9, 12),
    createdAt: getRelativeDateString(-30),
  },
  {
    id: 'h2',
    name: 'Reading',
    streak: 4,
    bestStreak: 10,
    targetFrequency: 'Daily',
    history: generateHabitHistory(0.75, 4),
    createdAt: getRelativeDateString(-30),
  },
  {
    id: 'h3',
    name: 'Meditation',
    streak: 0,
    bestStreak: 5,
    targetFrequency: 'Daily',
    history: generateHabitHistory(0.6, 0),
    createdAt: getRelativeDateString(-30),
  },
  {
    id: 'h4',
    name: 'Water Intake',
    streak: 7,
    bestStreak: 15,
    targetFrequency: 'Daily',
    history: generateHabitHistory(0.85, 7),
    createdAt: getRelativeDateString(-30),
  }
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'e1',
    title: 'Workout',
    date: getRelativeDateString(0),
    time: '09:00 AM',
    category: 'Workout',
  },
  {
    id: 'e2',
    title: 'Deep Work',
    date: getRelativeDateString(0),
    time: '11:00 AM',
    category: 'Deep Work',
  },
  {
    id: 'e3',
    title: 'Project Work',
    date: getRelativeDateString(0),
    time: '02:00 PM',
    category: 'Project Work',
  },
  {
    id: 'e4',
    title: 'Reading Session',
    date: getRelativeDateString(0),
    time: '06:00 PM',
    category: 'Reading',
  },
  // Upcoming events
  {
    id: 'e5',
    title: 'Team Meeting',
    date: getRelativeDateString(1),
    time: '10:00 AM',
    category: 'Meeting',
  },
  {
    id: 'e6',
    title: 'Deep Work',
    date: getRelativeDateString(1),
    time: '01:00 PM',
    category: 'Deep Work',
  },
  {
    id: 'e7',
    title: 'Workout',
    date: getRelativeDateString(2),
    time: '08:30 AM',
    category: 'Workout',
  },
  {
    id: 'e8',
    title: 'Project Presentation',
    date: getRelativeDateString(3),
    time: '03:00 PM',
    category: 'Meeting',
  },
  {
    id: 'e9',
    title: 'Reading Session',
    date: getRelativeDateString(-1),
    time: '05:00 PM',
    category: 'Reading',
  }
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'n1',
    title: 'Project Ideas',
    content: `# Project Ideas

Here are some brainstorming concepts for my next projects:

- **SaaS Analytics Dashboard**: A tool targeting indie hackers to monitor subscription health.
- **AI Coding Companion Extension**: Integrate Gemini model to assist in local IDE refactoring tasks.
- **Personal Daily Planner**: Complete React application styled with Tailwind CSS, utilizing client-side state for productivity monitoring.
- **Interactive Markdown Wiki**: Simple, high-performance editor that maps tags and visual links automatically.`,
    updatedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    tags: ['Work', 'Ideas'],
  },
  {
    id: 'n2',
    title: 'Daily Reflection',
    content: `# Daily Reflection

## Date: Today

- **What went well?** Completing the core structure of the new workspace layouts and styling components using Tailwind CSS.
- **What didn't go well?** Spent too much time tweaking colors, which delayed note-taking editor implementation.
- **Focus for tomorrow:** Finalize local storage integrations and make sure that responsive sheets open perfectly.`,
    updatedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    tags: ['Personal', 'Reflection'],
  },
  {
    id: 'n3',
    title: 'Learning Notes',
    content: `# Learning Notes: React Hooks & Typescript

- **useState**: Keeps local reactive state.
- **useContext**: Excellent for theme controls and caching global configurations without prop drilling.
- **useEffect**: Clean up listeners or start timers. Remember to include dependency arrays!
- **Generics in TS**: E.g., \`interface APIResponse<T> { data: T; status: number }\` allows flexible typed returns.`,
    updatedAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
    tags: ['Study', 'Coding'],
  },
  {
    id: 'n4',
    title: 'Weekly Goals',
    content: `# Weekly Goals

- [x] Complete the Kanban task boards
- [x] Integrate high-fidelity Pomodoro timers
- [ ] Read at least 100 pages of the current technical book
- [ ] Run workout sessions four times a week
- [ ] Refactor the SVG graphing module`,
    updatedAt: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
    tags: ['Personal', 'Goals'],
  }
];

export const INITIAL_TIMER_SESSIONS: TimerSession[] = [
  {
    id: 'ts1',
    duration: 25,
    category: 'React Study',
    timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
  {
    id: 'ts2',
    duration: 50,
    category: 'Project Work',
    timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
  },
  {
    id: 'ts3',
    duration: 25,
    category: 'Reading',
    timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: 'ts4',
    duration: 25,
    category: 'React Study',
    timestamp: new Date(Date.now() - 25 * 3600000).toISOString(),
  },
  {
    id: 'ts5',
    duration: 50,
    category: 'Project Work',
    timestamp: new Date(Date.now() - 48 * 3600000).toISOString(),
  }
];

export const DEFAULT_SETTINGS: UserSettings = {
  workStartTime: '09:00',
  workEndTime: '18:00',
  defaultFocusDuration: 25,
  theme: 'light',
};
