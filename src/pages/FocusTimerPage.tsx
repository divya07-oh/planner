import React, { useState, useEffect, useRef } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { Dropdown, Badge } from '../components/UI';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  History,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';

type TimerMode = 'work' | 'short_break' | 'long_break';

export const FocusTimerPage: React.FC = () => {
  const { addSession, sessions, settings } = usePlanner();

  // Mode durations (in minutes)
  const modeDurations: Record<TimerMode, number> = {
    work: settings.defaultFocusDuration,
    short_break: 5,
    long_break: 15,
  };

  const [mode, setMode] = useState<TimerMode>('work');
  const [secondsRemaining, setSecondsRemaining] = useState(modeDurations.work * 60);
  const [isActive, setIsActive] = useState(false);
  const [category, setCategory] = useState('Project Work');

  const timerRef = useRef<any>(null);

  // Sync timer duration if default duration changes in settings
  useEffect(() => {
    if (!isActive) {
      setSecondsRemaining(modeDurations[mode] * 60);
    }
  }, [settings.defaultFocusDuration, mode]);

  // Handle countdown interval
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, mode]);

  // Synthersize pleasant notification tone using Web Audio API
  const playAlarmSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // First chime note (E5)
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
      gain1.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
      osc1.start(audioCtx.currentTime);
      osc1.stop(audioCtx.currentTime + 0.6);

      // Second chime note (A5) 0.15s delayed
      setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880.00, audioCtx.currentTime); // A5
        gain2.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
        osc2.start(audioCtx.currentTime);
        osc2.stop(audioCtx.currentTime + 0.8);
      }, 150);
      
    } catch (e) {
      console.warn("Web Audio API not supported or blocked: ", e);
    }
  };

  const handleTimerComplete = () => {
    setIsActive(false);
    playAlarmSound();
    
    confetti({
      particleCount: 120,
      spread: 70,
      colors: ['#38BDF8', '#4F46E5'],
      origin: { y: 0.6 }
    });

    if (mode === 'work') {
      addSession(modeDurations.work, category);
      // Automatically prompt or shift to break
      setMode('short_break');
      setSecondsRemaining(modeDurations.short_break * 60);
    } else {
      setMode('work');
      setSecondsRemaining(modeDurations.work * 60);
    }
  };

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsRemaining(modeDurations[mode] * 60);
  };

  const handleModeSwitch = (newMode: TimerMode) => {
    setIsActive(false);
    setMode(newMode);
    setSecondsRemaining(modeDurations[newMode] * 60);
  };

  // Format Helper MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Circular progress math
  const totalModeSeconds = modeDurations[mode] * 60;
  const progressRatio = (totalModeSeconds - secondsRemaining) / totalModeSeconds;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressRatio);

  // Focus Stats Calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter(s => s.timestamp.split('T')[0] === todayStr);
  const sessionsTodayCount = todaySessions.length;
  const totalFocusTimeToday = todaySessions.reduce((acc, curr) => acc + curr.duration, 0);
  
  // Weekly hours (past 7 days)
  const totalFocusTimeWeekly = sessions
    .filter(s => {
      const sessDate = new Date(s.timestamp);
      const diffTime = Math.abs(new Date().getTime() - sessDate.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) <= 7;
    })
    .reduce((acc, curr) => acc + curr.duration, 0) / 60;

  const longestSession = sessions.length ? Math.max(...sessions.map(s => s.duration)) : 0;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 flex-1 h-full min-h-0 max-w-[1600px] mx-auto w-full overflow-y-auto select-none">
      
      {/* Timer Container Left */}
      <div className="glass-panel flex-1 rounded-2xl p-6 flex flex-col items-center justify-between min-h-[480px]">
        {/* Mode Switch Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full max-w-sm justify-between">
          {(['work', 'short_break', 'long_break'] as TimerMode[]).map((tab) => (
            <button
              key={tab}
              onClick={() => handleModeSwitch(tab)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl capitalize transition-all duration-200 cursor-pointer ${
                mode === tab
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Circular Clock Countdown visual */}
        <div className="relative my-8 flex items-center justify-center">
          <svg className="w-56 h-56 transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="112"
              cy="112"
              r={radius}
              className="stroke-slate-100 fill-transparent"
              strokeWidth="10"
            />
            {/* Progress ring */}
            <circle
              cx="112"
              cy="112"
              r={radius}
              className={`fill-transparent transition-all duration-300 ${
                mode === 'work' ? 'stroke-primary' : 'stroke-success'
              }`}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>

          {/* Time digits text overlay */}
          <div className="absolute flex flex-col items-center">
            <span className={`text-4xl font-extrabold font-mono tracking-tight leading-none text-slate-800 ${isActive && mode === 'work' ? 'timer-active-pulse' : ''}`}>
              {formatTime(secondsRemaining)}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
              {mode === 'work' ? 'Focus Session' : 'Relax & Recharge'}
            </span>
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center gap-4">
          {/* Test Sound */}
          <button
            onClick={playAlarmSound}
            className="p-3 w-[44px] h-[44px] flex items-center justify-center rounded-2xl bg-slate-100 text-slate-400 hover:text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm cursor-pointer"
            title="Test sound"
          >
            <Volume2 className="w-5 h-5" />
          </button>

          {/* Play / Pause */}
          <button
            onClick={handleStartPause}
            className={`px-7 py-3.5 rounded-2xl text-white font-bold flex items-center gap-2 shadow-lg hover:scale-102 active:scale-98 transition-all cursor-pointer ${
              isActive
                ? 'bg-secondary shadow-secondary/20'
                : 'bg-primary shadow-primary/20'
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-5 h-5 fill-white" /> Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" /> Start Timer
              </>
            )}
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="p-3 w-[44px] h-[44px] flex items-center justify-center rounded-2xl bg-slate-100 text-slate-400 hover:text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm cursor-pointer"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Category Picker widget */}
        <div className="w-full max-w-sm border-t border-slate-200 pt-4 flex flex-col gap-2">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 text-center">
            Currently Working on:
          </label>
          <Dropdown
            options={[
              { value: 'React Study', label: 'React Study' },
              { value: 'Project Work', label: 'Project Work' },
              { value: 'Reading', label: 'Reading' },
              { value: 'Writing', label: 'Writing' },
              { value: 'Coding', label: 'Coding' },
            ]}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-xs text-center"
          />
        </div>
      </div>

      {/* Focus statistics & Session Logs Right */}
      <div className="w-full lg:w-[380px] flex flex-col gap-6">
        {/* Statistics Panels */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            Focus Statistics
          </h3>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Sessions today</span>
              <p className="text-xl font-extrabold text-slate-700 mt-1">
                {sessionsTodayCount}
              </p>
            </div>
            <div className="p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Focus Today</span>
              <p className="text-xl font-extrabold text-slate-700 mt-1">
                {totalFocusTimeToday} min
              </p>
            </div>
            <div className="p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Weekly Hours</span>
              <p className="text-xl font-extrabold text-slate-700 mt-1">
                {totalFocusTimeWeekly.toFixed(1)} hrs
              </p>
            </div>
            <div className="p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Longest Session</span>
              <p className="text-xl font-extrabold text-slate-700 mt-1">
                {longestSession} min
              </p>
            </div>
          </div>
        </div>

        {/* History Session Logs */}
        <div className="glass-panel rounded-2xl p-5 flex-1 flex flex-col h-[320px] lg:h-auto overflow-hidden">
          <h3 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100 flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            Completed Sessions
          </h3>

          <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
            {sessions.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-12">
                No focus logs available yet.
              </p>
            ) : (
              sessions.map((sess) => {
                const logTime = new Date(sess.timestamp).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                });
                return (
                  <div
                    key={sess.id}
                    className="flex justify-between items-center p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 text-xs"
                  >
                    <div>
                      <span className="font-extrabold text-slate-700">
                        {sess.category}
                      </span>
                      <span className="block text-[10px] font-bold text-slate-400 mt-0.5">
                        Completed at {logTime}
                      </span>
                    </div>
                    <Badge variant="info">{sess.duration} min</Badge>
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
