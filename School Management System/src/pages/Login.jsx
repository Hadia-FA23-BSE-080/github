import React, { useState } from 'react';
import { loadData, saveData } from '../store';
import { School, UserCircle, KeyRound, ArrowRight, Mail, UserPlus, LogIn, ChevronDown, GraduationCap, Users, AlertCircle } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [data, setData] = useState(loadData());
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentClass, setStudentClass] = useState('10A');
  const [rollNo, setRollNo] = useState('');
  const [subject, setSubject] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isRegisterMode) {
      if (!name || !email || !password) {
        setError('Please fill all basic fields.');
        return;
      }
      if (data.users.some(u => u.email === email)) {
        setError('An account with this email already exists.');
        return;
      }

      const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        role,
      };

      if (role === 'student') {
        if (!studentClass || !rollNo) {
          setError('Class and Roll No are required for students.');
          return;
        }
        newUser.class = studentClass;
        newUser.rollNo = rollNo;
        newUser.feeStatus = 'Pending';
      } else if (role === 'teacher') {
        if (!subject) {
          setError('Subject is required for teachers.');
          return;
        }
        newUser.subject = subject;
      }

      const updatedData = { ...data, users: [...data.users, newUser] };
      setData(updatedData);
      saveData(updatedData);
      setSuccess('Registration successful! Please login.');
      setIsRegisterMode(false);
      setPassword('');
    } else {
      // Login Logic
      const user = data.users.find(u => 
        u.email === email &&
        u.password === password
      );

      if (user) {
        onLogin(user);
      } else {
        setError('Invalid email or password!');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-0">
      <div className="w-full h-screen hidden lg:flex lg:w-1/2 relative bg-indigo-900 overflow-hidden items-center justify-center">
        {/* Background Gradients and Ornaments */}
        <div className="absolute top-0 left-0 w-full h-full opacity-40 mix-blend-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-400 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-full opacity-40 mix-blend-screen bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-400 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="relative z-10 p-16 flex flex-col items-start max-w-2xl">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center text-white mb-8 border border-white/20 shadow-2xl">
            <School size={40} />
          </div>
          <h1 className="text-5xl font-black text-white leading-tight tracking-tight mb-6">
            Empowering Education <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-300">Through Technology.</span>
          </h1>
          <p className="text-indigo-100/80 text-lg leading-relaxed mb-12 max-w-lg">
            Welcome to the centralized portal for managing academic excellence. Streamline operations, connect with students, and track performance effortlessly.
          </p>
          <div className="flex gap-4">
             <div className="flex items-center gap-3 bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4">
                <div className="bg-indigo-500/30 p-2 rounded-lg text-indigo-200"><Users size={20} /></div>
                <div><p className="text-xs text-indigo-200/70 font-semibold uppercase tracking-wider">Active Users</p><p className="text-white font-bold">2,400+</p></div>
             </div>
             <div className="flex items-center gap-3 bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4">
                <div className="bg-cyan-500/30 p-2 rounded-lg text-cyan-200"><GraduationCap size={20} /></div>
                <div><p className="text-xs text-cyan-200/70 font-semibold uppercase tracking-wider">Success Rate</p><p className="text-white font-bold">98.5%</p></div>
             </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute top-10 right-10 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="w-full max-w-md bg-white/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/50 relative z-10">
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-500/30">
              <School size={32} />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              {isRegisterMode ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-slate-500 mt-2 font-medium">
              {isRegisterMode ? 'Enter your details to register.' : 'Please enter your credentials to access your account.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegisterMode && (
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Role</label>
                 <div className="grid grid-cols-3 gap-2">
                   {['admin', 'teacher', 'student'].map((r) => (
                     <button
                       type="button"
                       key={r}
                       onClick={() => setRole(r)}
                       className={`py-3 px-3 rounded-xl text-sm font-bold capitalize transition-all duration-300 flex flex-col items-center gap-1 ${
                         role === r 
                         ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-600 ring-offset-2' 
                         : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                       }`}
                     >
                       {r === 'admin' && <KeyRound size={16} />}
                       {r === 'teacher' && <UserCircle size={16} />}
                       {r === 'student' && <GraduationCap size={16} />}
                       {r}
                     </button>
                   ))}
                 </div>
               </div>
            )}

            {isRegisterMode && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                <div className="relative group">
                  <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-700"
                  />
                </div>
              </div>
            )}

            {isRegisterMode && role === 'student' && (
              <div className="flex gap-4">
                <div className="space-y-1 flex-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Class</label>
                  <div className="relative group">
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none" size={20} />
                    <select 
                      value={studentClass}
                      onChange={(e) => setStudentClass(e.target.value)}
                      className="w-full pl-4 pr-10 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer font-medium text-slate-700"
                    >
                      {data.classes.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-1 flex-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Roll No</label>
                  <input 
                    type="text" 
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    placeholder="e.g. 101"
                    className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-700"
                  />
                </div>
              </div>
            )}

            {isRegisterMode && role === 'teacher' && (
               <div className="space-y-1">
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Subject</label>
                 <input 
                   type="text" 
                   value={subject}
                   onChange={(e) => setSubject(e.target.value)}
                   placeholder="e.g. Mathematics"
                   className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-700"
                 />
               </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center mb-1">
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                 {!isRegisterMode && <button type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">Forgot password?</button>}
              </div>
              <div className="relative group">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-700"
                />
              </div>
            </div>

            {error && <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm font-medium flex items-center gap-2"><AlertCircle size={16} />{error}</div>}
            {success && <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">{success}</div>}

            <button 
              type="submit" 
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3 group mt-4"
            >
              {isRegisterMode ? (
                <><UserPlus size={20} /> Create Account</>
              ) : (
                <><LogIn size={20} /> Sign In Securely</>
              )}
              <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
            
            <div className="pt-6 text-center border-t border-slate-100 mt-6">
               <p className="text-slate-500 text-sm font-medium mb-2">{isRegisterMode ? 'Already have an account?' : "Don't have an account?"}</p>
               <button
                 type="button"
                 onClick={() => {
                   setIsRegisterMode(!isRegisterMode);
                   setError('');
                   setSuccess('');
                   setEmail('');
                   setPassword('');
                 }}
                 className="text-sm text-indigo-600 font-bold hover:text-indigo-800 transition-colors px-4 py-2 rounded-lg hover:bg-indigo-50"
               >
                 {isRegisterMode ? 'Sign in instead' : "Create a new account"}
               </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
