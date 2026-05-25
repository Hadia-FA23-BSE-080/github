import React, { useState } from 'react';
import { loadData, saveData } from '../store';
import { Users, BookOpen, GraduationCap, UserPlus, LogOut, DollarSign, FileText, Calendar, Trash2, Edit, Upload, LayoutDashboard, Activity, Bell, Search } from 'lucide-react';

const AdminDashboard = ({ user, onLogout }) => {
  const [data, setData] = useState(loadData());
  const [activeTab, setActiveTab] = useState('overview');

  const teachers = data.users.filter(u => u.role === 'teacher');
  const students = data.users.filter(u => u.role === 'student');

  // Form States
  const [newStudent, setNewStudent] = useState({ name: '', class: '10A', rollNo: '', feeStatus: 'Pending', email: '', password: '123' });
  const [newTeacher, setNewTeacher] = useState({ name: '', subject: '', email: '', password: '123' });
  const [newClass, setNewClass] = useState({ id: '', name: '', feeAmount: '' });
  const [newTimetable, setNewTimetable] = useState({ classId: '', day: 'Monday', subject: '', teacherName: '', time: '' });
  
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [editingClassId, setEditingClassId] = useState(null);

  const [timetableMode, setTimetableMode] = useState('manage');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [editSlotData, setEditSlotData] = useState(null);

  const TIME_SLOTS = ["08:30 - 10:00 AM", "10:00 - 11:30 AM", "11:30 - 01:00 PM", "01:30 - 03:00 PM", "03:00 - 04:30 PM", "04:30 - 06:00 PM"];
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Free Slots Explorer State
  const [explorerType, setExplorerType] = useState('teacher'); // 'teacher' or 'class'
  const [explorerDay, setExplorerDay] = useState('Monday');
  const [explorerSlot, setExplorerSlot] = useState(TIME_SLOTS[0]);

  const handleCellClick = (classId, day, time) => {
    const existing = data.timetable.find(t => t.classId === classId && t.day === day && t.time === time);
    if (existing) {
       setEditSlotData(existing);
    } else {
       setEditSlotData({ id: Date.now() + Math.random(), classId, day, time, subject: '', teacherName: '' });
    }
  };

  const saveTimetableSlot = (e) => {
    e.preventDefault();
    const updated = { ...data };
    updated.timetable = updated.timetable.filter(t => t.id !== editSlotData.id);
    if (editSlotData.subject && editSlotData.teacherName) {
       updated.timetable.push(editSlotData);
    }
    setData(updated);
    saveData(updated);
    setEditSlotData(null);
  };

  const deleteTimetableSlot = () => {
    const updated = { ...data };
    updated.timetable = updated.timetable.filter(t => t.id !== editSlotData.id);
    setData(updated);
    saveData(updated);
    setEditSlotData(null);
  };

  const handleSaveStudent = (e) => {
    e.preventDefault();
    const updated = { ...data };
    if (editingStudentId) {
      updated.users = updated.users.map(u => u.id === editingStudentId ? { ...newStudent, id: editingStudentId, role: 'student' } : u);
      setEditingStudentId(null);
    } else {
      updated.users.push({ ...newStudent, id: Date.now(), role: 'student' });
    }
    setData(updated);
    saveData(updated);
    setNewStudent({ name: '', class: '10A', rollNo: '', feeStatus: 'Pending', email: '', password: '123' });
  };

  const handleSaveTeacher = (e) => {
    e.preventDefault();
    const updated = { ...data };
    if (editingTeacherId) {
      updated.users = updated.users.map(u => u.id === editingTeacherId ? { ...newTeacher, id: editingTeacherId, role: 'teacher' } : u);
      setEditingTeacherId(null);
    } else {
      updated.users.push({ ...newTeacher, id: Date.now(), role: 'teacher' });
    }
    setData(updated);
    saveData(updated);
    setNewTeacher({ name: '', subject: '', email: '', password: '123' });
  };

  const handleSaveClass = (e) => {
    e.preventDefault();
    if (!newClass.id || !newClass.name || !newClass.feeAmount) return;
    const updated = { ...data };
    
    if (editingClassId) {
      updated.classes = updated.classes.map(c => c.id === editingClassId ? { id: newClass.id, name: newClass.name, feeAmount: Number(newClass.feeAmount) } : c);
      setEditingClassId(null);
    } else {
      if (updated.classes.find(c => c.id === newClass.id)) {
         alert("A class with this ID already exists.");
         return;
      }
      updated.classes.push({
         id: newClass.id,
         name: newClass.name,
         feeAmount: Number(newClass.feeAmount)
      });
    }
    
    setData(updated);
    saveData(updated);
    setNewClass({ id: '', name: '', feeAmount: '' });
  };

  const editClass = (c) => {
    setNewClass({ ...c, feeAmount: c.feeAmount.toString() });
    setEditingClassId(c.id);
  };

  const deleteClass = (id) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;
    const updated = { ...data };
    updated.classes = updated.classes.filter(c => c.id !== id);
    setData(updated);
    saveData(updated);
  };

  // Replaced with inline modal logic

  const editStudent = (st) => {
    setNewStudent({ ...st });
    setEditingStudentId(st.id);
  };

  const editTeacher = (t) => {
    setNewTeacher({ ...t });
    setEditingTeacherId(t.id);
  };

  const deleteUser = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    const updated = { ...data };
    updated.users = updated.users.filter(u => u.id !== id);
    setData(updated);
    saveData(updated);
  };

  const handleCsvUpload = (e, role) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split('\n').map(row => row.trim()).filter(row => row);
      
      if (rows.length < 2) {
        alert("File seems empty or missing data rows.");
        return;
      }
      
      const newUsers = [];
      const updated = { ...data };
      
      // Skip header row at index 0
      for (let i = 1; i < rows.length; i++) {
        const cols = rows[i].split(',').map(c => c.trim());
        
        if (role === 'student' && cols.length >= 6) {
           newUsers.push({
              id: Date.now() + i,
              role: 'student',
              name: cols[0],
              email: cols[1],
              class: cols[2],
              rollNo: cols[3],
              feeStatus: cols[4],
              password: cols[5]
           });
        } else if (role === 'teacher' && cols.length >= 4) {
           newUsers.push({
              id: Date.now() + i,
              role: 'teacher',
              name: cols[0],
              email: cols[1],
              subject: cols[2],
              password: cols[3]
           });
        }
      }

      if (newUsers.length > 0) {
        updated.users = [...updated.users, ...newUsers];
        setData(updated);
        saveData(updated);
        alert(`Successfully imported ${newUsers.length} ${role}s!`);
      } else {
        alert("No valid rows found. Please check CSV format.");
      }
      e.target.value = null; // reset input
    };
    reader.readAsText(file);
  };

  const handleGenerateReport = () => {
     window.print();
  };

  const notices = data.notices || [];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Premium Sidebar */}
      <div className="w-72 bg-[#0f172a] text-slate-300 flex flex-col shadow-2xl z-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-blue-500/10 pointer-events-none"></div>
        <div className="p-6 border-b border-white/10 flex items-center gap-4 relative z-10">
          <div className="bg-gradient-to-tr from-indigo-500 to-blue-500 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-500/30">
            <GraduationCap size={24} />
          </div>
          <div>
            <h2 className="font-black text-xl text-white tracking-tight">EduAdmin</h2>
            <p className="text-xs text-indigo-300 font-bold tracking-wider uppercase mt-0.5">{user.name}</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto relative z-10 custom-scrollbar">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Dashboard Overview' },
            { id: 'students', icon: Users, label: 'Manage Students' },
            { id: 'teachers', icon: UserPlus, label: 'Manage Teachers' },
            { id: 'classes', icon: GraduationCap, label: 'Manage Classes' },
            { id: 'fees', icon: DollarSign, label: 'Fee Structure' },
            { id: 'timetable', icon: Calendar, label: 'Timetable' },
            { id: 'free-slots', icon: Search, label: 'Free Slots Explorer' },
            { id: 'reports', icon: FileText, label: 'Generate Reports' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-bold capitalize text-left group
                ${activeTab === tab.id 
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/25 ring-1 ring-white/20' 
                  : 'hover:bg-white/5 hover:text-white'}`}
            >
              <tab.icon size={20} className={activeTab === tab.id ? 'text-white' : 'text-slate-400 group-hover:text-indigo-300 transition-colors'} /> 
              <span className="text-sm tracking-wide">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 relative z-10">
          <button 
            onClick={onLogout} 
            className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl transition-all font-bold text-left"
          >
            <LogOut size={20} /> Secure Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto relative">
         {/* Background ambient light */}
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400/5 rounded-full filter blur-3xl pointer-events-none"></div>

        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 animate-fade-in relative z-10 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-gradient-to-tr from-indigo-100 to-blue-100 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner border border-indigo-200/50">
                 {user.name.charAt(0)}
              </div>
              <div>
                 <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                    Admin Control Center
                 </h1>
                 <div className="flex items-center gap-3 mt-1.5 text-sm font-bold text-slate-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><Activity size={16} className="text-emerald-500" /> System Online</span>
                 </div>
              </div>
           </div>
        </header>

        {activeTab === 'overview' && (
           <div className="space-y-6 animate-fade-in relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 {/* Quick Stat 1 */}
                 <div onClick={() => setActiveTab('students')} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between cursor-pointer hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                       <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform"><Users size={24} /></div>
                    </div>
                    <div>
                       <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Total Students</h3>
                       <div className="flex items-end gap-2">
                          <p className="text-4xl font-black text-slate-800">{students.length}</p>
                       </div>
                    </div>
                 </div>

                 {/* Quick Stat 2 */}
                 <div onClick={() => setActiveTab('teachers')} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between cursor-pointer hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                       <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600 group-hover:scale-110 transition-transform"><UserPlus size={24} /></div>
                    </div>
                    <div>
                       <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Active Faculty</h3>
                       <div className="flex items-end gap-2">
                          <p className="text-4xl font-black text-slate-800">{teachers.length}</p>
                       </div>
                    </div>
                 </div>

                 {/* Quick Stat 3 */}
                 <div onClick={() => setActiveTab('classes')} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between cursor-pointer hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                       <div className="bg-purple-50 p-3 rounded-2xl text-purple-600 group-hover:scale-110 transition-transform"><BookOpen size={24} /></div>
                    </div>
                    <div>
                       <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Total Classes</h3>
                       <div className="flex items-end gap-2">
                          <p className="text-4xl font-black text-slate-800">{data.classes.length}</p>
                       </div>
                    </div>
                 </div>

                 {/* Quick Stat 4 */}
                 <div onClick={() => setActiveTab('timetable')} className="bg-gradient-to-br from-indigo-600 to-blue-600 p-6 rounded-3xl shadow-lg flex flex-col justify-between cursor-pointer hover:shadow-xl transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full pointer-events-none"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                       <div className="bg-white/20 p-3 rounded-2xl text-white group-hover:scale-110 transition-transform"><Calendar size={24} /></div>
                    </div>
                    <div className="relative z-10">
                       <h3 className="text-indigo-200 text-sm font-bold uppercase tracking-wider mb-1">Scheduled Slots</h3>
                       <div className="flex items-end gap-2">
                          <p className="text-4xl font-black text-white">{data.timetable.length}</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Notice Board Preview */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                 <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                       <div className="bg-indigo-100 text-indigo-600 p-2 rounded-xl"><Bell size={20} /></div>
                       <h3 className="font-bold text-lg text-slate-800">Global Announcements</h3>
                    </div>
                    <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800">Manage</button>
                 </div>
                 <div className="p-6">
                    {notices.length === 0 ? (
                       <p className="text-slate-500 text-center py-8">No announcements available.</p>
                    ) : (
                       <div className="space-y-4">
                          {notices.map(notice => (
                             <div key={notice.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between hover:bg-white hover:shadow-md transition-all">
                                <div>
                                   <div className="flex items-center gap-3 mb-1">
                                      <h4 className="font-bold text-slate-800">{notice.title}</h4>
                                      <span className="text-[10px] font-bold text-slate-400 bg-slate-200/50 px-2 py-0.5 rounded-lg">
                                         {new Date(notice.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                      </span>
                                   </div>
                                   <p className="text-sm text-slate-600">{notice.content}</p>
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 whitespace-nowrap bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">By {notice.author}</span>
                             </div>
                          ))}
                       </div>
                    )}
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'students' && (
          <div className="space-y-6 animate-fade-in">
            {/* Save Student Form */}
            <form onSubmit={handleSaveStudent} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-5 gap-4 items-end">
               <div className="col-span-5 flex justify-between items-end mb-2 border-b pb-2">
                 <div>
                   <h3 className="font-bold text-lg">{editingStudentId ? 'Edit Student' : 'Add New Student'}</h3>
                   {!editingStudentId && <p className="text-[10px] text-slate-400 mt-1">CSV Format: Name, Email, Class, RollNo, FeeStatus, Password</p>}
                 </div>
                 <div className="flex gap-3 items-center">
                   {!editingStudentId && (
                     <label className="text-xs flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-emerald-100 font-bold transition mr-2 mb-1">
                        <Upload size={14} /> Bulk Import CSV
                        <input type="file" accept=".csv" className="hidden" onChange={(e) => handleCsvUpload(e, 'student')} />
                     </label>
                   )}
                   {editingStudentId && (
                     <button type="button" onClick={() => { setEditingStudentId(null); setNewStudent({ name: '', class: '10A', rollNo: '', feeStatus: 'Pending', email: '', password: '123' }); }} className="text-xs text-slate-500 hover:text-slate-800">Cancel Edit</button>
                   )}
                 </div>
               </div>
               <div>
                  <label className="block text-xs font-semibold mb-1">Name</label>
                  <input required value={newStudent.name} onChange={e=>setNewStudent({...newStudent, name:e.target.value})} className="w-full border rounded p-2 text-sm" placeholder="e.g. Ali" />
               </div>
               <div>
                  <label className="block text-xs font-semibold mb-1">Email</label>
                  <input required type="email" value={newStudent.email} onChange={e=>setNewStudent({...newStudent, email:e.target.value})} className="w-full border rounded p-2 text-sm" placeholder="ali@test.com" />
               </div>
               <div>
                  <label className="block text-xs font-semibold mb-1">Class</label>
                  <select value={newStudent.class} onChange={e=>setNewStudent({...newStudent, class:e.target.value})} className="w-full border rounded p-2 text-sm">
                     {data.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
               </div>
               <div>
                  <label className="block text-xs font-semibold mb-1">Roll No / Fee</label>
                  <div className="flex gap-2">
                     <input required value={newStudent.rollNo} onChange={e=>setNewStudent({...newStudent, rollNo:e.target.value})} className="w-1/2 border rounded p-2 text-sm" placeholder="Ro. 99" />
                     <select value={newStudent.feeStatus} onChange={e=>setNewStudent({...newStudent, feeStatus:e.target.value})} className="w-1/2 border rounded p-2 text-sm">
                        <option>Paid</option><option>Pending</option>
                     </select>
                  </div>
               </div>
               <div>
                  <button type="submit" className="w-full bg-indigo-600 text-white rounded p-2 text-sm font-bold hover:bg-indigo-700 transition">
                    {editingStudentId ? 'Update Student' : 'Add Student'}
                  </button>
               </div>
            </form>

            <div className="bg-white shadow-sm rounded-2xl border border-slate-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-sm font-semibold border-b border-slate-200">
                    <th className="p-4">Name</th>
                    <th className="p-4">Roll No</th>
                    <th className="p-4">Class</th>
                    <th className="p-4">Attendance</th>
                    <th className="p-4">Fee Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((st) => {
                    const studentAttendance = data.attendance.filter(a => a.classId === st.class)
                      .map(a => {
                        const record = a.records.find(r => r.studentId === st.id);
                        return record ? record.status : 'N/A';
                      }).filter(s => s !== 'N/A');
                    const totalClasses = studentAttendance.length;
                    const presentClasses = studentAttendance.filter(s => s === 'Present').length;
                    const attPerc = totalClasses > 0 ? ((presentClasses / totalClasses) * 100).toFixed(0) + '%' : 'No Data';

                    return (
                      <tr key={st.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="p-4 font-medium text-slate-800 flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">{st.name.charAt(0)}</div>
                           {st.name} <br/><span className="text-xs text-slate-400 font-normal">{st.email}</span>
                        </td>
                        <td className="p-4 text-slate-600">{st.rollNo}</td>
                        <td className="p-4 text-slate-600"><span className="bg-slate-100 px-2 py-1 rounded-md text-xs font-semibold">{st.class}</span></td>
                        <td className="p-4 font-bold text-indigo-600">{attPerc}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${st.feeStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {st.feeStatus}
                          </span>
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2">
                           <button onClick={() => editStudent(st)} className="text-indigo-500 hover:bg-indigo-50 p-2 rounded-lg transition"><Edit size={18} /></button>
                           <button onClick={() => deleteUser(st.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'teachers' && (
          <div className="space-y-6 animate-fade-in">
            {/* Save Teacher Form */}
            <form onSubmit={handleSaveTeacher} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-4 gap-4 items-end">
               <div className="col-span-4 flex justify-between items-end mb-2 border-b pb-2">
                 <div>
                   <h3 className="font-bold text-lg">{editingTeacherId ? 'Edit Teacher' : 'Add New Teacher'}</h3>
                   {!editingTeacherId && <p className="text-[10px] text-slate-400 mt-1">CSV Format: Name, Email, Subject, Password</p>}
                 </div>
                 <div className="flex gap-3 items-center">
                   {!editingTeacherId && (
                     <label className="text-xs flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-emerald-100 font-bold transition mr-2 mb-1">
                        <Upload size={14} /> Bulk Import CSV
                        <input type="file" accept=".csv" className="hidden" onChange={(e) => handleCsvUpload(e, 'teacher')} />
                     </label>
                   )}
                   {editingTeacherId && (
                     <button type="button" onClick={() => { setEditingTeacherId(null); setNewTeacher({ name: '', subject: '', email: '', password: '123' }); }} className="text-xs text-slate-500 hover:text-slate-800">Cancel Edit</button>
                   )}
                 </div>
               </div>
               <div>
                  <label className="block text-xs font-semibold mb-1">Name</label>
                  <input required value={newTeacher.name} onChange={e=>setNewTeacher({...newTeacher, name:e.target.value})} className="w-full border rounded p-2 text-sm" placeholder="e.g. John" />
               </div>
               <div>
                  <label className="block text-xs font-semibold mb-1">Email</label>
                  <input required type="email" value={newTeacher.email} onChange={e=>setNewTeacher({...newTeacher, email:e.target.value})} className="w-full border rounded p-2 text-sm" placeholder="john@test.com" />
               </div>
               <div>
                  <label className="block text-xs font-semibold mb-1">Subject</label>
                  <input required value={newTeacher.subject} onChange={e=>setNewTeacher({...newTeacher, subject:e.target.value})} className="w-full border rounded p-2 text-sm" placeholder="e.g. Physics" />
               </div>
               <div>
                  <button type="submit" className="w-full bg-cyan-600 text-white rounded p-2 text-sm font-bold hover:bg-cyan-700 transition">
                    {editingTeacherId ? 'Update Teacher' : 'Add Teacher'}
                  </button>
               </div>
            </form>

            <div className="bg-white shadow-sm rounded-2xl border border-slate-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-sm font-semibold border-b border-slate-200">
                    <th className="p-4">Teacher Name</th>
                    <th className="p-4">Subject Expertise</th>
                    <th className="p-4">Activity (Registers Marked)</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((t) => {
                    const registersTaken = data.attendance.filter(a => a.teacherId === t.id).length;
                    
                    return (
                      <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="p-4 font-medium text-slate-800 flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-xs">{t.name.charAt(0)}</div>
                           {t.name} <br/><span className="text-xs text-slate-400 font-normal">{t.email}</span>
                        </td>
                        <td className="p-4 text-slate-600"><span className="bg-cyan-50 text-cyan-700 px-2 py-1 rounded-md text-xs font-semibold">{t.subject}</span></td>
                        <td className="p-4 font-bold text-slate-600">{registersTaken > 0 ? `${registersTaken} Classes Logged` : '0 Activity'}</td>
                        <td className="p-4 text-right flex justify-end gap-2">
                           <button onClick={() => editTeacher(t)} className="text-indigo-500 hover:bg-indigo-50 p-2 rounded-lg transition"><Edit size={18} /></button>
                           <button onClick={() => deleteUser(t.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Classes & Fees */}
        {(activeTab === 'classes' || activeTab === 'fees') && (
           <div className="space-y-6 animate-fade-in">
             <form onSubmit={handleSaveClass} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-4 gap-4 items-end">
                <div className="col-span-4 mb-2 border-b pb-2 flex justify-between items-center">
                  <h3 className="font-bold text-lg">{editingClassId ? 'Edit Class/Fee' : 'Add New Class'}</h3>
                  {editingClassId && (
                    <button type="button" onClick={() => { setEditingClassId(null); setNewClass({ id: '', name: '', feeAmount: '' }); }} className="text-xs text-slate-500 hover:text-slate-800">Cancel Edit</button>
                  )}
                </div>
                <div>
                   <label className="block text-xs font-semibold mb-1">Class ID (e.g. 10A)</label>
                   <input required value={newClass.id} onChange={e=>setNewClass({...newClass, id:e.target.value.toUpperCase()})} className="w-full border rounded p-2 text-sm" placeholder="10A" disabled={!!editingClassId} />
                </div>
                <div>
                   <label className="block text-xs font-semibold mb-1">Class Name</label>
                   <input required value={newClass.name} onChange={e=>setNewClass({...newClass, name:e.target.value})} className="w-full border rounded p-2 text-sm" placeholder="Class 10 Section A" />
                </div>
                <div>
                   <label className="block text-xs font-semibold mb-1">Monthly Fee (Rs.)</label>
                   <input required type="number" value={newClass.feeAmount} onChange={e=>setNewClass({...newClass, feeAmount:e.target.value})} className="w-full border rounded p-2 text-sm" placeholder="5000" />
                </div>
                <div>
                   <button type="submit" className="w-full bg-purple-600 text-white rounded p-2 text-sm font-bold hover:bg-purple-700 transition">
                     {editingClassId ? 'Update Class' : 'Add Class'}
                   </button>
                </div>
             </form>

             <div className="bg-white shadow-sm rounded-2xl border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100"><h3 className="font-bold text-lg">School Classes & Fee Structures</h3></div>
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-slate-50 text-slate-500 text-sm font-semibold border-b border-slate-200">
                         <th className="p-4">Class ID</th>
                         <th className="p-4">Class Title</th>
                         <th className="p-4 text-right">Monthly Fee Amount</th>
                         <th className="p-4 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody>
                      {data.classes.map(c => (
                         <tr key={c.id} className="border-b border-slate-100 px-4 hover:bg-slate-50/50">
                            <td className="p-4 font-bold text-indigo-600">{c.id}</td>
                            <td className="p-4 font-medium text-slate-700">{c.name}</td>
                            <td className="p-4 text-right text-emerald-600 font-bold">Rs. {c.feeAmount}</td>
                            <td className="p-4 text-right flex justify-end gap-2">
                               <button onClick={() => editClass(c)} className="text-indigo-500 hover:bg-indigo-50 p-2 rounded-lg transition"><Edit size={18} /></button>
                               <button onClick={() => deleteClass(c.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"><Trash2 size={18} /></button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
           </div>
        )}

        {/* Timetable */}
        {activeTab === 'timetable' && (
           <div className="space-y-12 animate-fade-in pb-12">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                 <div>
                    <h2 className="text-xl font-bold text-slate-800">Centralized Timetable</h2>
                    <p className="text-sm text-slate-500">Click any slot to assign a subject and teacher.</p>
                 </div>
              </div>

              {data.classes.map(cls => (
                 <div key={cls.id} className="bg-white shadow-md rounded-xl border border-slate-200 overflow-hidden">
                    <div className="bg-slate-800 text-white p-4 text-center border-b-4 border-indigo-500">
                       <h3 className="font-bold text-2xl tracking-widest">{cls.name} ({cls.id})</h3>
                       <p className="text-xs text-slate-300 mt-1 uppercase tracking-widest">Spring / Fall Session</p>
                    </div>
                    <div className="overflow-x-auto">
                       <table className="w-full text-center border-collapse table-fixed min-w-[900px]">
                          <thead>
                             <tr>
                                <th className="border-b border-r border-slate-300 bg-slate-100 p-2 w-20 text-xs font-bold text-slate-600">Day / Time</th>
                                {TIME_SLOTS.map((time, i) => (
                                   <React.Fragment key={time}>
                                      <th className="border-b border-r border-slate-300 bg-slate-50 p-2 text-[11px] font-bold text-slate-700 w-32">{time}</th>
                                      {i === 2 && <th className="border-b border-r border-slate-300 bg-slate-200 p-2 w-12 text-[10px] uppercase text-slate-500 tracking-widest">Break</th>}
                                   </React.Fragment>
                                ))}
                             </tr>
                          </thead>
                          <tbody>
                             {DAYS.map(day => (
                                <tr key={day}>
                                   <td className="border-b border-r border-slate-300 bg-slate-50 p-2 font-bold text-slate-700 text-xs h-24 uppercase tracking-wider origin-center">
                                      <div className="-rotate-90 sm:rotate-0">{day}</div>
                                   </td>
                                   {TIME_SLOTS.map((time, i) => {
                                      const slot = data.timetable.find(t => t.classId === cls.id && t.day === day && t.time === time);
                                      return (
                                         <React.Fragment key={time}>
                                            <td 
                                               onClick={() => handleCellClick(cls.id, day, time)}
                                               className="border-b border-r border-slate-300 p-2 cursor-pointer hover:bg-indigo-50 transition-colors relative group h-24 align-middle bg-white"
                                            >
                                               {slot ? (
                                                  <div className="flex flex-col items-center justify-center h-full gap-1">
                                                     <span className="font-bold text-slate-800 text-[13px] leading-tight px-1">{slot.subject}</span>
                                                     <span className="text-[11px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">{slot.teacherName}</span>
                                                  </div>
                                               ) : (
                                                  <div className="text-slate-300 text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity font-bold">Assign</div>
                                               )}
                                            </td>
                                            {i === 2 && <td className="border-b border-r border-slate-300 bg-slate-100/50"></td>}
                                         </React.Fragment>
                                      )
                                   })}
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
              ))}

              {/* Edit Slot Modal */}
              {editSlotData && (
                 <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <form onSubmit={saveTimetableSlot} className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-fade-in border border-slate-200">
                       <div className="p-5 border-b border-slate-100 bg-slate-50">
                          <h3 className="font-bold text-lg text-slate-800">Edit Class Slot</h3>
                          <p className="text-xs text-slate-500 mt-1">{editSlotData.day} &bull; {editSlotData.time} &bull; Class {editSlotData.classId}</p>
                       </div>
                       <div className="p-5 space-y-4">
                          <div>
                             <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                             <input 
                                required 
                                value={editSlotData.subject} 
                                onChange={e => setEditSlotData({...editSlotData, subject: e.target.value})} 
                                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                                placeholder="e.g. Data Structures" 
                             />
                          </div>
                          <div>
                             <label className="block text-xs font-bold text-slate-700 mb-1">Teacher</label>
                             <select 
                                required 
                                value={editSlotData.teacherName} 
                                onChange={e => setEditSlotData({...editSlotData, teacherName: e.target.value})} 
                                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                             >
                                <option value="" disabled>Select Teacher</option>
                                {teachers.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                             </select>
                          </div>
                       </div>
                       <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                          <button type="button" onClick={() => deleteTimetableSlot()} className="px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors mr-auto border border-red-200">Clear Slot</button>
                          <button type="button" onClick={() => setEditSlotData(null)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                          <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md transition-colors">Save Slot</button>
                       </div>
                    </form>
                 </div>
              )}
           </div>
        )}

        {/* Generate Reports */}
        {activeTab === 'reports' && (
           <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 text-center animate-fade-in">
              <FileText size={48} className="text-indigo-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-800 mb-2">School Official Summary Report</h2>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">This report includes summaries for all system records (Students, Timetables, Finances). Use the browser's print dialog to export as PDF or Print directly.</p>
              
              <div className="text-left grid grid-cols-2 gap-8 bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 text-sm">
                 <div>
                    <h3 className="font-bold border-b border-slate-300 pb-2 mb-2">Student Demographics</h3>
                    <ul className="space-y-1 text-slate-600">
                       <li>Total Students Enrolled: <b>{students.length}</b></li>
                       <li>Total Paid Fees: <b>{students.filter(s=>s.feeStatus==='Paid').length}</b></li>
                       <li>Total Pending Fees: <b>{students.filter(s=>s.feeStatus==='Pending').length}</b></li>
                    </ul>
                 </div>
                 <div>
                    <h3 className="font-bold border-b border-slate-300 pb-2 mb-2">Staff & Academics</h3>
                    <ul className="space-y-1 text-slate-600">
                       <li>Active Teachers: <b>{teachers.length}</b></li>
                       <li>Active Classes: <b>{data.classes.length}</b></li>
                       <li>Scheduled Slots: <b>{data.timetable.length}</b></li>
                    </ul>
                 </div>
              </div>

              <button onClick={handleGenerateReport} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-transform hover:-translate-y-1">
                 Print & Export Report PDF
              </button>
           </div>
        )}

         {/* Free Slots Explorer */}
         {activeTab === 'free-slots' && (
            <div className="space-y-6 animate-fade-in relative z-10">
               <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6">
                  <h3 className="font-bold text-lg mb-4 text-slate-800">Explore Free & Occupied Resources</h3>
                  <div className="flex flex-col md:flex-row gap-4 items-end">
                     <div className="flex-1 space-y-1 w-full">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Search Target</label>
                        <select 
                          value={explorerType} 
                          onChange={(e) => setExplorerType(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 outline-none"
                        >
                          <option value="teacher">Find Free Teachers</option>
                          <option value="class">Find Free Classes</option>
                        </select>
                     </div>
                     <div className="flex-1 space-y-1 w-full">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Select Day</label>
                        <select 
                          value={explorerDay} 
                          onChange={(e) => setExplorerDay(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 outline-none"
                        >
                          {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                     </div>
                     <div className="flex-1 space-y-1 w-full">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Select Time Slot</label>
                        <select 
                          value={explorerSlot} 
                          onChange={(e) => setExplorerSlot(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 outline-none"
                        >
                          {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                     </div>
                  </div>
               </div>

               <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                     <h3 className="font-bold text-lg text-slate-800">
                        {explorerType === 'teacher' ? 'Teacher Availability' : 'Class Availability'} for {explorerDay} at {explorerSlot}
                     </h3>
                  </div>
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                           <th className="p-4 font-bold uppercase tracking-wider">{explorerType === 'teacher' ? 'Teacher Name' : 'Class ID/Name'}</th>
                           <th className="p-4 font-bold uppercase tracking-wider">Status</th>
                           <th className="p-4 font-bold uppercase tracking-wider">{explorerType === 'teacher' ? 'Assigned Class' : 'Assigned Teacher'}</th>
                           <th className="p-4 font-bold uppercase tracking-wider">Subject</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {explorerType === 'teacher' ? (
                           teachers.map(teacher => {
                              const occupiedSlot = data.timetable.find(t => t.teacherName === teacher.name && t.day === explorerDay && t.time === explorerSlot);
                              return (
                                 <tr key={teacher.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-bold text-slate-800">{teacher.name} <span className="text-xs text-slate-400 font-normal ml-2">({teacher.subject})</span></td>
                                    <td className="p-4">
                                       {occupiedSlot ? (
                                          <span className="text-xs font-bold bg-rose-100 text-rose-700 px-3 py-1 rounded-full border border-rose-200">Busy / Assigned</span>
                                       ) : (
                                          <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">Free - Available</span>
                                       )}
                                    </td>
                                    <td className="p-4 text-sm font-semibold text-slate-600">{occupiedSlot ? occupiedSlot.classId : '-'}</td>
                                    <td className="p-4 text-sm font-semibold text-slate-600">{occupiedSlot ? occupiedSlot.subject : '-'}</td>
                                 </tr>
                              );
                           })
                        ) : (
                           data.classes.map(cls => {
                              const occupiedSlot = data.timetable.find(t => t.classId === cls.id && t.day === explorerDay && t.time === explorerSlot);
                              return (
                                 <tr key={cls.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-bold text-slate-800">{cls.name} <span className="text-xs text-slate-400 bg-slate-200 px-2 py-0.5 rounded-md ml-2">{cls.id}</span></td>
                                    <td className="p-4">
                                       {occupiedSlot ? (
                                          <span className="text-xs font-bold bg-rose-100 text-rose-700 px-3 py-1 rounded-full border border-rose-200">Class Ongoing</span>
                                       ) : (
                                          <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">Free - Available</span>
                                       )}
                                    </td>
                                    <td className="p-4 text-sm font-semibold text-slate-600">{occupiedSlot ? occupiedSlot.teacherName : '-'}</td>
                                    <td className="p-4 text-sm font-semibold text-slate-600">{occupiedSlot ? occupiedSlot.subject : '-'}</td>
                                 </tr>
                              );
                           })
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default AdminDashboard;
