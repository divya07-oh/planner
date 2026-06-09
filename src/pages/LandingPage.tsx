import React, { useEffect, useState } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { Button } from '../components/UI';
import {
  TrendingUp,
  CheckSquare,
  Flame,
  Timer,
  FileText,
  BarChart3,
  Calendar,
  Sparkles,
  Zap,
  Target,
  ArrowRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveTab } = usePlanner();
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll to style sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      title: 'Daily Planning',
      description: 'Align workouts, deep work intervals, and reading sessions in a clean timeline view.',
      icon: Calendar,
      color: 'text-primary bg-blue-50',
    },
    {
      title: 'Task Management',
      description: 'A visual Kanban board with drag-and-drop actions to organize tasks by priority and status.',
      icon: CheckSquare,
      color: 'text-success bg-green-50',
    },
    {
      title: 'Habit Tracking',
      description: 'Keep streaks alive, log frequencies, and visualize consistency using a GitHub-style heatmap.',
      icon: Flame,
      color: 'text-warning bg-amber-50',
    },
    {
      title: 'Focus Timer',
      description: 'Pomodoro timer with a clean countdown progress circle and native synthesized audio chime alarms.',
      icon: Timer,
      color: 'text-secondary bg-indigo-50',
    },
    {
      title: 'Notes & Journaling',
      description: 'A two-pane note workspace with debounced auto-saves, tagging, list filters, and markdown layouts.',
      icon: FileText,
      color: 'text-accent bg-sky-50',
    },
    {
      title: 'Productivity Analytics',
      description: 'Deep-dive custom line and bar SVG charts graphing focus duration, task completion, and streaks.',
      icon: BarChart3,
      color: 'text-rose-600 bg-rose-50',
    },
  ];

  const benefits = [
    { title: 'Organize your day', desc: 'Consolidate multiple utilities—calendars, timelines, checklists, timers, and editors—into a single workspace.' },
    { title: 'Stay focused', desc: 'Engage in focused work sessions using customized durations, auto-triggered breaks, and audio signals.' },
    { title: 'Build habits', desc: 'Strengthen daily habits through streak tracking, metrics, and visual progress charts.' },
    { title: 'Track progress', desc: 'Faint grid lines and responsive SVGs trace task completions, focus hours, and weekly metrics.' },
    { title: 'Improve productivity', desc: 'Real-time aggregated efficiency score weights tasks and habits completed to measure daily performance.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      
      {/* Sticky Header Navbar */}
      <nav
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 border-b border-slate-200 shadow-sm backdrop-blur-md py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <button
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-2.5 font-extrabold text-xl tracking-tight text-slate-900 cursor-pointer"
          >
            <div className="bg-primary p-1.5 rounded-xl text-white shadow-md shadow-primary/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span>Planner</span>
          </button>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
            <button onClick={() => scrollToSection('hero')} className="hover:text-primary transition-colors cursor-pointer">Home</button>
            <button onClick={() => scrollToSection('features')} className="hover:text-primary transition-colors cursor-pointer">Features</button>
            <button onClick={() => setActiveTab('Dashboard')} className="hover:text-primary transition-colors cursor-pointer">Dashboard</button>
            <button onClick={() => setActiveTab('Analytics')} className="hover:text-primary transition-colors cursor-pointer">Analytics</button>
          </div>

          <Button
            onClick={() => setActiveTab('Dashboard')}
            className="text-xs font-bold px-4 py-2 shadow-sm"
          >
            Open Planner
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-32 pb-20 px-6 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[85vh]">
        <div className="lg:col-span-6 flex flex-col gap-6 text-left animate-fade-in-up">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-primary px-3 py-1 rounded-full text-xs font-extrabold self-start border border-blue-100">
            <Sparkles className="w-3.5 h-3.5 fill-primary" />
            <span>Introducing Version 1.0</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.05]">
            Plan Better.<br />
            Focus More.<br />
            <span className="text-primary">Achieve More.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
            A personal productivity workspace to manage tasks, habits, focus sessions, notes, and daily planning in one place.
          </p>

          <div className="flex flex-wrap gap-4 items-center mt-2">
            <Button
              onClick={() => setActiveTab('Dashboard')}
              className="px-6 py-3 font-bold flex items-center gap-2 group text-sm shadow-md"
            >
              Open Planner <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="secondary"
              onClick={() => scrollToSection('features')}
              className="px-6 py-3 font-bold text-sm"
            >
              View Features
            </Button>
          </div>
        </div>

        {/* Dashboard Preview Mockup (Right) */}
        <div className="lg:col-span-6 animate-fade-in duration-1000">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-4 md:p-6 w-full max-w-[580px] mx-auto hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 relative">
            {/* Window Dots */}
            <div className="flex gap-1.5 mb-4">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
            </div>

            {/* Mock Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="h-4 w-28 bg-slate-100 rounded" />
              <div className="flex gap-2">
                <div className="h-6 w-6 rounded-full bg-slate-100" />
                <div className="h-6 w-16 bg-slate-100 rounded" />
              </div>
            </div>

            {/* Mock content widgets grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Productivity Score card */}
              <div className="border border-slate-200 rounded-xl p-3 flex flex-col justify-between h-20">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase">Productivity Score</span>
                <div className="flex items-end justify-between">
                  <span className="text-xl font-extrabold text-slate-800">84/100</span>
                  <div className="w-4 h-4 rounded bg-success/15 text-success flex items-center justify-center text-[10px] font-bold">+4%</div>
                </div>
              </div>

              {/* Focus Session logged card */}
              <div className="border border-slate-200 rounded-xl p-3 flex flex-col justify-between h-20">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase">Focus Timer</span>
                <div className="flex items-end justify-between">
                  <span className="text-xl font-extrabold text-slate-800">25:00</span>
                  <div className="w-4 h-4 rounded bg-primary text-white flex items-center justify-center"><PlayChimeIcon className="w-2.5 h-2.5 fill-white" /></div>
                </div>
              </div>

              {/* Tasks list widget preview */}
              <div className="border border-slate-200 rounded-xl p-3 col-span-2 space-y-2">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase block">Today's Tasks</span>
                <div className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-100 rounded-lg">
                  <div className="w-4 h-4 rounded border border-success bg-success flex items-center justify-center text-white text-[8px] font-bold">✓</div>
                  <span className="text-[10px] font-bold text-slate-400 line-through">Complete Planner UI</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 border border-slate-100 rounded-lg">
                  <div className="w-4 h-4 rounded border border-slate-300" />
                  <span className="text-[10px] font-bold text-slate-600">Learn React Hooks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white border-y border-slate-200 px-6">
        <div className="max-w-[1400px] mx-auto text-center flex flex-col items-center gap-4">
          <span className="text-primary font-bold text-xs uppercase tracking-widest">Workspace tools</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-none">
            Everything You Need to Stay Focused
          </h2>
          <p className="text-sm text-slate-500 font-semibold max-w-lg leading-relaxed mt-1.5">
            An integrated SaaS experience combining all your productivity instruments into one workspace window.
          </p>

          {/* Grid of features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mt-12">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="glass-panel p-6 rounded-2xl hover:-translate-y-1 hover:shadow-md transition-all duration-300 text-left card-lift flex flex-col gap-4"
                >
                  <div className={`p-2.5 rounded-xl self-start ${feat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 leading-tight">
                      {feat.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-2">
                      {feat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Productivity Overview Section */}
      <section className="py-24 px-6 max-w-[1400px] mx-auto text-center flex flex-col items-center gap-4">
        <span className="text-primary font-bold text-xs uppercase tracking-widest">Quick metrics</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-none">
          Track Your Progress Instantly
        </h2>
        <p className="text-sm text-slate-500 font-semibold max-w-lg leading-relaxed mt-1.5">
          See a snapshot of your day at a single glance. Real-time scores and streak indices keep you accountable.
        </p>

        {/* Aggregate Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-12">
          {/* Card 1 */}
          <div className="glass-panel p-5 rounded-2xl text-left hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-36">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Today's Tasks</span>
                <h3 className="text-2xl font-extrabold text-slate-800 mt-1.5">8 / 12</h3>
              </div>
              <div className="p-2.5 bg-blue-50 text-primary rounded-xl"><CheckSquare className="w-5 h-5" /></div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#2563EB] h-full rounded-full w-2/3" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-5 rounded-2xl text-left hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-36">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Focus Time</span>
                <h3 className="text-2xl font-extrabold text-slate-800 mt-1.5">3h 45m</h3>
              </div>
              <div className="p-2.5 bg-indigo-50 text-indigo-650 rounded-xl"><Timer className="w-5 h-5" /></div>
            </div>
            <p className="text-[10px] font-bold text-success">+30% focus time logged today</p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-5 rounded-2xl text-left hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-36">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Habit Completion</span>
                <h3 className="text-2xl font-extrabold text-slate-800 mt-1.5">80%</h3>
              </div>
              <div className="p-2.5 bg-amber-50 text-warning rounded-xl"><Flame className="w-5 h-5" /></div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-warning h-full rounded-full w-4/5" />
            </div>
          </div>

          {/* Card 4 */}
          <div className="glass-panel p-5 rounded-2xl text-left hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-36">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Productivity Score</span>
                <h3 className="text-2xl font-extrabold text-slate-800 mt-1.5">84 / 100</h3>
              </div>
              <div className="p-2.5 bg-green-50 text-success rounded-xl"><Zap className="w-5 h-5" /></div>
            </div>
            <p className="text-[10px] font-bold text-success">Excellent progress indicator</p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white border-y border-slate-200 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="text-primary font-bold text-xs uppercase tracking-widest">Why Planner</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              A Structured Approach to Work
            </h2>
            <p className="text-sm text-slate-500 font-semibold leading-relaxed">
              We consolidated multiple productivity methodologies—Kanban task boards, Pomodoro intervals, habit consistency, and reflective note editors—to prevent app switching fatigue.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((ben, idx) => (
              <div key={idx} className="border border-slate-200 p-5 rounded-xl text-left flex flex-col gap-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  {ben.title}
                </h4>
                <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                  {ben.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 text-center bg-gradient-to-r from-primary to-secondary text-white relative">
        <div className="max-w-[800px] mx-auto flex flex-col items-center gap-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-none">
            Start Planning Your Best Days
          </h2>
          <p className="text-sm text-slate-100 opacity-90 font-medium leading-relaxed max-w-lg">
            Create an entry log, define task boards, tick off habits, and measure your focus sessions in real-time.
          </p>
          <Button
            onClick={() => setActiveTab('Dashboard')}
            className="px-8 py-3.5 bg-white text-primary hover:bg-slate-50 font-extrabold text-sm shadow-xl shadow-blue-900/10 active:scale-98 transition-all"
          >
            Open Dashboard
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-slate-400 px-6 border-t border-slate-800">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 font-extrabold text-white text-lg">
              <div className="bg-primary p-1 rounded-lg">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span>Planner</span>
            </div>
            <p className="text-xs mt-2 font-medium">A Premium Personal Productivity Workspace.</p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3.5">
            {/* Social icons */}
            <div className="flex items-center gap-4 text-slate-400">
              <a href="#" className="hover:text-white transition-colors"><TwitterIcon className="w-4 h-4" /></a>
              <a href="#" className="hover:text-white transition-colors"><GithubIcon className="w-4 h-4" /></a>
              <a href="#" className="hover:text-white transition-colors"><LinkedinIcon className="w-4 h-4" /></a>
            </div>
            
            <div className="text-xs font-bold text-slate-400">
              Version 1.0.0 &bull; &copy; {new Date().getFullYear()} Planner. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

// Play icon SVG helper
const PlayChimeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

// Brand SVG icons
const TwitterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const GithubIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
