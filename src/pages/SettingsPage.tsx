import React, { useState } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { Button, Input } from '../components/UI';
import {
  RotateCcw,
  ShieldAlert,
  Sliders,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetAllData } = usePlanner();

  const [startTime, setStartTime] = useState(settings.workStartTime);
  const [endTime, setEndTime] = useState(settings.workEndTime);
  const [duration, setDuration] = useState(settings.defaultFocusDuration);
  
  const [isSaved, setIsSaved] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ...settings,
      workStartTime: startTime,
      workEndTime: endTime,
      defaultFocusDuration: Number(duration),
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);

    confetti({
      particleCount: 50,
      spread: 30,
      colors: ['#2563EB', '#4F46E5'],
      origin: { x: 0.5, y: 0.6 }
    });
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to clear all custom entries and restore the default mock data?")) {
      resetAllData();
      alert("App data has been reset to defaults.");
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col gap-6 p-8 h-full max-w-[800px] mx-auto w-full overflow-y-auto select-none">
      
      {/* Header Row */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
          Application Settings
        </h2>
        <p className="text-xs font-semibold text-slate-400 mt-1">
          Set default Pomodoro durations, active work hours, and clean storage.
        </p>
      </div>

      {/* Settings Grid panels */}
      <div className="space-y-6">
        
        {/* Productivity Preferences Panel */}
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-secondary" />
            Productivity Preferences
          </h3>

          <form onSubmit={handleSavePreferences} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Day Start Time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <Input
                label="Day End Time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>

            <div className="w-full">
              <label className="block text-xs font-bold text-slate-500 mb-1.5 flex justify-between">
                <span>Default Pomodoro duration</span>
                <span className="font-extrabold text-primary">{duration} minutes</span>
              </label>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1.5">
                <span>10m</span>
                <span>25m</span>
                <span>40m</span>
                <span>60m</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
              {isSaved ? (
                <span className="text-xs font-bold text-success flex items-center gap-1">
                  <Sparkles className="w-4 h-4 fill-success" /> Preferences saved!
                </span>
              ) : (
                <div />
              )}
              <Button type="submit" className="bg-primary px-6">
                Save Preferences
              </Button>
            </div>
          </form>
        </div>

        {/* Database & Reset Storage Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-danger/10 bg-danger/5">
          <h3 className="text-sm font-bold text-danger pb-3 border-b border-danger/10 mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            Danger Zone
          </h3>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-slate-800">Reset Local Database</h4>
              <p className="text-[10px] font-semibold text-slate-500 mt-1 max-w-md">
                Wipes the entire browser localStorage config for this site, restoring all initial mock tasks, events, timer sessions, and habit streaks. This cannot be undone.
              </p>
            </div>
            
            <Button
              type="button"
              variant="danger"
              onClick={handleResetData}
              className="flex items-center gap-1.5 text-xs flex-shrink-0 cursor-pointer shadow-md shadow-danger/10"
            >
              <RotateCcw className="w-4 h-4" /> Reset App Data
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
