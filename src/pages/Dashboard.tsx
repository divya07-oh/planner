import React from 'react';
import { usePlanner } from '../context/PlannerContext';
import { StatCard } from '../components/StatCard';
import { CalendarWidget } from '../components/CalendarWidget';
import { ProductivityLineChart } from '../components/Charts';
import { Badge } from '../components/UI';
import {
  CheckSquare,
  Clock,
  Flame,
  LineChart,
  CheckCircle2,
  Calendar,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const Dashboard: React.FC = () => {
  const {
    tasks,
    habits,
    toggleTaskStatus,
    toggleHabitDate,
    stats,
    events,
    setActiveTab,
  } = usePlanner();

  const todayStr = React.useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  // Filter tasks due today
  const todayTasks = tasks.filter(t => t.dueDate === todayStr);

  // Filter events scheduled for today
  const todayEvents = events
    .filter(e => e.date === todayStr)
    .sort((a, b) => a.time.localeCompare(b.time));

  // Static mock weekly productivity trend for the chart
  const weeklyData = [
    { label: 'Mon', value: 75 },
    { label: 'Tue', value: 82 },
    { label: 'Wed', value: 65 },
    { label: 'Thu', value: 89 },
    { label: 'Fri', value: stats.productivityScore > 0 ? stats.productivityScore : 84 },
    { label: 'Sat', value: 92 },
    { label: 'Sun', value: 80 },
  ];

  const handleTaskToggle = (id: string, currentStatus: string) => {
    toggleTaskStatus(id);
    if (currentStatus !== 'completed') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  };

  const handleHabitToggle = (id: string, isCompleted: boolean) => {
    toggleHabitDate(id, todayStr);
    if (!isCompleted) {
      confetti({
        particleCount: 50,
        spread: 40,
        colors: ['#38BDF8', '#4F46E5', '#2563EB'],
        origin: { y: 0.8 }
      });
    }
  };

  return (
    <div className="flex flex-col gap-8 p-8 overflow-y-auto max-w-[1600px] mx-auto w-full">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-7 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white shadow-md">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Welcome back, Divya!</h2>
          <p className="text-sm text-slate-100 opacity-90 mt-1.5 font-medium">
            You are on a roll. Let's make today highly productive!
          </p>
        </div>
        <div className="mt-4 sm:mt-0 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-300 fill-amber-300 animate-pulse" />
          <span className="text-sm font-bold">Daily Streak: 12 days</span>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-lift h-full">
          <StatCard
            title="Today's Tasks"
            value={todayTasks.length ? `${stats.tasksCompletedToday}/${todayTasks.length}` : '0/0'}
            description="Tasks scheduled for today"
            icon={CheckSquare}
            colorClass="text-primary bg-blue-50"
            progress={{
              current: stats.tasksCompletedToday,
              total: Math.max(todayTasks.length, 1),
              colorClass: 'bg-primary',
            }}
          />
        </div>

        <div className="card-lift h-full">
          <StatCard
            title="Focus Time"
            value={stats.focusTimeToday}
            description="Pomodoro minutes logged today"
            icon={Clock}
            colorClass="text-accent bg-sky-50"
            trend={{ value: '+20%', isPositive: true }}
          />
        </div>

        <div className="card-lift h-full">
          <StatCard
            title="Habit Completion"
            value={`${stats.habitCompletionToday}%`}
            description="Habits tracked today"
            icon={Flame}
            colorClass="text-warning bg-amber-50"
            progress={{
              current: stats.habitCompletionToday,
              total: 100,
              colorClass: 'bg-warning',
            }}
          />
        </div>

        <div className="card-lift h-full">
          <StatCard
            title="Productivity Score"
            value={`${stats.productivityScore}/100`}
            description="Dynamic daily progress rating"
            icon={LineChart}
            colorClass="text-success bg-green-50"
            trend={{ value: '+4.2%', isPositive: true }}
          />
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Tasks Widget */}
        <div className="glass-panel card-lift rounded-2xl p-6 flex flex-col h-[400px]">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-primary" />
              Today's Tasks
            </h3>
            <button
              onClick={() => setActiveTab('Tasks')}
              className="px-3 py-1.5 min-h-[36px] rounded-lg bg-primary/5 text-primary text-xs font-bold hover:bg-primary/10 transition-colors cursor-pointer"
            >
              View Board
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {todayTasks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <CheckSquare className="w-8 h-8 opacity-30 mb-2" />
                <p className="text-xs font-medium">No tasks scheduled for today.</p>
              </div>
            ) : (
              todayTasks.map(t => {
                const isCompleted = t.status === 'completed';
                return (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/60 hover:bg-slate-50 transition-all cursor-pointer group"
                    onClick={() => handleTaskToggle(t.id, t.status)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${
                          isCompleted
                            ? 'bg-success border-success text-white'
                            : 'border-slate-300 hover:border-primary'
                        }`}
                      >
                        {isCompleted && (
                          <svg className="w-3.5 h-3.5 stroke-2 stroke-white fill-none" viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>
                      <span
                        className={`text-xs font-semibold truncate ${
                          isCompleted
                            ? 'line-through text-slate-400'
                            : 'text-slate-700'
                        }`}
                      >
                        {t.title}
                      </span>
                    </div>

                    <Badge
                      variant={
                        t.priority === 'high'
                          ? 'high'
                          : t.priority === 'medium'
                          ? 'medium'
                          : 'low'
                      }
                    >
                      {t.priority}
                    </Badge>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Today's Schedule Widget */}
        <div className="glass-panel card-lift rounded-2xl p-6 flex flex-col h-[400px]">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-secondary" />
              Today's Schedule
            </h3>
            <button
              onClick={() => setActiveTab('Calendar')}
              className="text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              Add Event
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {todayEvents.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Calendar className="w-8 h-8 opacity-30 mb-2" />
                <p className="text-xs font-medium">Clear schedule for today!</p>
              </div>
            ) : (
              <div className="relative border-l border-slate-200 ml-2.5 pl-4 space-y-5 py-1.5">
                {todayEvents.map(e => (
                  <div key={e.id} className="relative group">
                    {/* Circle Node */}
                    <span className="absolute -left-[22.5px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white bg-secondary shadow-sm" />
                    
                    <div>
                      <span className="text-[10px] font-bold text-slate-400">
                        {e.time}
                      </span>
                      <h4 className="text-xs font-bold text-slate-700 mt-0.5">
                        {e.title}
                      </h4>
                      <p className="text-[10px] font-semibold text-slate-400">
                        {e.category}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Habits Progress Widget */}
        <div className="glass-panel card-lift rounded-2xl p-6 flex flex-col h-[400px]">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Flame className="w-5 h-5 text-warning" />
              Today's Habits
            </h3>
            <button
              onClick={() => setActiveTab('Habits')}
              className="px-3 py-1.5 min-h-[36px] rounded-lg bg-primary/5 text-primary text-xs font-bold hover:bg-primary/10 transition-colors cursor-pointer"
            >
              Manage
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {habits.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Flame className="w-8 h-8 opacity-30 mb-2" />
                <p className="text-xs font-medium">No habits tracking configured.</p>
              </div>
            ) : (
              habits.map(h => {
                const completedToday = !!h.history[todayStr];
                // Calculate completion percent
                const completedCount = Object.values(h.history).filter(Boolean).length;
                const percent = Math.round((completedCount / 30) * 100);

                return (
                  <div key={h.id} className="flex flex-col gap-1.5 p-1 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <button
                          onClick={() => handleHabitToggle(h.id, completedToday)}
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150 cursor-pointer ${
                            completedToday
                              ? 'bg-warning border-warning text-white'
                              : 'border-slate-200 text-slate-400 hover:border-warning hover:bg-warning/5'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-bold text-slate-700 truncate">
                          {h.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-extrabold text-slate-400">
                        {h.streak}d streak
                      </span>
                    </div>

                    <div className="flex items-center gap-2 ml-8">
                      <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-warning h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-bold text-slate-400">
                        {percent}%
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Lower Row (Charts & Mini Calendar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Productivity Chart Widget */}
        <div className="glass-panel card-lift rounded-2xl p-6 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <LineChart className="w-5 h-5 text-primary" />
              Weekly Productivity Score Trend
            </h3>
            <button
              onClick={() => setActiveTab('Analytics')}
              className="text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              Analytics
            </button>
          </div>
          <div className="w-full h-[200px] flex items-center justify-center">
            <ProductivityLineChart data={weeklyData} height={180} />
          </div>
        </div>

        {/* Mini Calendar Widget */}
        <div className="card-lift">
          <CalendarWidget />
        </div>
      </div>
    </div>
  );
};
