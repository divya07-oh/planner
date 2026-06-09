import React from 'react';
import { usePlanner } from '../context/PlannerContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CalendarWidget: React.FC = () => {
  const { tasks } = usePlanner();
  const today = new Date();
  
  const [currentYear, setCurrentYear] = React.useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = React.useState(today.getMonth()); // 0-indexed

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday, 1 = Monday, etc.

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Generate day boxes
  const daysArray: (number | null)[] = [];
  // Fill leading empty days
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  // Fill actual days
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  // Helper to check tasks on a date
  const getTasksForDate = (day: number) => {
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateQuery = `${currentYear}-${monthStr}-${dayStr}`;
    return tasks.filter(t => t.dueDate === dateQuery);
  };

  return (
    <div className="glass-panel rounded-2xl p-4 h-full flex flex-col justify-between select-none">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-slate-800">
          {monthNames[currentMonth]} {currentYear}
        </h4>
        <div className="flex gap-1">
          <button
            onClick={prevMonth}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-2.5 text-center text-xs">
        {/* Days of week */}
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <span key={day} className="font-bold text-slate-400">
            {day}
          </span>
        ))}

        {/* Days grid */}
        {daysArray.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} />;
          }

          const isToday =
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();

          const dayTasks = getTasksForDate(day);
          const hasHigh = dayTasks.some(t => t.priority === 'high' && t.status !== 'completed');
          const hasMedium = dayTasks.some(t => t.priority === 'medium' && t.status !== 'completed');
          const hasLow = dayTasks.some(t => t.priority === 'low' && t.status !== 'completed');
          const allCompleted = dayTasks.length > 0 && dayTasks.every(t => t.status === 'completed');

          return (
            <div
              key={`day-${day}`}
              className="relative flex flex-col items-center justify-center py-1 group"
            >
              <span
                className={`w-6 h-6 flex items-center justify-center rounded-lg font-semibold transition-all duration-200 ${
                  isToday
                    ? 'bg-primary text-white font-extrabold shadow-sm shadow-primary/20'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {day}
              </span>

              {/* Task Indicator Dots */}
              <div className="absolute bottom-0 flex justify-center gap-0.5 w-full h-1">
                {allCompleted ? (
                  <span className="w-1 h-1 rounded-full bg-success" />
                ) : (
                  <>
                    {hasHigh && <span className="w-1 h-1 rounded-full bg-danger" />}
                    {hasMedium && <span className="w-1 h-1 rounded-full bg-warning" />}
                    {hasLow && <span className="w-1 h-1 rounded-full bg-success" />}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
