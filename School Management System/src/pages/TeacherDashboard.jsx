import React, { useState } from 'react';
import { loadData, saveData } from '../store';
import { CheckCircle2, XCircle, LogOut, CheckSquare, ClipboardList, BookOpen, AlertCircle, Calendar, LayoutDashboard, Users, Bell, Search } from 'lucide-react';

const TeacherDashboard = ({ user, onLogout }) => {
  const [data, setData] = useState(loadData());
  const [activeTab, setActiveTab] = useState('overview');
  
  const TIME_SLOTS = ["08:30 - 10:00 AM", "10:00 - 11:30 AM", "11:30 - 01:00 PM", "01:30 - 03:00 PM", "03:00 - 04:30 PM", "04:30 - 06:00 PM"];
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Attendance State
  const [selectedClass, setSelectedClass] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [studentsList, setStudentsList] = useState([]);
  const [attendanceMarks, setAttendanceMarks] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Marks State
  const [marksClass, setMarksClass] = useState('');
  const [marksExam, setMarksExam] = useState('Mid Term');
  const [totalMarks, setTotalMarks] = useState('100');
  const [studentsMarksList, setStudentsMarksList] = useState([]);
  const [marksData, setMarksData] = useState({});

  // Free Classes Finder State
  const [searchDay, setSearchDay] = useState('Monday');
  const [searchSlot, setSearchSlot] = useState(TIME_SLOTS[0]);

  const handleClassSelection = (classId) => {
    setSelectedClass(classId);
    setSuccessMessage('');
    setErrorMessage('');
    const studentsInClass = data.users.filter(u => u.role === 'student' && u.class === classId);
    setStudentsList(studentsInClass);
    const initialMarks = {};
    studentsInClass.forEach(s => initialMarks[s.id] = null);
    setAttendanceMarks(initialMarks);
  };

  const handleMarksClassSelection = (classId) => {
    setMarksClass(classId);
    const studentsInClass = data.users.filter(u => u.role === 'student' && u.class === classId);
    setStudentsMarksList(studentsInClass);
    const initialGrades = {};
    studentsInClass.forEach(s => initialGrades[s.id] = { marks: '', grade: '' });
    setMarksData(initialGrades);
  };

  const markStudent = (studentId, status) => {
    setAttendanceMarks(prev => ({ ...prev, [studentId]: status }));
  };

  const submitAttendance = () => {
    const allMarked = Object.values(attendanceMarks).every(val => val !== null);
    if (!allMarked) {
      setErrorMessage('Please mark attendance for all students before submitting.');
      setSuccessMessage('');
      return;
    }
    try {
      const newRecord = {
        id: Date.now(),
        date: attendanceDate,
        classId: selectedClass,
        teacherId: user.id,
        records: Object.entries(attendanceMarks).map(([studentId, status]) => ({
          studentId: parseInt(studentId),
          status
        }))
      };
      const updatedData = { ...data };
      updatedData.attendance.push(newRecord);
      saveData(updatedData);
      setData(updatedData);
      setSuccessMessage('Attendance saved successfully!');
      setErrorMessage('');
    } catch (err) {
      setErrorMessage('An error occurred while saving attendance.');
      setSuccessMessage('');
    }
  };

  const calculateGrade = (val, maxMarks = totalMarks) => {
     const m = parseFloat(val);
     const t = parseFloat(maxMarks);
     if (isNaN(m) || isNaN(t) || t === 0) return '';
     const percentage = (m / t) * 100;
     if (percentage >= 80) return 'A+';
     if (percentage >= 70) return 'A';
     if (percentage >= 60) return 'B';
     if (percentage >= 50) return 'C';
     return 'F';
  };

  const submitMarks = () => {
     if (!totalMarks || parseFloat(totalMarks) <= 0) {
        alert("Please enter valid total marks.");
        return;
     }
     if (!marksExam.trim()) {
        alert("Please enter an assessment name.");
        return;
     }

     try {
        const updatedData = { ...data };
        Object.entries(marksData).forEach(([studentId, gradeInfo]) => {
           if (gradeInfo.marks !== '') {
              updatedData.marks.push({
                 id: Date.now() + Math.random(),
                 studentId: parseInt(studentId),
                 classId: marksClass,
                 subject: user.subject,
                 exam: marksExam,
                 marks: gradeInfo.marks,
                 totalMarks: totalMarks,
                 grade: gradeInfo.grade
              });
           }
        });
        saveData(updatedData);
        setData(updatedData);
        alert('Marks uploaded successfully!');
        setMarksClass('');
     } catch (err) {
        alert('Failed saving marks.');
     }
  };

  const teacherTimetable = data.timetable.filter(t => t.teacherName?.trim().toLowerCase() === user.name?.trim().toLowerCase());
  
  const teacherClassesFromTimetable = teacherTimetable.map(t => t.classId);
  const teacherClassesFromAttendance = data.attendance.filter(a => a.teacherId === user.id).map(a => a.classId);
  const teacherClassesFromMarks = data.marks.filter(m => m.subject === user.subject).map(m => m.classId);
  
  const teacherClasses = [...new Set([...teacherClassesFromTimetable, ...teacherClassesFromAttendance, ...teacherClassesFromMarks])];
  const teacherStudents = data.users.filter(u => u.role === 'student' && teacherClasses.includes(u.class));

  const getStudentAttendanceForTeacher = (student) => {
     const records = data.attendance.filter(a => a.teacherId === user.id && a.classId === student.class);
     const total = records.length;
     if(total === 0) return { percent: 'N/A', present: 0, total: 0 };
     const present = records.filter(a => {
        const studentRecord = a.records.find(r => r.studentId === student.id);
        return studentRecord && studentRecord.status === 'Present';
     }).length;
     return { percent: ((present/total)*100).toFixed(1) + '%', present, total };
  };

  const notices = data.notices || [];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      <div className="w-72 bg-[#064e3b] text-teal-100 flex flex-col shadow-2xl z-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-500/10 to-emerald-500/10 pointer-events-none"></div>
        <div className="p-6 border-b border-white/10 flex items-center gap-4 relative z-10">
          <div className="bg-gradient-to-tr from-teal-400 to-emerald-500 p-2.5 rounded-xl text-white shadow-lg shadow-teal-500/30">
            <ClipboardList size={24} />
          </div>
          <div>
            <h2 className="font-black text-xl text-white tracking-tight">Staff Portal</h2>
            <p className="text-xs text-teal-300 font-bold tracking-wider uppercase mt-0.5">{user.name}</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto relative z-10 custom-scrollbar">
          {[
             { id: 'overview', icon: LayoutDashboard, label: 'Dashboard Overview' },
             { id: 'attendance', icon: CheckSquare, label: 'Mark Attendance' },
             { id: 'marks', icon: ClipboardList, label: 'Enter Marks/Grades' },
             { id: 'students', icon: BookOpen, label: 'View Student List' },
             { id: 'timetable', icon: Calendar, label: 'View Timetable' },
             { id: 'free-classes', icon: Search, label: 'Find Free Classes' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-bold capitalize text-left group
                 ${activeTab === tab.id 
                   ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-600/25 ring-1 ring-white/20' 
                   : 'hover:bg-white/5 hover:text-white'}`}
            >
              <tab.icon size={20} className={activeTab === tab.id ? 'text-white' : 'text-teal-400 group-hover:text-emerald-300 transition-colors'} /> 
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
         <div className="absolute top-0 left-0 w-96 h-96 bg-teal-400/5 rounded-full filter blur-3xl pointer-events-none"></div>

         <header className="mb-8 flex flex-wrap items-center justify-between gap-4 animate-fade-in relative z-10 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-5">
               <div className="w-14 h-14 bg-gradient-to-tr from-teal-100 to-emerald-100 text-teal-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner border border-teal-200/50">
                  {user.name.charAt(0)}
               </div>
               <div>
                  <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                     Hello, {user.name.split(' ')[0]}!
                  </h1>
                  <div className="flex items-center gap-3 mt-1.5 text-sm font-bold text-slate-500 uppercase tracking-wider">
                     <span className="flex items-center gap-1.5"><BookOpen size={16} className="text-teal-500" /> Dept: {user.subject}</span>
                  </div>
               </div>
            </div>
         </header>

         {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in relative z-10">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Quick Stat 1 */}
                  <div onClick={() => setActiveTab('timetable')} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between cursor-pointer hover:shadow-md transition-all group">
                     <div className="flex justify-between items-start mb-4">
                        <div className="bg-teal-50 p-3 rounded-2xl text-teal-600 group-hover:scale-110 transition-transform"><Calendar size={24} /></div>
                        <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg uppercase tracking-wider">Weekly</span>
                     </div>
                     <div>
                        <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Assigned Classes</h3>
                        <div className="flex items-end gap-2">
                           <p className="text-4xl font-black text-slate-800">{teacherTimetable.length}</p>
                           <p className="text-sm font-semibold text-teal-500 mb-1">Slots</p>
                        </div>
                     </div>
                  </div>

                  {/* Quick Stat 2 */}
                  <div onClick={() => setActiveTab('students')} className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl shadow-lg flex flex-col justify-between cursor-pointer hover:shadow-xl transition-all group relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none"></div>
                     <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="bg-white/10 p-3 rounded-2xl text-white group-hover:scale-110 transition-transform"><Users size={24} /></div>
                     </div>
                     <div className="relative z-10">
                        <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">My Students</h3>
                        <div className="flex items-end gap-2">
                           <p className="text-4xl font-black text-white">{teacherStudents.length}</p>
                           <p className="text-sm font-semibold text-emerald-400 mb-1">Enrolled</p>
                        </div>
                     </div>
                  </div>

                  {/* Quick Stat 3 */}
                  <div onClick={() => setActiveTab('attendance')} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between cursor-pointer hover:shadow-md transition-all group">
                     <div className="flex justify-between items-start mb-4">
                        <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 group-hover:scale-110 transition-transform"><CheckSquare size={24} /></div>
                     </div>
                     <div>
                        <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Today's Tasks</h3>
                        <div className="flex items-end gap-2">
                           <p className="text-lg font-black text-slate-800 mt-2">Mark Attendance</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Notice Board */}
               <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                     <div className="bg-amber-100 text-amber-600 p-2 rounded-xl"><Bell size={20} /></div>
                     <h3 className="font-bold text-lg text-slate-800">Staff Notice Board</h3>
                  </div>
                  <div className="p-6">
                     {notices.length === 0 ? (
                        <p className="text-slate-500 text-center py-8">No new announcements.</p>
                     ) : (
                        <div className="space-y-4">
                           {notices.map(notice => (
                              <div key={notice.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-md transition-all group">
                                 <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-slate-800 group-hover:text-teal-600 transition-colors">{notice.title}</h4>
                                    <span className="text-xs font-bold text-slate-400 bg-slate-200/50 px-2.5 py-1 rounded-lg">
                                       {new Date(notice.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                    </span>
                                 </div>
                                 <p className="text-sm text-slate-600 leading-relaxed mb-3">{notice.content}</p>
                                 <p className="text-xs font-bold uppercase tracking-wider text-teal-600">By {notice.author}</p>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
               </div>
            </div>
         )}

        {/* Existing Attendance View */}
        {activeTab === 'attendance' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-end gap-4">
                <div className="flex-1 space-y-1">
                   <label className="text-sm font-semibold text-slate-700">Select Class</label>
                   <select 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                      value={selectedClass}
                      onChange={(e) => handleClassSelection(e.target.value)}
                   >
                     <option value="" disabled>-- Select a class --</option>
                     {data.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                   </select>
                </div>
                <div className="flex-1 space-y-1">
                   <label className="text-sm font-semibold text-slate-700">Date</label>
                   <input 
                      type="date" 
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                   />
                </div>
             </div>

             {selectedClass && (
               <div className="bg-white shadow-sm rounded-2xl border border-slate-100 overflow-hidden animate-fade-in relative">
                 <div className="absolute top-0 left-0 w-2 bg-indigo-500 h-full"></div>
                 <div className="p-6">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-lg">Mark Present / Absent</h3>
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {studentsList.length} Students
                      </span>
                   </div>

                   {errorMessage && (
                     <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center gap-3 animate-fade-in">
                       <AlertCircle size={20} /> <span className="font-semibold">{errorMessage}</span>
                     </div>
                   )}
                   {successMessage && (
                     <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 flex items-center gap-3 animate-fade-in">
                       <CheckCircle2 size={20} /> <span className="font-semibold">{successMessage}</span>
                     </div>
                   )}

                   <div className="space-y-4">
                     {studentsList.map((st) => (
                       <div key={st.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white flex items-center justify-center font-bold text-sm shadow-sm">{st.name.charAt(0)}</div>
                           <div>
                             <p className="font-bold text-slate-800">{st.name}</p>
                             <p className="text-xs text-slate-500 font-semibold tracking-wide">Roll: {st.rollNo}</p>
                           </div>
                         </div>
                         <div className="flex items-center gap-2">
                            <button 
                               onClick={() => markStudent(st.id, 'Present')}
                               className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all duration-200 ${attendanceMarks[st.id] === 'Present' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' : 'bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-50'}`}
                            >
                               <CheckCircle2 size={16} /> Present
                            </button>
                            <button 
                               onClick={() => markStudent(st.id, 'Absent')}
                               className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all duration-200 ${attendanceMarks[st.id] === 'Absent' ? 'bg-red-500 text-white shadow-md shadow-red-500/30' : 'bg-white text-red-600 border border-red-200 hover:bg-red-50'}`}
                            >
                               <XCircle size={16} /> Absent
                            </button>
                         </div>
                       </div>
                     ))}
                   </div>
                   <div className="mt-8 flex justify-end">
                      <button 
                        onClick={submitAttendance}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-1 transform active:scale-95"
                      >
                        Submit Attendance
                      </button>
                   </div>
                 </div>
               </div>
             )}
          </div>
        )}

        {/* Enter Marks */}
        {activeTab === 'marks' && (
           <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6">
                  <div className="space-y-1">
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Select Class To Grade ({user.subject})</label>
                     <select 
                        value={marksClass} 
                        onChange={(e) => handleMarksClassSelection(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 bg-slate-50 outline-none font-bold text-slate-700"
                     >
                        <option value="" disabled>Choose a class...</option>
                        {data.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                     </select>
                  </div>
                  <div className="space-y-1">
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Assessment Type/Name</label>
                     <input 
                        type="text"
                        value={marksExam} 
                        onChange={(e) => setMarksExam(e.target.value)}
                        placeholder="e.g. Mid Term, Quiz 1, Project"
                        className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 bg-slate-50 outline-none font-bold text-slate-700"
                     />
                  </div>
                  <div className="space-y-1">
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Total Marks</label>
                     <input 
                        type="number"
                        value={totalMarks} 
                        onChange={(e) => {
                           const newTotal = e.target.value;
                           setTotalMarks(newTotal);
                           // Recalculate grades for existing marks
                           const updatedMarksData = { ...marksData };
                           Object.keys(updatedMarksData).forEach(studentId => {
                              if (updatedMarksData[studentId].marks !== '') {
                                 updatedMarksData[studentId].grade = calculateGrade(updatedMarksData[studentId].marks, newTotal);
                              }
                           });
                           setMarksData(updatedMarksData);
                        }}
                        placeholder="e.g. 100, 50, 10"
                        className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 bg-slate-50 outline-none font-bold text-slate-700"
                     />
                  </div>
               </div>

              {marksClass && (
                 <div className="bg-white shadow-sm rounded-2xl border border-slate-100 overflow-hidden p-6 animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg">Enter Marks (out of {totalMarks})</h3>
                     </div>
                     <table className="w-full text-left border-collapse">
                       <thead>
                         <tr className="bg-slate-50 text-slate-500 text-sm font-semibold border-b border-slate-200">
                           <th className="p-4 w-1/2">Student Details</th>
                           <th className="p-4">Marks Obtained</th>
                           <th className="p-4">Calculated Grade</th>
                         </tr>
                       </thead>
                       <tbody>
                         {studentsMarksList.map((st) => (
                            <tr key={st.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                               <td className="p-4 font-bold text-slate-800 flex items-center gap-3">
                                  {st.name} <span className="text-xs bg-slate-200 px-2 py-1 rounded-md text-slate-600 block">Roll: {st.rollNo}</span>
                               </td>
                               <td className="p-4">
                                  <input 
                                     type="number" max={totalMarks} min="0" placeholder={`e.g ${Math.floor(totalMarks * 0.85)}`}
                                     value={marksData[st.id]?.marks || ''}
                                     onChange={(e) => {
                                        const val = e.target.value;
                                        setMarksData({ ...marksData, [st.id]: { marks: val, grade: calculateGrade(val) } });
                                     }}
                                     className="border border-slate-200 rounded-lg p-2.5 text-sm w-32 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-bold text-slate-800"
                                  />
                               </td>
                               <td className="p-4 font-black text-emerald-600 text-lg">
                                 {marksData[st.id]?.grade || '-'}
                              </td>
                           </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mt-8 flex justify-end">
                       <button onClick={submitMarks} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:-translate-y-1">
                          Upload Marks & Grades
                       </button>
                    </div>
                 </div>
              )}
           </div>
        )}

        {/* View Timetable */}
        {activeTab === 'timetable' && (
           <div className="bg-white shadow-md rounded-xl border border-slate-200 overflow-hidden animate-fade-in max-w-6xl mx-auto">
              <div className="bg-slate-800 text-white p-4 text-center border-b-4 border-indigo-500">
                 <h3 className="font-bold text-2xl tracking-widest">{user.name}</h3>
                 <p className="text-xs text-slate-300 mt-1 uppercase tracking-widest">Faculty Timetable</p>
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
                                const slot = data.timetable.find(t => t.teacherName?.trim().toLowerCase() === user.name?.trim().toLowerCase() && t.day === day && t.time === time);
                                return (
                                   <React.Fragment key={time}>
                                      <td className="border-b border-r border-slate-300 p-2 relative group h-24 align-middle bg-white">
                                         {slot ? (
                                            <div className="flex flex-col items-center justify-center h-full gap-1">
                                               <span className="font-bold text-slate-800 text-[13px] leading-tight px-1">{slot.subject}</span>
                                               <span className="text-[11px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">{slot.classId}</span>
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

        {/* View Students List */}
        {activeTab === 'students' && (
           <div className="bg-white shadow-sm rounded-2xl border border-slate-100 overflow-hidden animate-fade-in max-w-5xl mx-auto">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                 <div>
                    <h3 className="font-bold text-lg text-slate-800">My Registered Students</h3>
                    <p className="text-sm text-slate-500">Students enrolled in classes you teach</p>
                 </div>
                 <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl font-bold text-sm">
                    Total Students: {teacherStudents.length}
                 </div>
              </div>
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-white text-slate-500 text-sm font-bold border-b border-slate-200 uppercase tracking-wider">
                       <th className="p-4">Student Name</th>
                       <th className="p-4">Roll Number</th>
                       <th className="p-4">Class</th>
                       <th className="p-4 text-center">Attendance in {user.subject}</th>
                    </tr>
                 </thead>
                 <tbody>
                    {teacherStudents.length === 0 ? (
                       <tr><td colSpan="4" className="text-center p-8 text-slate-500">You have no students registered under your classes yet.</td></tr>
                    ) : (
                       teacherStudents.map(st => {
                          const att = getStudentAttendanceForTeacher(st);
                          const isLow = att.percent !== 'N/A' && parseFloat(att.percent) < 75;
                          return (
                             <tr key={st.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-bold text-slate-800 flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs">{st.name.charAt(0)}</div>
                                   {st.name}
                                </td>
                                <td className="p-4 text-slate-500 text-sm font-semibold">{st.rollNo}</td>
                                <td className="p-4 font-black text-indigo-600">{st.class}</td>
                                <td className="p-4 text-center">
                                   {att.percent === 'N/A' ? (
                                      <span className="text-slate-400 text-sm italic font-medium">No records</span>
                                   ) : (
                                      <div className="flex flex-col items-center">
                                         <span className={`text-lg font-black ${isLow ? 'text-rose-600' : 'text-emerald-600'}`}>{att.percent}</span>
                                         <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{att.present} / {att.total} classes</span>
                                      </div>
                                   )}
                                </td>
                             </tr>
                          )
                       })
                    )}
                 </tbody>
              </table>
           </div>
        )}
         {/* Free Classes Finder */}
         {activeTab === 'free-classes' && (
            <div className="space-y-6 animate-fade-in relative z-10">
               <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6">
                  <h3 className="font-bold text-lg mb-4 text-slate-800">Find Available Classes for Extra Lectures</h3>
                  <div className="flex gap-4 items-end">
                     <div className="flex-1 space-y-1">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Select Day</label>
                        <select 
                          value={searchDay} 
                          onChange={(e) => setSearchDay(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-slate-50 outline-none"
                        >
                          {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                     </div>
                     <div className="flex-1 space-y-1">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Select Time Slot</label>
                        <select 
                          value={searchSlot} 
                          onChange={(e) => setSearchSlot(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-slate-50 outline-none"
                        >
                          {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                     </div>
                  </div>
               </div>

               <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                     <h3 className="font-bold text-lg text-slate-800">Status for {searchDay} at {searchSlot}</h3>
                  </div>
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                           <th className="p-4 font-bold uppercase tracking-wider">Class</th>
                           <th className="p-4 font-bold uppercase tracking-wider">Status</th>
                           <th className="p-4 font-bold uppercase tracking-wider">Assigned Teacher</th>
                           <th className="p-4 font-bold uppercase tracking-wider">Subject</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {data.classes.map(cls => {
                           const slotOccupiedBy = data.timetable.find(t => t.classId === cls.id && t.day === searchDay && t.time === searchSlot);
                           return (
                              <tr key={cls.id} className="hover:bg-slate-50 transition-colors">
                                 <td className="p-4 font-bold text-slate-800">{cls.name} <span className="text-xs text-slate-400 bg-slate-200 px-2 py-0.5 rounded-md ml-2">{cls.id}</span></td>
                                 <td className="p-4">
                                    {slotOccupiedBy ? (
                                       <span className="text-xs font-bold bg-rose-100 text-rose-700 px-3 py-1 rounded-full border border-rose-200">Occupied</span>
                                    ) : (
                                       <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">Free - Available</span>
                                    )}
                                 </td>
                                 <td className="p-4 text-sm font-semibold text-slate-600">{slotOccupiedBy ? slotOccupiedBy.teacherName : '-'}</td>
                                 <td className="p-4 text-sm font-semibold text-slate-600">{slotOccupiedBy ? slotOccupiedBy.subject : '-'}</td>
                              </tr>
                           );
                        })}
                     </tbody>
                  </table>
               </div>
            </div>
         )}

      </div>
    </div>
  );
};

export default TeacherDashboard;
