import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  progress?: {
    current: number;
    total: number;
    colorClass?: string;
  };
  colorClass?: string; // e.g. bg-blue-500, bg-indigo-500
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  progress,
  colorClass = 'text-primary bg-primary/10',
}) => {
  const progressPercent = progress ? Math.min((progress.current / progress.total) * 100, 100) : 0;

  return (
    <div className="glass-panel rounded-2xl p-5 hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between h-full group">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-1 leading-none tracking-tight">
            {value}
          </h3>
        </div>
        
        <div className={`p-2.5 rounded-xl ${colorClass} transition-transform group-hover:scale-110 duration-300 flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div>
        {progress && (
          <div className="mt-3">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-1.5">
              <span>Progress</span>
              <span>{progress.current}/{progress.total} ({Math.round(progressPercent)}%)</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  progress.colorClass || 'bg-primary'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {trend && !progress && (
          <div className="flex items-center gap-1.5 mt-2">
            <span
              className={`text-xs font-bold px-1.5 py-0.5 rounded-lg ${
                trend.isPositive
                  ? 'bg-success/10 text-success'
                  : 'bg-danger/10 text-danger'
              }`}
            >
              {trend.value}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              since last week
            </span>
          </div>
        )}

        {description && !trend && !progress && (
          <p className="text-xs font-medium text-slate-400 mt-2">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
