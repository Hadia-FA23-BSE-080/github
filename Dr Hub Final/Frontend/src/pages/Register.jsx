import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'patient', phone: ''
  });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData.name, formData.email, formData.password, formData.role, formData.phone);
      toast.success('Identity Registered');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration Failed');
    }
  };

  return (
    <div className="flex justify-center items-center py-12 flex-1 relative z-10">
      <div className="glass-card p-10 rounded-3xl w-full max-w-md relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="bg-gradient-to-br from-purple-500 to-blue-500 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            <UserPlus size={28} className="text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Join Network</h2>
          <p className="text-slate-400 mt-2 font-light">Create your secure identity</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
            <input type="text" name="name" required onChange={handleChange} className="w-full px-4 py-2.5 glass-input rounded-xl focus:border-blue-500" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Secure Email</label>
            <input type="email" name="email" required onChange={handleChange} className="w-full px-4 py-2.5 glass-input rounded-xl focus:border-blue-500" placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password Matrix</label>
            <input type="password" name="password" required onChange={handleChange} className="w-full px-4 py-2.5 glass-input rounded-xl focus:border-blue-500" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Contact Line</label>
            <input type="text" name="phone" onChange={handleChange} className="w-full px-4 py-2.5 glass-input rounded-xl focus:border-blue-500" placeholder="+92 300 0000000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Clearance Level (Role)</label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2.5 glass-input rounded-xl focus:border-blue-500 appearance-none bg-slate-800">
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="assistant">Assistant</option>
            </select>
          </div>
          <button type="submit" className="w-full glow-btn text-white font-bold py-3.5 rounded-xl text-lg mt-6">
            Initialize Account
          </button>
        </form>
        <p className="mt-8 text-center text-slate-400 relative z-10">
          Already active? <Link to="/login" className="text-purple-400 font-semibold hover:text-purple-300 transition">Access Portal</Link>
        </p>
      </div>
    </div>
  );
}
