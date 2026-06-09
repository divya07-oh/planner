import React from 'react';
import { usePlanner } from '../context/PlannerContext';
import {
  ProductivityLineChart,
  TaskCompletionBarChart,
  HabitConsistencyChart,
  FocusHoursAreaChart
} from '../components/Charts';
import {
  CheckSquare,
  Clock,
  Flame,
  Award,
  Calendar,
  Sparkles
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { tasks, sessions, habits, stats } = usePlanner();

  // --- Summary metrics counts ---
  const totalTasksCompleted = tasks.filter(t => t.status === 'completed').length;
  
  const totalFocusMinutes = sessions.reduce((acc, curr) => acc + curr.duration, 0);
  const totalFocusHours = (totalFocusMinutes / 60).toFixed(1);

  const maxCurrentStreak = habits.length ? Math.max(...habits.map(h => h.streak)) : 0;
  const maxBestStreak = habits.length ? Math.max(...habits.map(h => h.bestStreak)) : 0;

  // Static mock weekly trends data
  const weeklyProductivity = [
    { label: 'Mon', value: 72 },
    { label: 'Tue', value: 85 },
    { label: 'Wed', value: 64 },
    { label: 'Thu', value: 91 },
    { label: 'Fri', value: stats.productivityScore > 0 ? stats.productivityScore : 84 },
    { label: 'Sat', value: 78 },
    { label: 'Sun', value: 88 },
  ];

  const weeklyTasks = [
    { label: 'Mon', value: 6, value2: 2 },
    { label: 'Tue', value: 8, value2: 1 },
    { label: 'Wed', value: 4, value2: 3 },
    { label: 'Thu', value: 9, value2: 1 },
    { label: 'Fri', value: stats.tasksCompletedToday, value2: stats.tasksPendingToday },
    { label: 'Sat', value: 5, value2: 0 },
    { label: 'Sun', value: 7, value2: 2 },
  ];

  const weeklyHabits = [
    { label: 'Mon', value: 75 },
    { label: 'Tue', value: 100 },
    { label: 'Wed', value: 50 },
    { label: 'Thu', value: 75 },
    { label: 'Fri', value: stats.habitCompletionToday },
    { label: 'Sat', value: 100 },
    { label: 'Sun', value: 80 },
  ];

  const weeklyFocus = [
    { label: 'Mon', value: 1.5 },
    { label: 'Tue', value: 3.0 },
    { label: 'Wed', value: 1.0 },
    { label: 'Thu', value: 4.5 },
    { label: 'Fri', value: stats.focusTimeTodayMinutes / 60 },
    { label: 'Sat', value: 2.0 },
    { label: 'Sun', value: 3.5 },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 flex-1 h-full min-h-0 max-w-[1600px] mx-auto w-full overflow-y-auto select-none">
      {/* Top Header Row */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
          Productivity Analytics
        </h2>
        <p className="text-xs font-semibold text-slate-400 mt-1">
          Deep-dive reports on focus sessions, task ratios, and consistency habits.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="glass-panel p-4 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-transform">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Tasks Completed</span>
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary"><CheckSquare className="w-4 h-4" /></div>
          </div>
          <h4 className="text-2xl font-extrabold text-slate-800 mt-3 leading-none">{totalTasksCompleted}</h4>
          <span className="text-[9px] font-semibold text-slate-400 mt-1.5 block">Across all lists</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-transform">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Focus Hours</span>
            <div className="p-1.5 rounded-lg bg-accent/15 text-sky-650"><Clock className="w-4 h-4" /></div>
          </div>
          <h4 className="text-2xl font-extrabold text-slate-800 mt-3 leading-none">{totalFocusHours}h</h4>
          <span className="text-[9px] font-semibold text-slate-400 mt-1.5 block">Total logged focus</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-transform">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Current Streak</span>
            <div className="p-1.5 rounded-lg bg-warning/10 text-warning"><Flame className="w-4 h-4 fill-warning" /></div>
          </div>
          <h4 className="text-2xl font-extrabold text-slate-800 mt-3 leading-none">{maxCurrentStreak}d</h4>
          <span className="text-[9px] font-semibold text-slate-400 mt-1.5 block">Active habits streak</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-transform">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Best Streak</span>
            <div className="p-1.5 rounded-lg bg-success/10 text-success"><Award className="w-4 h-4" /></div>
          </div>
          <h4 className="text-2xl font-extrabold text-slate-800 mt-3 leading-none">{maxBestStreak}d</h4>
          <span className="text-[9px] font-semibold text-slate-400 mt-1.5 block">All-time record streak</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-transform">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Most Productive</span>
            <div className="p-1.5 rounded-lg bg-secondary/10 text-secondary"><Calendar className="w-4 h-4" /></div>
          </div>
          <h4 className="text-xl font-extrabold text-slate-800 mt-3 leading-none">Thursday</h4>
          <span className="text-[9px] font-semibold text-slate-400 mt-1.5 block">Based on focus sessions</span>
        </div>
      </div>

      {/* Grid Layout containing 4 custom SVG charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Chart 1: Productivity Trend */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col">
          <h3 className="text-xs font-bold text-slate-800 pb-3 border-b border-slate-100 mb-4 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-primary" />
            Productivity score Trend
          </h3>
          <div className="w-full h-[220px] flex items-center justify-center">
            <ProductivityLineChart data={weeklyProductivity} height={200} />
          </div>
        </div>

        {/* Chart 2: Task Completion Trend */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col">
          <h3 className="text-xs font-bold text-slate-800 pb-3 border-b border-slate-100 mb-4 flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-success" />
            Tasks Completed vs Pending
          </h3>
          <div className="w-full h-[220px] flex items-center justify-center">
            <TaskCompletionBarChart data={weeklyTasks} height={200} />
          </div>
        </div>

        {/* Chart 3: Habit Consistency Trend */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col">
          <h3 className="text-xs font-bold text-slate-800 pb-3 border-b border-slate-100 mb-4 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-warning" />
            Habit Consistency percentage
          </h3>
          <div className="w-full h-[220px] flex items-center justify-center">
            <HabitConsistencyChart data={weeklyHabits} height={200} />
          </div>
        </div>

        {/* Chart 4: Focus Hours Trend */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col">
          <h3 className="text-xs font-bold text-slate-800 pb-3 border-b border-slate-100 mb-4 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-accent" />
            Daily Focus Hours Logged
          </h3>
          <div className="w-full h-[220px] flex items-center justify-center">
            <FocusHoursAreaChart data={weeklyFocus} height={200} />
          </div>
        </div>

      </div>
    </div>
  );
};
