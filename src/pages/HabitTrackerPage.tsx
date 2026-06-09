import React, { useState } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { Button, Input, Dropdown, Badge } from '../components/UI';
import { getRelativeDateString } from '../mockData';
import {
  Plus,
  Flame,
  CheckCircle2,
  Calendar,
  Percent,
  TrendingUp,
  Award,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const HabitTrackerPage: React.FC = () => {
  const { habits, addHabit, toggleHabitDate, deleteHabit } = usePlanner();

  const todayStr = React.useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitFreq, setNewHabitFreq] = useState('Daily');
  const [hoveredCell, setHoveredCell] = useState<{ date: string; count: number; x: number; y: number } | null>(null);

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    addHabit({
      name: newHabitName,
      targetFrequency: newHabitFreq,
    });
    setNewHabitName('');
    confetti({
      particleCount: 50,
      spread: 30,
      colors: ['#F59E0B', '#EF4444'],
      origin: { x: 0.85, y: 0.6 }
    });
  };

  const handleHabitToggle = (id: string, isCompleted: boolean) => {
    toggleHabitDate(id, todayStr);
    if (!isCompleted) {
      confetti({
        particleCount: 40,
        spread: 30,
        colors: ['#F59E0B', '#10B981'],
        origin: { y: 0.7 }
      });
    }
  };

  // --- STATS COMPUTATION ---
  const maxCurrentStreak = habits.length ? Math.max(...habits.map(h => h.streak)) : 0;
  const maxBestStreak = habits.length ? Math.max(...habits.map(h => h.bestStreak)) : 0;

  // Weekly & Monthly aggregate completion rates
  const getAggregateRate = (daysCount: number) => {
    if (!habits.length) return 0;
    let totalOpportunities = habits.length * daysCount;
    let totalCompletions = 0;
    
    for (let i = 1; i <= daysCount; i++) {
      const dateStr = getRelativeDateString(-i);
      habits.forEach(h => {
        if (h.history[dateStr]) {
          totalCompletions++;
        }
      });
    }
    return Math.round((totalCompletions / totalOpportunities) * 100);
  };

  const weeklyRate = getAggregateRate(7);
  const monthlyRate = getAggregateRate(30);

  // --- HEATMAP COMPUTATION (365 Days) ---
  const heatmapData = React.useMemo(() => {
    const data: { date: string; count: number; dayOfWeek: number; weekIndex: number }[] = [];
    const today = new Date();
    
    const startDate = new Date();
    startDate.setDate(today.getDate() - 364);
    const startDay = startDate.getDay();
    startDate.setDate(startDate.getDate() - startDay); // Shift to Sunday

    let checkDate = new Date(startDate);
    let weekIndex = 0;

    while (checkDate <= today) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const dayOfWeek = checkDate.getDay(); // 0 = Sunday, 1 = Monday etc.
      
      let completions = 0;
      habits.forEach(h => {
        if (h.history[dateStr]) {
          completions++;
        }
      });

      data.push({
        date: dateStr,
        count: completions,
        dayOfWeek,
        weekIndex,
      });

      if (dayOfWeek === 6) {
        weekIndex++;
      }

      checkDate.setDate(checkDate.getDate() + 1);
    }
    return data;
  }, [habits]);

  // Color mapper for heatmap cells
  const getCellColor = (count: number) => {
    if (count === 0) return 'fill-slate-100';
    if (count === 1) return 'fill-success/25';
    if (count === 2) return 'fill-success/55';
    return 'fill-success'; // 3+ completions
  };

  return (
    <div className="flex flex-col gap-6 p-8 h-full max-w-[1600px] mx-auto w-full overflow-y-auto select-none">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
            Habit Tracker
          </h2>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            Build consistency, track consecutive day streaks, and visual progress grids.
          </p>
        </div>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel card-lift p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-warning/10 text-warning rounded-xl">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Streak</p>
            <h4 className="text-2xl font-extrabold text-slate-800 mt-0.5">{maxCurrentStreak} Days</h4>
          </div>
        </div>

        <div className="glass-panel card-lift p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-success/10 text-success rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Best Streak</p>
            <h4 className="text-2xl font-extrabold text-slate-800 mt-0.5">{maxBestStreak} Days</h4>
          </div>
        </div>

        <div className="glass-panel card-lift p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weekly consistency</p>
            <h4 className="text-2xl font-extrabold text-slate-800 mt-0.5">{weeklyRate}%</h4>
          </div>
        </div>

        <div className="glass-panel card-lift p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Consistency</p>
            <h4 className="text-2xl font-extrabold text-slate-800 mt-0.5">{monthlyRate}%</h4>
          </div>
        </div>
      </div>

      {/* GitHub Contribution Heatmap Widget */}
      <div className="glass-panel card-lift rounded-2xl p-5 flex flex-col relative overflow-hidden">
        <h3 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-success" />
          Yearly Habits Consistency Heatmap
        </h3>

        {/* Heatmap Grid wrapper */}
        <div className="overflow-x-auto pb-2 scrollbar-thin">
          <div className="min-w-[720px] relative">
            <svg viewBox="0 0 740 110" className="w-full h-auto overflow-visible select-none">
              {/* Row weekday label guides */}
              {['M', 'W', 'F'].map((day, dIdx) => (
                <text
                  key={day}
                  x="4"
                  y={24 + dIdx * 28}
                  className="text-[9px] font-extrabold fill-slate-400"
                >
                  {day}
                </text>
              ))}

              {/* Grid cells */}
              {heatmapData.map((cell) => {
                const cellSize = 10;
                const cellGap = 3;
                const x = 20 + cell.weekIndex * (cellSize + cellGap);
                const y = 8 + cell.dayOfWeek * (cellSize + cellGap);

                return (
                  <rect
                    key={cell.date}
                    x={x}
                    y={y}
                    width={cellSize}
                    height={cellSize}
                    rx="2"
                    className={`${getCellColor(cell.count)} stroke-[0.5] stroke-slate-200 hover:stroke-slate-400 cursor-pointer transition-all`}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const parentRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                      if (parentRect) {
                        setHoveredCell({
                          date: cell.date,
                          count: cell.count,
                          x: rect.left - parentRect.left + 5,
                          y: rect.top - parentRect.top - 34,
                        });
                      }
                    }}
                    onMouseLeave={() => setHoveredCell(null)}
                  />
                );
              })}
            </svg>

            {/* Heatmap Cell Tooltip */}
            {hoveredCell && (
              <div
                className="absolute z-10 px-2.5 py-1 text-[10px] font-bold text-white bg-slate-900 rounded-lg shadow-md border border-slate-700/30 -translate-x-1/2 flex flex-col items-center pointer-events-none"
                style={{ left: hoveredCell.x, top: hoveredCell.y }}
              >
                <span>{hoveredCell.date}</span>
                <span className="text-success mt-0.5">{hoveredCell.count} completed</span>
              </div>
            )}
          </div>
        </div>

        {/* Heatmap Legend */}
        <div className="flex justify-end gap-3 mt-3 items-center text-[10px] font-bold text-slate-400">
          <span>Less</span>
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-slate-100 border border-slate-200" />
            <span className="w-2.5 h-2.5 rounded bg-success/25" />
            <span className="w-2.5 h-2.5 rounded bg-success/55" />
            <span className="w-2.5 h-2.5 rounded bg-success" />
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Checklist & Habit Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Quick log check & Add Habit */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Quick log checklist */}
          <div className="glass-panel card-lift p-5 rounded-2xl flex flex-col">
            <h3 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-warning" />
              Log Habits Today
            </h3>

            <div className="space-y-3">
              {habits.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No active habits.</p>
              ) : (
                habits.map(h => {
                  const completedToday = !!h.history[todayStr];
                  return (
                    <div
                      key={h.id}
                      onClick={() => handleHabitToggle(h.id, completedToday)}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors group bg-white"
                    >
                      <span className={`text-xs font-bold ${completedToday ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                        {h.name}
                      </span>
                      <button
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer ${
                          completedToday
                            ? 'bg-warning border-warning text-white'
                            : 'border-slate-300 text-transparent'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Add Habit Widget */}
          <div className="glass-panel card-lift p-5 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" />
              Create Habit
            </h3>
            <form onSubmit={handleAddHabit} className="flex flex-col gap-3">
              <Input
                placeholder="e.g. Meditate for 10 min"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                className="text-xs animate-none"
              />
              <Dropdown
                label="Target Frequency"
                options={[
                  { value: 'Daily', label: 'Daily' },
                  { value: '3x / week', label: '3x / week' },
                  { value: '5x / week', label: '5x / week' },
                  { value: 'Weekly', label: 'Weekly' },
                ]}
                value={newHabitFreq}
                onChange={(e) => setNewHabitFreq(e.target.value)}
                className="text-xs cursor-pointer"
              />
              <Button type="submit" className="text-xs py-1.5 mt-2 bg-primary">
                Add Habit
              </Button>
            </form>
          </div>
        </div>

        {/* Right column: Habit Cards details list */}
        <div className="lg:col-span-2 glass-panel card-lift p-5 rounded-2xl flex flex-col h-[525px] lg:h-auto overflow-y-auto">
          <h3 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100 mb-4">
            Streaks & Details
          </h3>

          <div className="space-y-4">
            {habits.length === 0 ? (
              <div className="text-center text-slate-400 text-xs py-12">
                Create habits in the form to start tracking progress.
              </div>
            ) : (
              habits.map((h) => {
                const completions = Object.values(h.history).filter(Boolean).length;
                const completionRate = Math.round((completions / 30) * 100);

                return (
                  <div
                    key={h.id}
                    className="p-4 rounded-xl border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group transition-colors bg-white hover:border-slate-300"
                  >
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800">
                        {h.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5">
                        <Badge variant="neutral">{h.targetFrequency}</Badge>
                        <span className="text-[10px] font-bold text-slate-400">
                          Started: {h.createdAt}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 self-end sm:self-auto">
                      <div className="text-right">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Streaks</span>
                        <div className="flex items-center gap-1.5 text-warning font-bold text-xs mt-0.5">
                          <Flame className="w-4 h-4 fill-warning" />
                          <span>{h.streak}d current</span>
                          <span className="text-slate-300">|</span>
                          <span className="text-slate-400 font-semibold">{h.bestStreak}d best</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">30d Rate</span>
                        <span className="text-xs font-bold text-slate-700 mt-0.5 block">
                          {completionRate}% ({completions} days)
                        </span>
                      </div>

                      <button
                        onClick={() => deleteHabit(h.id)}
                        className="p-2 rounded text-slate-400 hover:text-danger hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
