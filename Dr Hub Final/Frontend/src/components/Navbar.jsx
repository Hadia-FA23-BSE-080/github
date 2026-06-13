import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass-card sticky top-0 z-50 border-b-0 border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-tr from-blue-500 to-purple-500 p-2.5 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] group-hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] transition-all">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Doctor Hub
            </span>
          </Link>
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/dashboard" className="text-slate-300 hover:text-white font-medium transition">Dashboard</Link>
                <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 py-1.5 px-4 rounded-full">
                  <User className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-slate-200 capitalize">{user.name} ({user.role})</span>
                </div>
                <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition hover:scale-110">
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-300 hover:text-white font-medium transition">Sign In</Link>
                <Link to="/register" className="glow-btn text-white px-6 py-2.5 rounded-full font-bold">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
