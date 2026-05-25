import React, { useState } from 'react';
import { loadData } from '../store';
import { LogOut, Calendar, Award, CreditCard, Download, User as UserIcon, AlertCircle, GraduationCap, LayoutDashboard, Bell } from 'lucide-react';

const StudentDashboard = ({ user, onLogout }) => {
  const [data] = useState(loadData());
  const [activeTab, setActiveTab] = useState('overview');

  const TIME_SLOTS = ["08:30 - 10:00 AM", "10:00 - 11:30 AM", "11:30 - 01:00 PM", "01:30 - 03:00 PM", "03:00 - 04:30 PM", "04:30 - 06:00 PM"];
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Attendance
  const studentAttendance = data.attendance.filter(a => a.classId === user.class)
    .map(a => {
      const record = a.records.find(r => Number(r.studentId) === Number(user.id));
      const teacher = data.users.find(u => u.id === a.teacherId);
      return { 
         date: a.date, 
         status: record ? record.status : 'N/A',
         subject: teacher ? teacher.subject : 'General'
      };
    })
    .filter(a => a.status !== 'N/A');

  const totalClasses = studentAttendance.length;
  const presentasses = studentAttendance.filter(a => a.status === 'Present').length;
  const attendancePercentage = totalClasses > 0 ? ((presentasses / totalClasses) * 100).toFixed(1) : 0;

  const studentTimetable = data.timetable.filter(t => t.classId === user.class);
  const enrolledSubjects = [...new Set(studentTimetable.map(t => t.subject))];

  const subjectAttendance = {};
  enrolledSubjects.forEach(subject => {
     subjectAttendance[subject] = { total: 0, present: 0 };
  });

  studentAttendance.forEach(a => {
     if(!subjectAttendance[a.subject]) {
        subjectAttendance[a.subject] = { total: 0, present: 0 };
     }
     subjectAttendance[a.subject].total++;
     if (a.status === 'Present') subjectAttendance[a.subject].present++;
  });

  // Marks & Notices
  const myMarks = data.marks.filter(m => Number(m.studentId) === Number(user.id));
  const notices = data.notices || [];

  const downloadSlip = () => {
     window.print();
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 print:bg-white print:h-auto">
      <div className="w-72 bg-[#0f172a] text-slate-300 flex flex-col shadow-2xl print:hidden z-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-purple-500/10 pointer-events-none"></div>
        <div className="p-6 border-b border-white/10 flex items-center gap-4 relative z-10">
           <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-500/30">
             <UserIcon size={24} />
           </div>
           <div>
              <h2 className="font-black text-xl text-white tracking-tight">Student Portal</h2>
              <p className="text-xs text-indigo-300 font-bold tracking-wider uppercase mt-0.5">{user.name}</p>
           </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto relative z-10 custom-scrollbar">
          {[
             { id: 'overview', icon: LayoutDashboard, label: 'Dashboard Overview' },
             { id: 'attendance', icon: Calendar, label: 'My Attendance' },
             { id: 'timetable', icon: Calendar, label: 'My Timetable' },
             { id: 'results', icon: Award, label: 'Marks & Results' },
             { id: 'fees', icon: CreditCard, label: 'Fee Status' },
          ].map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-bold capitalize text-left group
                 ${activeTab === tab.id 
                   ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/20' 
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

      <div className="flex-1 p-8 overflow-y-auto relative">
        {/* Background ambient light */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400/5 rounded-full filter blur-3xl pointer-events-none"></div>

        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 animate-fade-in print:hidden relative z-10 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-gradient-to-tr from-indigo-100 to-purple-100 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner border border-indigo-200/50">
                 {user.name.charAt(0)}
              </div>
              <div>
                 <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                    Welcome back, {user.name.split(' ')[0]}!
                 </h1>
                 <div className="flex items-center gap-3 mt-1.5 text-sm font-bold text-slate-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><GraduationCap size={16} className="text-indigo-500" /> Class {user.class}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="flex items-center gap-1.5 text-slate-600">Roll No: {user.rollNo}</span>
                 </div>
              </div>
           </div>
           {['attendance', 'results', 'fees'].includes(activeTab) && (
              <button onClick={downloadSlip} className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all transform hover:-translate-y-0.5 shadow-lg shadow-slate-900/20 flex items-center gap-2">
                 <Download size={18} /> Print Record
              </button>
           )}
        </header>

        <div className="hidden print:block text-2xl font-black mb-8 items-center justify-center text-center pb-4 border-b-2 border-slate-800">
            <h1>Official Student Transcript</h1>
            <p className="text-sm font-bold text-slate-600 uppercase tracking-widest mt-2">Name: {user.name} | Roll No: {user.rollNo} | Class: {user.class}</p>
        </div>

        {activeTab === 'overview' && (
           <div className="space-y-6 animate-fade-in relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Quick Stat 1 */}
                 <div onClick={() => setActiveTab('attendance')} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between cursor-pointer hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                       <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 group-hover:scale-110 transition-transform"><Calendar size={24} /></div>
                       <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg uppercase tracking-wider">Overall</span>
                    </div>
                    <div>
                       <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Attendance</h3>
                       <div className="flex items-end gap-2">
                          <p className="text-4xl font-black text-slate-800">{attendancePercentage}%</p>
                          <p className="text-sm font-semibold text-emerald-500 mb-1">Satisfactory</p>
                       </div>
                    </div>
                 </div>

                 {/* Quick Stat 2 */}
                 <div onClick={() => setActiveTab('fees')} className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl shadow-lg flex flex-col justify-between cursor-pointer hover:shadow-xl transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                       <div className="bg-white/10 p-3 rounded-2xl text-white group-hover:scale-110 transition-transform"><CreditCard size={24} /></div>
                       <span className={`text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider border ${user.feeStatus === 'Paid' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'}`}>{user.feeStatus}</span>
                    </div>
                    <div className="relative z-10">
                       <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Fee Status</h3>
                       <div className="flex items-end gap-2">
                          <p className="text-4xl font-black text-white">{user.feeStatus}</p>
                       </div>
                    </div>
                 </div>

                 {/* Quick Stat 3 */}
                 <div onClick={() => setActiveTab('results')} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between cursor-pointer hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                       <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600 group-hover:scale-110 transition-transform"><Award size={24} /></div>
                       <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg uppercase tracking-wider">Latest</span>
                    </div>
                    <div>
                       <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Recent Grade</h3>
                       <div className="flex items-end gap-2">
                          <p className="text-4xl font-black text-slate-800">{myMarks.length > 0 ? myMarks[0].grade : 'N/A'}</p>
                          <p className="text-sm font-semibold text-slate-400 mb-1">{myMarks.length > 0 ? myMarks[0].exam : 'Assessment'}</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Subject Attendance Breakdown */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                 <h3 className="font-bold text-lg text-slate-800 mb-4">Subject-wise Attendance (75% Required for Exams)</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(subjectAttendance).map(([subject, stats]) => {
                       const percentValue = stats.total > 0 ? (stats.present / stats.total) * 100 : 100;
                       const percent = percentValue.toFixed(1);
                       const isEligible = percentValue >= 75;
                       return (
                          <div key={subject} className="border border-slate-100 bg-slate-50 p-4 rounded-2xl">
                             <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-slate-800">{subject}</h4>
                                <span className={`text-xs font-bold px-2 py-1 rounded-md ${isEligible ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                   {stats.total === 0 ? 'No Classes' : (isEligible ? 'Eligible' : 'Warning')}
                                </span>
                             </div>
                             <div className="flex justify-between items-end mb-1 mt-3">
                                <p className="text-xs font-semibold text-slate-500">{stats.present} / {stats.total} Classes</p>
                                <p className={`text-xl font-black ${isEligible ? 'text-emerald-600' : 'text-rose-600'}`}>{stats.total === 0 ? '-' : `${percent}%`}</p>
                             </div>
                             <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1">
                                <div className={`h-1.5 rounded-full ${isEligible ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${stats.total === 0 ? 0 : percent}%` }}></div>
                             </div>
                          </div>
                       );
                    })}
                    {Object.keys(subjectAttendance).length === 0 && (
                       <p className="text-sm text-slate-500 col-span-3">No subjects assigned in your timetable.</p>
                    )}
                 </div>
              </div>

              {/* Notice Board */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                 <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                    <div className="bg-purple-100 text-purple-600 p-2 rounded-xl"><Bell size={20} /></div>
                    <h3 className="font-bold text-lg text-slate-800">School Notice Board</h3>
                 </div>
                 <div className="p-6">
                    {notices.length === 0 ? (
                       <p className="text-slate-500 text-center py-8">No new announcements.</p>
                    ) : (
                       <div className="space-y-4">
                          {notices.map(notice => (
                             <div key={notice.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-md transition-all group">
                                <div className="flex justify-between items-start mb-2">
                                   <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{notice.title}</h4>
                                   <span className="text-xs font-bold text-slate-400 bg-slate-200/50 px-2.5 py-1 rounded-lg">
                                      {new Date(notice.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                   </span>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed mb-3">{notice.content}</p>
                                <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">By {notice.author}</p>
                             </div>
                          ))}
                       </div>
                    )}
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'attendance' && (
          <div className="space-y-6 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-cyan-500 p-6 rounded-2xl shadow-lg text-white">
                   <h3 className="text-sm font-semibold uppercase tracking-wider opacity-80">Global Attendance</h3>
                   <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-5xl font-extrabold">{attendancePercentage}%</span>
                      <span className="text-sm opacity-80 font-medium">overall</span>
                   </div>
                   <div className="mt-4 pt-4 border-t border-white/20 flex gap-6">
                      <div>
                         <p className="text-xs opacity-80 uppercase tracking-widest font-semibold">Classes Taken</p>
                         <p className="text-xl font-bold">{totalClasses}</p>
                      </div>
                      <div>
                         <p className="text-xs opacity-80 uppercase tracking-widest font-semibold">Present</p>
                         <p className="text-xl font-bold">{presentasses}</p>
                      </div>
                   </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
                   <div className="text-center space-y-3">
                      <Calendar size={48} className="text-cyan-400 mx-auto" strokeWidth={1.5} />
                      <p className="text-slate-500 font-medium max-w-xs leading-relaxed">Regular attendance ensures peak academic performance. Keep it up!</p>
                   </div>
                </div>
             </div>

             <div className="bg-white shadow-sm rounded-2xl border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                   <h3 className="font-bold text-lg">Detailed Log</h3>
                </div>
                <div className="p-0">
                   {studentAttendance.length === 0 ? (
                      <p className="p-8 text-center text-slate-500">No attendance records found.</p>
                   ) : (
                      <table className="w-full text-left border-collapse">
                         <thead>
                            <tr className="bg-slate-50 text-slate-500 text-sm font-semibold border-b border-slate-200">
                               <th className="p-4 pl-6">Date</th>
                               <th className="p-4">Subject</th>
                               <th className="p-4 pr-6 text-right">Status</th>
                            </tr>
                         </thead>
                         <tbody>
                             {studentAttendance.map((a, i) => (
                                <tr key={i} className="border-b border-slate-100">
                                   <td className="p-4 pl-6 font-medium text-slate-700">{new Date(a.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                   <td className="p-4 font-bold text-indigo-600">{a.subject}</td>
                                   <td className="p-4 pr-6 text-right">
                                      <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${a.status === 'Present' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                         {a.status}
                                      </span>
                                   </td>
                                </tr>
                             ))}
                         </tbody>
                      </table>
                   )}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'timetable' && (
           <div className="bg-white shadow-md rounded-xl border border-slate-200 overflow-hidden animate-fade-in max-w-6xl mx-auto mt-6">
              <div className="bg-slate-800 text-white p-4 text-center border-b-4 border-cyan-500">
                 <h3 className="font-bold text-2xl tracking-widest">Class {user.class}</h3>
                 <p className="text-xs text-slate-300 mt-1 uppercase tracking-widest">Centralized Timetable</p>
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
                                const slot = data.timetable.find(t => t.classId === user.class && t.day === day && t.time === time);
                                return (
                                   <React.Fragment key={time}>
                                      <td className="border-b border-r border-slate-300 p-2 relative group h-24 align-middle bg-white">
                                         {slot ? (
                                            <div className="flex flex-col items-center justify-center h-full gap-1">
                                               <span className="font-bold text-slate-800 text-[13px] leading-tight px-1">{slot.subject}</span>
                                               <span className="text-[11px] text-cyan-700 font-bold bg-cyan-50 px-2 py-0.5 rounded-full">{slot.teacherName}</span>
                                            </div>
                                         ) : (
                                            <span className="text-slate-300 text-[10px] uppercase font-bold">Free</span>
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
        )}

        {activeTab === 'results' && (
           <div className="bg-white shadow-sm rounded-2xl border border-slate-100 overflow-hidden animate-fade-in">
              <div className="p-6 border-b border-slate-100"><h3 className="font-bold text-lg">My Subject Marks & Grades</h3></div>
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50 text-slate-500 text-sm font-semibold border-b border-slate-200">
                       <th className="p-4">Exam Type</th>
                       <th className="p-4">Subject Tested</th>
                       <th className="p-4 text-center">Marks Score</th>
                       <th className="p-4 text-right">Achieved Grade</th>
                    </tr>
                 </thead>
                 <tbody>
                    {myMarks.length > 0 ? myMarks.map((m, i) => (
                       <tr key={i} className="border-b border-slate-100">
                          <td className="p-4 font-bold text-indigo-600">{m.exam}</td>
                          <td className="p-4 font-bold text-slate-700">{m.subject}</td>
                          <td className="p-4 text-center text-slate-600 font-bold">{m.marks} / {m.totalMarks || '100'}</td>
                          <td className="p-4 text-emerald-600 font-extrabold text-right text-lg">{m.grade}</td>
                       </tr>
                    )) : (
                       <tr><td colSpan="4" className="text-center p-8 text-slate-500">No exam marks published for you yet. Contact teachers.</td></tr>
                    )}
                 </tbody>
              </table>
           </div>
        )}

        {activeTab === 'fees' && (
          <div className="bg-white shadow-sm rounded-2xl border border-slate-100 overflow-hidden animate-fade-in max-w-2xl mx-auto mt-12 print:mt-0 print:shadow-none print:border-none print:max-w-none">
             {/* Voucher Header */}
             <div className="bg-slate-800 text-white p-6 flex justify-between items-center print:bg-slate-100 print:text-black print:border-b-2 print:border-slate-800">
                <div className="flex items-center gap-3">
                   <div className="bg-white/20 p-2 rounded-lg print:bg-transparent print:border print:border-slate-800">
                      <GraduationCap size={32} className="print:text-slate-800" />
                   </div>
                   <div>
                      <h2 className="font-bold text-xl tracking-wider">EduPortal</h2>
                      <p className="text-xs text-slate-300 print:text-slate-600 uppercase tracking-widest">Official Fee Voucher</p>
                   </div>
                </div>
                <div className="text-right">
                   <div className="text-2xl font-black tracking-widest">FA26</div>
                   <p className="text-xs text-slate-300 print:text-slate-600">Student Copy</p>
                </div>
             </div>

             <div className="p-8">
                {/* Student Details */}
                <div className="grid grid-cols-2 gap-6 mb-8 pb-6 border-b border-dashed border-slate-300">
                   <div>
                      <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Student Name</p>
                      <p className="text-lg font-bold text-slate-800">{user.name}</p>
                   </div>
                   <div>
                      <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Roll Number</p>
                      <p className="text-lg font-bold text-slate-800">{user.rollNo}</p>
                   </div>
                   <div>
                      <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Class / Section</p>
                      <p className="text-lg font-bold text-slate-800">{user.class}</p>
                   </div>
                   <div>
                      <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Issue Date</p>
                      <p className="text-lg font-bold text-slate-800">{new Date().toLocaleDateString('en-GB')}</p>
                   </div>
                </div>

                {/* Fee Details */}
                <table className="w-full text-left mb-8">
                   <thead>
                      <tr className="border-b-2 border-slate-800 text-slate-800 font-bold">
                         <th className="pb-3">Description</th>
                         <th className="pb-3 text-right">Amount (Rs.)</th>
                      </tr>
                   </thead>
                   <tbody className="text-slate-600 font-medium">
                      <tr className="border-b border-slate-100">
                         <td className="py-4">Monthly Tuition Fee</td>
                         <td className="py-4 text-right">{data.classes.find(c => c.id === user.class)?.feeAmount || '5000'}</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                         <td className="py-4">Lab / Extracurricular</td>
                         <td className="py-4 text-right">0</td>
                      </tr>
                      <tr>
                         <td className="py-4 text-slate-800 font-black text-lg">Total Payable Amount</td>
                         <td className="py-4 text-right text-indigo-600 font-black text-2xl">Rs. {data.classes.find(c => c.id === user.class)?.feeAmount || '5000'}</td>
                      </tr>
                   </tbody>
                </table>

                {/* Status & Actions */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200 print:hidden">
                   <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${user.feeStatus === 'Paid' ? 'bg-gradient-to-tr from-emerald-400 to-teal-300 text-white shadow-emerald-500/30' : 'bg-gradient-to-tr from-rose-500 to-red-400 text-white shadow-red-500/30'}`}>
                         {user.feeStatus === 'Paid' ? <Award size={24} /> : <AlertCircle size={24} />}
                      </div>
                      <div>
                         <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Status</p>
                         <h3 className={`font-black text-2xl ${user.feeStatus === 'Paid' ? 'text-emerald-600' : 'text-rose-600'}`}>{user.feeStatus}</h3>
                      </div>
                   </div>
                   
                   <div className="flex gap-3 w-full md:w-auto">
                      <button onClick={downloadSlip} className="flex-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-bold shadow-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap">
                         <Download size={18} /> Download Voucher
                      </button>
                      {user.feeStatus !== 'Paid' && (
                         <button onClick={() => alert('Payment Gateway Integration Pending')} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-1 transform flex items-center justify-center gap-2 whitespace-nowrap">
                            <CreditCard size={18} /> Pay Online
                         </button>
                      )}
                   </div>
                </div>

                {/* Print Only Signature Area */}
                <div className="hidden print:flex justify-between items-end mt-16 pt-8 border-t border-slate-300">
                   <div className="text-center">
                      <div className="w-40 border-b border-slate-800 mb-2"></div>
                      <p className="text-xs font-bold text-slate-600">Bank Officer Signature</p>
                   </div>
                   <div className="text-center">
                      <div className="w-40 border-b border-slate-800 mb-2"></div>
                      <p className="text-xs font-bold text-slate-600">Cashier Stamp</p>
                   </div>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default StudentDashboard;
