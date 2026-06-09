import React from 'react';
import { X } from 'lucide-react';

// --- BUTTON COMPONENT ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-[10px] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-98 cursor-pointer disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-0.5 min-h-[44px]';
  
  const variants = {
    primary: 'bg-[#2563EB] text-white hover:bg-[#1D4ED8] hover:shadow-md hover:shadow-[#2563EB]/20 focus:ring-[#2563EB]/50 focus:ring-offset-white',
    secondary: 'bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] hover:shadow-md focus:ring-slate-200 focus:ring-offset-white',
    outline: 'bg-transparent border border-slate-200 text-[#0F172A] hover:bg-[#F8FAFC] hover:shadow-sm focus:ring-slate-300 focus:ring-offset-white',
    danger: 'bg-danger text-white hover:bg-[#DC2626] hover:shadow-md hover:shadow-red-500/10 focus:ring-red-500/50 focus:ring-offset-white',
    ghost: 'text-[#0F172A] hover:bg-[#F8FAFC] hover:shadow-sm focus:ring-slate-300 focus:ring-offset-white',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs min-h-[36px]', // override for extremely small areas, but mostly use standard
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- INPUT COMPONENT ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-bold text-slate-500 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all duration-200 ${
            error ? 'border-danger focus:border-danger focus:ring-danger/15' : ''
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-danger font-medium">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

// --- DROPDOWN COMPONENT ---
interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const Dropdown: React.FC<DropdownProps> = ({ label, options, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-bold text-slate-500 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`w-full px-4 py-2 pr-10 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 appearance-none transition-all duration-200 cursor-pointer ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white text-slate-800">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

// --- BADGE COMPONENT ---
interface BadgeProps {
  variant?: 'high' | 'medium' | 'low' | 'info' | 'success' | 'warning' | 'neutral';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children, className = '' }) => {
  const styles = {
    high: 'bg-danger/10 text-danger border border-danger/20',
    medium: 'bg-warning/10 text-warning border border-warning/20',
    low: 'bg-success/10 text-success border border-success/20',
    info: 'bg-primary/10 text-primary border border-primary/20',
    success: 'bg-success/10 text-success border border-success/20',
    warning: 'bg-warning/10 text-warning border border-warning/20',
    neutral: 'bg-slate-100 text-slate-600 border border-slate-200/50',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

// --- DIALOG (MODAL) COMPONENT ---
interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-[#0F172A]">
            {title}
          </h3>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};
