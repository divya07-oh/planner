import React, { useState } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { Button, Input, Dropdown } from '../components/UI';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  CalendarDays,
  Clock,
  CheckCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CalendarPage: React.FC = () => {
  const { events, addEvent, deleteEvent, tasks } = usePlanner();

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Scheduler Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventTime, setEventTime] = useState('09:00 AM');
  const [eventCategory, setEventCategory] = useState('Deep Work');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

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

  // Generate grid days
  const daysArray: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  // Get date key for a specific day
  const getDateString = (day: number) => {
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${currentYear}-${monthStr}-${dayStr}`;
  };

  // Filter events and tasks for the selected date
  const selectedDayEvents = events
    .filter(e => e.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const selectedDayTasks = tasks.filter(t => t.dueDate === selectedDate);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    addEvent({
      title: eventTitle,
      date: selectedDate,
      time: eventTime,
      category: eventCategory,
    });

    setEventTitle('');
    confetti({
      particleCount: 50,
      spread: 30,
      colors: ['#4F46E5', '#38BDF8'],
      origin: { x: 0.85, y: 0.6 }
    });
  };

  const categoryOptions = [
    { value: 'Workout', label: 'Workout' },
    { value: 'Deep Work', label: 'Deep Work' },
    { value: 'Project Work', label: 'Project Work' },
    { value: 'Reading', label: 'Reading' },
    { value: 'Meeting', label: 'Meeting' },
  ];

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Workout': return 'bg-success/10 text-success border border-success/20';
      case 'Deep Work': return 'bg-primary/10 text-primary border border-primary/20';
      case 'Project Work': return 'bg-secondary/10 text-secondary border border-secondary/20';
      case 'Reading': return 'bg-accent/15 text-sky-600 border border-accent/20';
      default: return 'bg-warning/10 text-warning border border-warning/20';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-8 h-full max-w-[1600px] mx-auto w-full overflow-hidden select-none">
      {/* Calendar Grid Container */}
      <div className="glass-panel card-lift flex-1 rounded-2xl p-5 flex flex-col justify-between h-[650px] lg:h-auto overflow-y-auto bg-white">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
              Click dates to view schedule details.
            </p>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={prevMonth}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-all duration-300 cursor-pointer border border-slate-200 bg-white hover:-translate-y-0.5 hover:shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setCurrentMonth(today.getMonth());
                setCurrentYear(today.getFullYear());
                setSelectedDate(today.toISOString().split('T')[0]);
              }}
              className="min-h-[40px] px-4 flex items-center justify-center border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all duration-300 cursor-pointer bg-white hover:-translate-y-0.5 hover:shadow-sm"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-all duration-300 cursor-pointer border border-slate-200 bg-white hover:-translate-y-0.5 hover:shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1.5 mt-4 text-center flex-1">
          {/* Day tags */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-[10px] font-bold text-slate-400 py-1.5 uppercase tracking-wider">
              {d}
            </div>
          ))}

          {/* Month Boxes */}
          {daysArray.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="bg-slate-50/40 rounded-xl" />;
            }

            const dateStr = getDateString(day);
            const isSelected = selectedDate === dateStr;
            const isToday =
              day === today.getDate() &&
              currentMonth === today.getMonth() &&
              currentYear === today.getFullYear();

            // Count events and tasks
            const dayEvents = events.filter(e => e.date === dateStr);
            const dayTasks = tasks.filter(t => t.dueDate === dateStr);

            return (
              <button
                key={`day-${day}`}
                onClick={() => setSelectedDate(dateStr)}
                className={`relative flex flex-col justify-between items-start p-2 h-[80px] text-left rounded-xl transition-all border duration-150 cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : isToday
                    ? 'border-primary/45 hover:border-primary'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`text-xs font-bold leading-none w-5 h-5 flex items-center justify-center rounded-lg ${
                    isToday ? 'bg-primary text-white font-extrabold shadow-sm' : 'text-slate-800'
                  }`}
                >
                  {day}
                </span>

                {/* Event badging preview inside calendar grid day box */}
                <div className="flex flex-col gap-0.5 w-full mt-1.5 overflow-hidden">
                  {dayEvents.slice(0, 2).map((ev) => (
                    <div
                      key={ev.id}
                      className="text-[8px] font-extrabold truncate px-1 py-0.5 rounded border border-transparent bg-slate-100 text-slate-700"
                    >
                      {ev.title}
                    </div>
                  ))}
                  
                  {/* Indicators if more elements */}
                  <div className="flex gap-1.5 items-center mt-0.5">
                    {dayEvents.length > 2 && (
                      <span className="text-[7px] font-bold text-slate-400">
                        +{dayEvents.length - 2} events
                      </span>
                    )}
                    {dayTasks.length > 0 && (
                      <span className="text-[7px] font-bold text-primary">
                        {dayTasks.filter(t => t.status === 'completed').length}/{dayTasks.length} tasks
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Schedule Details & Inspector Panel */}
      <div className="w-full lg:w-[380px] flex flex-col gap-6 h-[500px] lg:h-auto">
        {/* Schedule Inspector */}
        <div className="glass-panel card-lift rounded-2xl p-5 flex flex-col flex-1 overflow-hidden bg-white">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
            <CalendarDays className="w-4 h-4 text-primary" />
            Schedule Details ({selectedDate})
          </h3>

          <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
            {/* Events Section */}
            <div>
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">
                Events & Meetings
              </h4>
              
              {selectedDayEvents.length === 0 ? (
                <p className="text-xs text-slate-400 italic p-1">
                  No events scheduled.
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedDayEvents.map(ev => (
                    <div
                      key={ev.id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 group"
                    >
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-slate-800 truncate">
                          {ev.title}
                        </h5>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[9px] font-bold text-slate-400 flex items-center gap-0.5">
                            <Clock className="w-3 h-3" /> {ev.time}
                          </span>
                          <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${getCategoryColor(ev.category)}`}>
                            {ev.category}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteEvent(ev.id)}
                        className="p-1 rounded text-slate-400 hover:text-danger hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tasks Due Section */}
            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">
                Tasks Due
              </h4>
              
              {selectedDayTasks.length === 0 ? (
                <p className="text-xs text-slate-400 italic p-1">
                  No tasks due on this date.
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedDayTasks.map(t => (
                    <div
                      key={t.id}
                      className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/50 border border-slate-200"
                    >
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${t.status === 'completed' ? 'text-success' : 'text-slate-300'}`} />
                      <span className={`text-xs font-semibold truncate ${t.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                        {t.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Scheduler Form */}
        <div className="glass-panel card-lift rounded-2xl p-5 bg-white border border-slate-200">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100 mb-3">
            <Plus className="w-4 h-4 text-primary" />
            Schedule Event
          </h3>
          <form onSubmit={handleAddEvent} className="flex flex-col gap-3">
            <Input
              placeholder="e.g. Sync with manager"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              className="text-xs animate-none"
            />
            
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Time"
                type="text"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                placeholder="e.g. 10:00 AM"
                className="text-xs py-1.5 animate-none"
              />
              <Dropdown
                label="Type"
                options={categoryOptions}
                value={eventCategory}
                onChange={(e) => setEventCategory(e.target.value)}
                className="text-xs py-1.5 cursor-pointer"
              />
            </div>

            <Button type="submit" className="text-xs py-1.5 mt-2 bg-primary">
              Add Event
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
