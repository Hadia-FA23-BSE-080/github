import React from 'react';
import { cn } from '@/lib/utils';
import { Button as ShadButton } from './ui/button';
import { Badge as ShadBadge } from './ui/badge';
import { Card as ShadCard, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input as ShadInput } from './ui/input';
import { Loader2, AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

// ============================================================
// BUTTON COMPONENT
// ============================================================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  disabled,
  className = '',
  ...props
}) => {
  // Map our legacy variants to ShadCN button variants
  const shadVariant = 
    variant === 'primary' ? 'default' :
    variant === 'secondary' ? 'secondary' :
    variant === 'ghost' ? 'ghost' :
    variant === 'danger' ? 'destructive' : 'outline'; // Fallback / success mapped to outline with custom styling

  const shadSize = 
    size === 'lg' ? 'lg' : 
    size === 'sm' ? 'sm' : 'default';

  return (
    <ShadButton
      variant={shadVariant}
      size={shadSize}
      disabled={disabled || loading}
      className={cn(
        variant === 'success' && 'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 border-none',
        variant === 'primary' && 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:opacity-95 shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all border-0',
        'active:scale-[0.98] transition-transform duration-100',
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
          {children}
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="mr-1.5 flex items-center">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="ml-1.5 flex items-center">{icon}</span>}
        </>
      )}
    </ShadButton>
  );
};

// ============================================================
// BADGE COMPONENT
// ============================================================
interface BadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  children,
  className = '',
  dot = false,
}) => {
  const badgeClasses = cn(
    'px-2.5 py-0.5 text-xs font-semibold rounded-full border flex items-center gap-1.5 w-fit',
    variant === 'primary' && 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/50',
    variant === 'success' && 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50',
    variant === 'warning' && 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50',
    variant === 'error' && 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50',
    variant === 'info' && 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-900/50',
    className
  );

  const dotColors = {
    primary: 'bg-indigo-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
    info: 'bg-sky-500',
  };

  return (
    <span className={badgeClasses}>
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0 animate-pulse-slow', dotColors[variant])} />
      )}
      {children}
    </span>
  );
};

// ============================================================
// CARD COMPONENT
// ============================================================
interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glass = false,
  hover = false,
  padding = 'md',
  onClick,
}) => {
  const paddingClass = 
    padding === 'none' ? 'p-0' : 
    padding === 'sm' ? 'p-4' : 
    padding === 'lg' ? 'p-8' : 'p-6';

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200',
        glass && 'backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 border-white/30 dark:border-slate-800/40',
        hover && 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer',
        onClick && 'cursor-pointer active:scale-[0.99]',
        paddingClass,
        className
      )}
    >
      {children}
    </div>
  );
};

// ============================================================
// ALERT COMPONENT
// ============================================================
interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  children: React.ReactNode;
  className?: string;
  icon?: string | React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  children,
  className = '',
  icon,
}) => {
  const alertColors = cn(
    'p-4 rounded-xl border flex gap-3 text-sm items-start',
    variant === 'success' && 'bg-emerald-50/70 border-emerald-200/80 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-300',
    variant === 'error' && 'bg-red-50/70 border-red-200/80 text-red-800 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-300',
    variant === 'warning' && 'bg-amber-50/70 border-amber-200/80 text-amber-800 dark:bg-amber-950/20 dark:border-amber-900/50 dark:text-amber-300',
    variant === 'info' && 'bg-indigo-50/70 border-indigo-200/80 text-indigo-800 dark:bg-indigo-950/20 dark:border-indigo-900/50 dark:text-indigo-300',
    className
  );

  const getIcon = () => {
    if (icon) return icon;
    switch (variant) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />;
    }
  };

  return (
    <div className={alertColors}>
      {getIcon()}
      <div className="flex-1 leading-relaxed">{children}</div>
    </div>
  );
};

// ============================================================
// SPINNER COMPONENT
// ============================================================
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  label,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-6', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {label && (
        <p className="text-sm font-medium text-muted-foreground animate-pulse-slow">
          {label}
        </p>
      )}
    </div>
  );
};

// ============================================================
// STAT CARD COMPONENT
// ============================================================
interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode | string;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'cyan';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  change,
  changeType = 'neutral',
  color = 'indigo',
  className = '',
}) => {
  const colorMap = {
    indigo: 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    emerald: 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30 text-amber-600 dark:text-amber-400',
    rose: 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400',
    cyan: 'bg-cyan-50/50 dark:bg-cyan-950/20 border-cyan-100 dark:border-cyan-900/30 text-cyan-600 dark:text-cyan-400',
  };

  return (
    <Card className={cn('card-glow border border-slate-100 dark:border-slate-800/80 p-6', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-grow">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
          <h4 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight text-foreground">{value}</h4>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              <span className={cn(
                'text-xs font-bold px-1.5 py-0.5 rounded-md',
                changeType === 'up' && 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
                changeType === 'down' && 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400',
                changeType === 'neutral' && 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              )}>
                {changeType === 'up' ? '↑' : changeType === 'down' ? '↓' : '→'} {change}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center text-xl border shrink-0', colorMap[color])}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

// ============================================================
// INPUT COMPONENT
// ============================================================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  icon,
  className = '',
  id,
  type = 'text',
  ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-foreground/90 block">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground/80">
            {icon}
          </div>
        )}
        <ShadInput
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            error && 'border-destructive focus-visible:ring-destructive',
            icon && 'pl-10',
            'bg-background border-slate-200 dark:border-slate-800/80 rounded-xl h-11 transition-all',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs font-semibold text-destructive animate-fade-in">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-muted-foreground/80">{hint}</p>
      )}
    </div>
  );
});
Input.displayName = 'Input';

// ============================================================
// MODAL COMPONENT (using ShadCN Dialog)
// ============================================================
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  maxWidth = 'md',
}) => {
  const maxWClasses = {
    sm: 'sm:max-w-md',
    md: 'sm:max-w-lg',
    lg: 'sm:max-w-3xl',
    xl: 'sm:max-w-5xl',
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className={cn(maxWClasses[maxWidth], 'rounded-2xl p-0 gap-0 overflow-hidden bg-card border border-slate-100 dark:border-slate-850 shadow-2xl max-h-[90vh] flex flex-col')}>
        {title && (
          <DialogHeader className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex flex-row items-center justify-between shrink-0">
            <DialogTitle className="text-lg font-bold text-foreground">{title}</DialogTitle>
          </DialogHeader>
        )}
        <div className="p-6 overflow-y-auto flex-1 leading-relaxed">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ============================================================
// EMPTY STATE COMPONENT
// ============================================================
interface EmptyStateProps {
  icon?: string | React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center bg-card/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/80 p-8 max-w-xl mx-auto', className)}>
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-3xl mb-4 border border-indigo-100/50 dark:border-indigo-900/30">
        {icon}
      </div>
      <h3 className="text-base font-bold text-foreground mb-1.5">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">{description}</p>
      )}
      {action && <div className="animate-fade-in">{action}</div>}
    </div>
  );
};

// ============================================================
// SKELETON LOADER COMPONENT
// ============================================================
interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  rounded?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  className = '',
  rounded = false,
}) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-slate-200 dark:bg-slate-800',
        rounded ? 'rounded-full' : 'rounded-md',
        className
      )}
      style={{ width, height }}
    />
  );
};

// ============================================================
// PAGE HEADER COMPONENT
// ============================================================
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumb?: { label: string; onClick?: () => void }[];
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  breadcrumb,
  className = '',
}) => {
  return (
    <div className={cn('mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shrink-0', className)}>
      <div className="space-y-1">
        {breadcrumb && breadcrumb.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80 mb-2">
            {breadcrumb.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span>/</span>}
                <button
                  type="button"
                  onClick={crumb.onClick}
                  disabled={!crumb.onClick}
                  className={cn(
                    'font-medium transition-colors hover:text-foreground focus:outline-none',
                    !crumb.onClick && 'cursor-default pointer-events-none text-muted-foreground/50'
                  )}
                >
                  {crumb.label}
                </button>
              </React.Fragment>
            ))}
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm sm:text-base text-muted-foreground/90 font-medium">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2.5 sm:self-end md:self-center shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};
