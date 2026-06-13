import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Access Granted');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication Failed');
    }
  };

  return (
    <div className="flex justify-center items-center py-20 flex-1 relative z-10">
      <div className="glass-card p-10 rounded-3xl w-full max-w-md relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl"></div>
        
        <div className="text-center mb-8 relative z-10">
          <div className="bg-gradient-to-br from-blue-500 to-purple-500 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <LogIn size={28} className="text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Welcome Back</h2>
          <p className="text-slate-400 mt-2 font-light">Secure portal authentication</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Secure Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 glass-input rounded-xl focus:ring-0 focus:border-blue-500" 
              placeholder="doctor@hub.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password Matrix</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 glass-input rounded-xl focus:ring-0 focus:border-blue-500" 
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full glow-btn text-white font-bold py-3.5 rounded-xl text-lg mt-4 flex items-center justify-center gap-2">
            Authenticate Session
          </button>
        </form>

        <div className="mt-6 relative z-10 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 max-h-72 overflow-y-auto">
          <p className="text-sm text-slate-400 mb-3 font-semibold">Demo Credentials (Click to fill):</p>
          
          <div className="space-y-4">
            <div>
              <p className="text-[10px] text-blue-400 uppercase font-bold tracking-wider mb-1.5">Specialists (Doctors)</p>
              <div className="flex flex-wrap gap-1.5">
                <button type="button" onClick={() => {setEmail('sarah@doctorhub.com'); setPassword('any_password_works');}} className="text-[10px] bg-slate-700/40 hover:bg-slate-600/50 text-blue-300 py-1.5 px-2 rounded transition">Dr. Sarah</button>
                <button type="button" onClick={() => {setEmail('bilal@doctorhub.com'); setPassword('any_password_works');}} className="text-[10px] bg-slate-700/40 hover:bg-slate-600/50 text-blue-300 py-1.5 px-2 rounded transition">Dr. Bilal</button>
                <button type="button" onClick={() => {setEmail('luqman@doctorhub.com'); setPassword('any_password_works');}} className="text-[10px] bg-slate-700/40 hover:bg-slate-600/50 text-blue-300 py-1.5 px-2 rounded transition">Hakeem Luqman</button>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-green-400 uppercase font-bold tracking-wider mb-1.5">Active Patients</p>
              <div className="flex flex-wrap gap-1.5">
                <button type="button" onClick={() => {setEmail('john@example.com'); setPassword('any_password_works');}} className="text-[10px] bg-slate-700/40 hover:bg-slate-600/50 text-green-300 py-1.5 px-2 rounded transition">John Doe</button>
                <button type="button" onClick={() => {setEmail('jane@example.com'); setPassword('any_password_works');}} className="text-[10px] bg-slate-700/40 hover:bg-slate-600/50 text-green-300 py-1.5 px-2 rounded transition">Jane Doe</button>
                <button type="button" onClick={() => {setEmail('ahmad@example.com'); setPassword('any_password_works');}} className="text-[10px] bg-slate-700/40 hover:bg-slate-600/50 text-green-300 py-1.5 px-2 rounded transition">Ahmad</button>
                <button type="button" onClick={() => {setEmail('hadia@example.com'); setPassword('any_password_works');}} className="text-[10px] bg-slate-700/40 hover:bg-slate-600/50 text-green-300 py-1.5 px-2 rounded transition">Hadia</button>
                <button type="button" onClick={() => {setEmail('muhammad@example.com'); setPassword('any_password_works');}} className="text-[10px] bg-slate-700/40 hover:bg-slate-600/50 text-green-300 py-1.5 px-2 rounded transition">M. Ali</button>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-purple-400 uppercase font-bold tracking-wider mb-1.5">Clinic Coordinators (Assistants)</p>
              <div className="flex flex-wrap gap-1.5">
                <button type="button" onClick={() => {setEmail('ali@doctorhub.com'); setPassword('any_password_works');}} className="text-[10px] bg-slate-700/40 hover:bg-slate-600/50 text-purple-300 py-1.5 px-2 rounded transition">Ali</button>
                <button type="button" onClick={() => {setEmail('fatima@doctorhub.com'); setPassword('any_password_works');}} className="text-[10px] bg-slate-700/40 hover:bg-slate-600/50 text-purple-300 py-1.5 px-2 rounded transition">Fatima</button>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-orange-400 uppercase font-bold tracking-wider mb-1.5">System Administrators</p>
              <div className="flex flex-wrap gap-1.5">
                <button type="button" onClick={() => {setEmail('admin@doctorhub.com'); setPassword('any_password_works');}} className="text-[10px] bg-slate-700/40 hover:bg-slate-600/50 text-orange-300 py-1.5 px-2 rounded transition">Admin</button>
                <button type="button" onClick={() => {setEmail('superadmin@doctorhub.com'); setPassword('any_password_works');}} className="text-[10px] bg-slate-700/40 hover:bg-slate-600/50 text-orange-300 py-1.5 px-2 rounded transition">Super Admin</button>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-slate-400 relative z-10">
          New to the network? <Link to="/register" className="text-blue-400 font-semibold hover:text-blue-300 transition">Create Account</Link>
        </p>
      </div>
    </div>
  );
}
