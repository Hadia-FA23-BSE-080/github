import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X, Sun, Moon, Home, Package, LayoutDashboard, Shield, Users, MessageSquare, CreditCard, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

type NavItem = { id: string; label: string; icon: React.ReactNode };

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { profile: user, signOut } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Apply theme to <html>
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    setMobileOpen(false);
    await signOut();
    setCurrentTab('landing');
  };

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  const navigate = useCallback((tab: string) => {
    setCurrentTab(tab);
    setMobileOpen(false);
  }, [setCurrentTab]);

  // Build nav items based on role
  const navItems: NavItem[] = [
    { id: 'landing', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'products', label: 'Products', icon: <Package className="w-4 h-4" /> },
  ];

  if (user) {
    if (user.role === 'admin') {
      navItems.push({ id: 'admin', label: 'Admin Panel', icon: <Shield className="w-4 h-4" /> });
    } else if (user.role === 'guarantor') {
      navItems.push({ id: 'guarantor', label: 'Guarantor Portal', icon: <Users className="w-4 h-4" /> });
    } else {
      navItems.push(
        { id: 'customer', label: 'My Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'apply', label: 'Apply Now', icon: <CreditCard className="w-4 h-4" /> }
      );
    }
    navItems.push({ id: 'messages', label: 'Chat Support', icon: <MessageSquare className="w-4 h-4" /> });
  }

  // User initials for Avatar
  const initials = user?.full_name
    ? user.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const roleColors: Record<string, string> = {
    admin: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    guarantor: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
    customer: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  };

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60',
        scrolled && 'shadow-sm shadow-slate-900/5 dark:shadow-slate-900/20'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ─── Logo ─── */}
          <button
            onClick={() => navigate('landing')}
            className="flex items-center gap-2 group focus:outline-none"
            aria-label="EasyInstall Home"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow">
              <span className="text-white font-black text-sm">E</span>
            </div>
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
              EasyInstall
            </span>
            <span className="hidden sm:inline px-1.5 py-0.5 text-[9px] font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 rounded-full tracking-widest border border-indigo-200 dark:border-indigo-800">
              FINTECH
            </span>
          </button>

          {/* ─── Desktop Nav Items ─── */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  currentTab === item.id
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60'
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* ─── Right Side Actions ─── */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="h-9 w-9 text-slate-500 dark:text-slate-400"
            >
              {theme === 'light'
                ? <Moon className="w-4 h-4" />
                : <Sun className="w-4 h-4" />
              }
            </Button>

            {user ? (
              <div className="flex items-center gap-3">
                {/* User info */}
                <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200 dark:border-slate-700">
                  <Avatar className="h-8 w-8 ring-2 ring-indigo-500/20">
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">{user.full_name}</p>
                    <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full', roleColors[user.role] || roleColors.customer)}>
                      {user.role}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-xs gap-1.5 border-slate-200 dark:border-slate-700"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => navigate('auth')}
                size="sm"
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow border-0"
              >
                Sign In
              </Button>
            )}
          </div>

          {/* ─── Mobile: Theme + Hamburger ─── */}
          <div className="flex items-center gap-1 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="h-9 w-9"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="h-9 w-9"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Mobile Sheet Drawer ─── */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-80 p-0 flex flex-col">
          <SheetHeader className="px-6 pt-6 pb-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
                  <span className="text-white font-black text-xs">E</span>
                </div>
                <span className="font-extrabold gradient-text">EasyInstall</span>
              </SheetTitle>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMobileOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </SheetHeader>

          <Separator />

          {/* User profile in sheet */}
          {user && (
            <div className="px-4 py-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
                <Avatar className="h-10 w-10 ring-2 ring-indigo-500/20">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-sm font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.full_name}</p>
                  <Badge variant="secondary" className={cn('text-[10px] mt-0.5', roleColors[user.role])}>
                    {user.role}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Nav Items */}
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all duration-150 group',
                  currentTab === item.id
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                )}
              >
                <span className="flex items-center gap-3">
                  {item.icon}
                  {item.label}
                </span>
                <ChevronRight className={cn('w-4 h-4 opacity-0 group-hover:opacity-60 transition-opacity', currentTab === item.id && 'opacity-60')} />
              </button>
            ))}
          </nav>

          <Separator />

          {/* Bottom actions */}
          <div className="px-4 py-4 space-y-2">
            {user ? (
              <Button
                variant="outline"
                className="w-full gap-2 text-sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            ) : (
              <Button
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-0"
                onClick={() => navigate('auth')}
              >
                Sign In / Register
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};
