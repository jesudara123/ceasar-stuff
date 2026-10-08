import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variantStyles = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm shadow-indigo-600/20 active:bg-indigo-800',
    secondary: 'bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900 shadow-sm active:bg-slate-950',
    outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-indigo-500 active:bg-slate-100 shadow-xs',
    ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 focus:ring-slate-400',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 shadow-sm shadow-rose-600/20 active:bg-rose-800',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-sm active:bg-emerald-800',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5 font-medium',
    md: 'text-sm px-3.5 py-2 gap-2 font-medium',
    lg: 'text-base px-5 py-2.5 gap-2.5 font-semibold',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
