import React, { useState } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { Search, Bell, Menu } from 'lucide-react';

interface NavbarProps {
  setIsMobileOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ setIsMobileOpen }) => {
  const {
    activeTab,
    searchQuery,
    setSearchQuery,
  } = usePlanner();

  const [showNotifications, setShowNotifications] = useState(false);

  // Quick list of mock notifications
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Remember to complete your 'Exercise' habit!", read: false, time: '10m ago' },
    { id: 2, text: "Weekly Review task is due in 2 days.", read: false, time: '1h ago' },
    { id: 3, text: "Focus Session 'React Study' (25m) logged successfully.", read: true, time: '3h ago' },
  ]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white border-b border-[#E2E8F0] shadow-sm">
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg font-bold text-slate-900 leading-tight">
            {activeTab}
          </h1>
          <p className="text-[10px] text-slate-400 font-bold hidden sm:block">
            {getFormattedDate()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        {(activeTab === 'Dashboard' || activeTab === 'Tasks' || activeTab === 'Notes') && (
          <div className="relative hidden sm:block w-48 lg:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab === 'Dashboard' ? 'tasks or notes' : activeTab.toLowerCase()}...`}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 focus:border-primary rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-200"
            />
          </div>
        )}

        {/* Notifications Icon & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-sm"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-danger"></span>
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              {/* Overlay click-away layer */}
              <div
                onClick={() => setShowNotifications(false)}
                className="fixed inset-0 z-40 bg-transparent"
              />

              {/* Notification Menu */}
              <div className="absolute right-0 mt-2.5 w-80 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900">Notifications</h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[10px] font-extrabold text-primary hover:text-primary/80 hover:bg-primary/5 px-2 py-1.5 rounded transition-colors cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-4 flex flex-col gap-1 transition-colors ${
                          n.read ? 'bg-transparent' : 'bg-slate-50/50'
                        }`}
                      >
                        <p className="text-xs text-slate-800 font-semibold">
                          {n.text}
                        </p>
                        <span className="text-[9px] text-slate-400 font-extrabold">{n.time}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
