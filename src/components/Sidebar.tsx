import React from 'react';
import { usePlanner } from '../context/PlannerContext';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Flame,
  Timer,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Home,
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen,
  setIsMobileOpen,
  isCollapsed,
  setIsCollapsed,
}) => {
  const { activeTab, setActiveTab } = usePlanner();

  const menuItems = [
    { name: 'Home Page', icon: Home, route: 'Landing' },
    { name: 'Dashboard', icon: LayoutDashboard, route: 'Dashboard' },
    { name: 'Tasks', icon: CheckSquare, route: 'Tasks' },
    { name: 'Calendar', icon: Calendar, route: 'Calendar' },
    { name: 'Habits', icon: Flame, route: 'Habits' },
    { name: 'Focus Timer', icon: Timer, route: 'Focus Timer' },
    { name: 'Notes', icon: FileText, route: 'Notes' },
    { name: 'Analytics', icon: BarChart3, route: 'Analytics' },
    { name: 'Settings', icon: Settings, route: 'Settings' },
  ];

  const handleNavClick = (route: string) => {
    setActiveTab(route);
    setIsMobileOpen(false); // Close mobile drawer
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white text-slate-700 border-r border-[#E2E8F0] select-none">
      {/* Header Brand */}
      <div className="flex items-center justify-between p-5 border-b border-slate-100">
        <button
          onClick={() => handleNavClick('Landing')}
          className="flex items-center gap-3 text-left cursor-pointer"
        >
          <div className="bg-primary p-2 rounded-xl flex items-center justify-center text-white shadow-md shadow-primary/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <span className="font-extrabold text-lg tracking-tight text-slate-900">
              Planner
            </span>
          )}
        </button>
        
        {/* Collapse button for desktop */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex w-10 h-10 items-center justify-center rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-sm"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.route;

          return (
            <button
              key={item.name}
              onClick={() => handleNavClick(item.route)}
              className={`w-full min-h-[44px] flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer group relative ${
                isActive
                  ? 'bg-[#EFF6FF] text-[#2563EB] shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-105 duration-200 ${isActive ? 'text-[#64748B]' : 'text-slate-400 group-hover:text-slate-600'}`} />
              
              {!isCollapsed && (
                <span className="truncate">{item.name}</span>
              )}

              {/* Active Tab indicator dot */}
              {isActive && isCollapsed && (
                <div className="absolute right-2 w-1.5 h-1.5 bg-[#2563EB] rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Profile / Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary text-white font-bold text-sm flex items-center justify-center ring-2 ring-slate-100">
            JD
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-extrabold text-slate-800 truncate">John Doe</p>
              <p className="text-[10px] font-bold text-slate-400 truncate">Productive Mode</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed) */}
      <aside 
        className={`hidden md:block h-screen flex-shrink-0 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="h-full fixed z-20">
          <div className={`h-full transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
            {sidebarContent}
          </div>
        </div>
      </aside>

      {/* Mobile Drawer (Overlay) */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-slate-900/35 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="relative flex flex-col w-64 max-w-xs h-full bg-white shadow-2xl animate-in slide-in-from-left duration-250 z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
