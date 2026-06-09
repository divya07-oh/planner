import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Task, Habit, CalendarEvent, Note, TimerSession, UserSettings, TaskStatus } from '../types';
import {
  INITIAL_TASKS,
  INITIAL_HABITS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_NOTES,
  INITIAL_TIMER_SESSIONS,
  DEFAULT_SETTINGS,
  getRelativeDateString,
} from '../mockData';

interface PlannerContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;

  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'bestStreak' | 'history' | 'createdAt'>) => void;
  toggleHabitDate: (id: string, date: string) => void;
  deleteHabit: (id: string) => void;

  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  deleteEvent: (id: string) => void;

  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'updatedAt'>) => void;
  updateNote: (id: string, title: string, content: string, tags: string[]) => void;
  deleteNote: (id: string) => void;

  sessions: TimerSession[];
  addSession: (duration: number, category: string) => void;
  clearSessionHistory: () => void;

  settings: UserSettings;
  updateSettings: (settings: UserSettings) => void;
  resetAllData: () => void;

  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Computed productivity aggregates for today
  stats: {
    tasksCompletedToday: number;
    tasksPendingToday: number;
    focusTimeToday: string; // e.g. "3h 45m"
    focusTimeTodayMinutes: number;
    habitCompletionToday: number; // percentage, e.g. 80
    productivityScore: number; // 0 to 100
  };
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

export const PlannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state or fallback to defaults
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('planner_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('planner_habits');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('planner_events');
    return saved ? JSON.parse(saved) : INITIAL_CALENDAR_EVENTS;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('planner_notes');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [sessions, setSessions] = useState<TimerSession[]>(() => {
    const saved = localStorage.getItem('planner_sessions');
    return saved ? JSON.parse(saved) : INITIAL_TIMER_SESSIONS;
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('planner_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [activeTab, setActiveTabState] = useState<string>(() => {
    return localStorage.getItem('planner_active_tab') || 'Landing';
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Auto-save functions
  useEffect(() => {
    localStorage.setItem('planner_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('planner_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('planner_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('planner_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('planner_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('planner_settings', JSON.stringify(settings));
    
    // Always force light mode classes
    document.documentElement.classList.remove('dark');
  }, [settings]);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    localStorage.setItem('planner_active_tab', tab);
  };

  // --- Task Operations ---
  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: 'task_' + Math.random().toString(36).substr(2, 9),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const nextStatusMap: { [key in TaskStatus]: TaskStatus } = {
            todo: 'in_progress',
            in_progress: 'completed',
            completed: 'todo',
          };
          return { ...t, status: nextStatusMap[t.status] };
        }
        return t;
      })
    );
  };

  // --- Habit Operations ---
  const addHabit = (habitData: Omit<Habit, 'id' | 'streak' | 'bestStreak' | 'history' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: 'habit_' + Math.random().toString(36).substr(2, 9),
      streak: 0,
      bestStreak: 0,
      history: {},
      createdAt: getRelativeDateString(0),
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const toggleHabitDate = (id: string, date: string) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id === id) {
          const completed = !h.history[date];
          const updatedHistory = { ...h.history, [date]: completed };

          // Recalculate streak
          let currentStreak = 0;
          let activeDate = new Date();
          
          // Check consecutive preceding days
          while (true) {
            const checkStr = activeDate.toISOString().split('T')[0];
            if (updatedHistory[checkStr]) {
              currentStreak++;
              activeDate.setDate(activeDate.getDate() - 1);
            } else {
              // If it's today and not completed, look at yesterday to see if streak is preserved
              const todayStr = new Date().toISOString().split('T')[0];
              if (checkStr === todayStr) {
                activeDate.setDate(activeDate.getDate() - 1);
                continue;
              }
              break;
            }
          }

          const newBestStreak = Math.max(h.bestStreak, currentStreak);
          return {
            ...h,
            history: updatedHistory,
            streak: currentStreak,
            bestStreak: newBestStreak,
          };
        }
        return h;
      })
    );
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  // --- Calendar Event Operations ---
  const addEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: 'event_' + Math.random().toString(36).substr(2, 9),
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  // --- Note Operations ---
  const addNote = (noteData: Omit<Note, 'id' | 'updatedAt'>) => {
    const newNote: Note = {
      ...noteData,
      id: 'note_' + Math.random().toString(36).substr(2, 9),
      updatedAt: new Date().toISOString(),
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const updateNote = (id: string, title: string, content: string, tags: string[]) => {
    setNotes(prev =>
      prev.map(n =>
        n.id === id
          ? { ...n, title, content, tags, updatedAt: new Date().toISOString() }
          : n
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  // --- Timer Session Operations ---
  const addSession = (duration: number, category: string) => {
    const newSession: TimerSession = {
      id: 'session_' + Math.random().toString(36).substr(2, 9),
      duration,
      category,
      timestamp: new Date().toISOString(),
    };
    setSessions(prev => [newSession, ...prev]);
  };

  const clearSessionHistory = () => {
    setSessions([]);
  };

  // --- Settings & Recovery ---
  const updateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
  };

  const resetAllData = () => {
    setTasks(INITIAL_TASKS);
    setHabits(INITIAL_HABITS);
    setEvents(INITIAL_CALENDAR_EVENTS);
    setNotes(INITIAL_NOTES);
    setSessions(INITIAL_TIMER_SESSIONS);
    setSettings(DEFAULT_SETTINGS);
    setActiveTab('Landing');
    localStorage.clear();
  };

  // --- Compute Statistics for Today ---
  const todayStr = getRelativeDateString(0);

  // Today's tasks (due today)
  const todayTasks = tasks.filter(t => t.dueDate === todayStr);
  const tasksCompletedToday = todayTasks.filter(t => t.status === 'completed').length;
  const tasksPendingToday = todayTasks.length - tasksCompletedToday;

  // Focus time today
  const todaySessions = sessions.filter(
    s => s.timestamp.split('T')[0] === todayStr
  );
  const focusTimeTodayMinutes = todaySessions.reduce((acc, curr) => acc + curr.duration, 0);
  const hrs = Math.floor(focusTimeTodayMinutes / 60);
  const mins = focusTimeTodayMinutes % 60;
  const focusTimeToday = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;

  // Habit completion rate today
  const habitCompletionToday = habits.length
    ? Math.round(
        (habits.filter(h => h.history[todayStr]).length / habits.length) * 100
      )
    : 0;

  // Productivity Score logic (weighted sum)
  // 1. Task Completion rate (40% weight)
  // 2. Habit Completion rate (30% weight)
  // 3. Focus Sessions completed relative to target of 4 sessions (30% weight)
  const taskWeight = todayTasks.length ? (tasksCompletedToday / todayTasks.length) * 40 : 40; // full points if no tasks scheduled
  const habitWeight = (habitCompletionToday / 100) * 30;
  const focusSessionsTarget = 4;
  const focusWeight = Math.min((todaySessions.length / focusSessionsTarget) * 30, 30);
  
  const productivityScore = Math.min(Math.round(taskWeight + habitWeight + focusWeight), 100);

  const stats = {
    tasksCompletedToday,
    tasksPendingToday,
    focusTimeToday,
    focusTimeTodayMinutes,
    habitCompletionToday,
    productivityScore,
  };

  return (
    <PlannerContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        habits,
        addHabit,
        toggleHabitDate,
        deleteHabit,
        events,
        addEvent,
        deleteEvent,
        notes,
        addNote,
        updateNote,
        deleteNote,
        sessions,
        addSession,
        clearSessionHistory,
        settings,
        updateSettings,
        resetAllData,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        stats,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
};

export const usePlanner = () => {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
};
