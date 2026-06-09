import React, { useState } from 'react';
import { PlannerProvider, usePlanner } from './context/PlannerContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';

// Page Imports
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { TasksPage } from './pages/TasksPage';
import { CalendarPage } from './pages/CalendarPage';
import { HabitTrackerPage } from './pages/HabitTrackerPage';
import { FocusTimerPage } from './pages/FocusTimerPage';
import { NotesPage } from './pages/NotesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { activeTab } = usePlanner();
  
  // Layout Responsive States
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Render active tab content
  const renderActivePage = () => {
    switch (activeTab) {
      case 'Landing':
        return <LandingPage />;
      case 'Dashboard':
        return <Dashboard />;
      case 'Tasks':
        return <TasksPage />;
      case 'Calendar':
        return <CalendarPage />;
      case 'Habits':
        return <HabitTrackerPage />;
      case 'Focus Timer':
        return <FocusTimerPage />;
      case 'Notes':
        return <NotesPage />;
      case 'Analytics':
        return <AnalyticsPage />;
      case 'Settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  // Full-width Landing Page layout (no sidebar / top header)
  if (activeTab === 'Landing') {
    return (
      <div className="w-screen h-screen overflow-y-auto bg-slate-50 text-slate-900">
        <LandingPage />
      </div>
    );
  }

  // Standard Workspace Layout
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-800">
      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content Workspace Column */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative bg-slate-50">
        <Navbar setIsMobileOpen={setIsMobileOpen} />
        
        {/* Active Page scroll viewport */}
        <main className="flex-1 overflow-hidden relative">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <PlannerProvider>
      <AppContent />
    </PlannerProvider>
  );
}
