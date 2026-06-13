import React, { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Calendar, User, Clock, CheckCircle, Search, Filter, Upload, 
  FileText, MessageSquare, Plus, Trash, X, Send, Activity, BookOpen, Clock3
} from 'lucide-react';

export default function Dashboard() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Active Tab
  const [activeTab, setActiveTab] = useState('registry'); // 'registry', 'specialists', 'ledger', 'messages'

  // Data States
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [history, setHistory] = useState([]);
  const [chatUsers, setChatUsers] = useState([]); // List of users we can chat with
  const [staffMembers, setStaffMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // Filters for specialists
  const [searchQuery, setSearchQuery] = useState('');
  const [specFilter, setSpecFilter] = useState('');
  const [treatmentFilter, setTreatmentFilter] = useState('');

  // Modals state
  const [bookingModal, setBookingModal] = useState({ open: false, doctor: null });
  const [bookingData, setBookingData] = useState({ date: new Date(Date.now() + 86400000).toISOString().split('T')[0], slot: '10:00 AM' });
  
  const [paymentModal, setPaymentModal] = useState({ open: false, appointment: null });
  const [paymentFile, setPaymentFile] = useState(null);
  
  const [historyModal, setHistoryModal] = useState({ open: false, patientId: null, patientName: '', records: [] });
  
  const [recordModal, setRecordModal] = useState({ open: false, appointment: null });
  const [recordData, setRecordData] = useState({
    symptoms: '',
    diagnosis: '',
    notes: '',
    prescriptions: [{ medicine_name: '', dosage: '', duration: '', instructions: '' }]
  });

  const [chatModal, setChatModal] = useState({ open: false, otherUser: null, messages: [] });
  const [roleModal, setRoleModal] = useState({ open: false, user: null });
  const [passwordModal, setPasswordModal] = useState({ open: false, user: null });
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  // Timings/Schedule State (Clinic timings)
  const [clinicTimings, setClinicTimings] = useState({
    mon: '10:00 AM - 02:00 PM',
    tue: '10:00 AM - 02:00 PM',
    wed: '10:00 AM - 02:00 PM',
    thu: '03:00 PM - 07:00 PM',
    fri: '04:00 PM - 08:00 PM'
  });
  const [editTimings, setEditTimings] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate('/login');
    if (user) {
      if (user.role === 'admin' || user.role === 'superadmin') {
        setActiveTab('system');
        fetchAllUsers();
        fetchAppointments();
        fetchDoctors();
      } else {
        fetchAppointments();
        fetchStaff();
        if (user.role === 'patient') {
          fetchDoctors();
          fetchPatientHistory(user.id);
        } else if (user.role === 'doctor') {
          fetchChatUsersForDoctor();
        }
      }
    }
  }, [user, loading, navigate]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatModal.messages]);

  // Chat message polling
  useEffect(() => {
    let interval;
    if (chatModal.open && chatModal.otherUser) {
      fetchChatMessages(chatModal.otherUser.id);
      interval = setInterval(() => {
        fetchChatMessages(chatModal.otherUser.id);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [chatModal.open, chatModal.otherUser]);

  // Fetch functions
  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/appointments');
      setAppointments(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/doctors');
      setDoctors(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPatientHistory = async (patientId) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/history/${patientId}`);
      setHistory(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStaff = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/auth/staff');
      setStaffMembers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/admin/users');
      setAllUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchChatUsersForDoctor = async () => {
    // Collect all patients who have scheduled with this doctor
    try {
      const { data } = await axios.get('http://localhost:5000/api/appointments');
      const uniquePatients = [];
      const seen = new Set();
      data.forEach(apt => {
        // Look up user details associated with this patient
        if (apt.patient_id && !seen.has(apt.patient_id)) {
          seen.add(apt.patient_id);
          uniquePatients.push({
            id: apt.patient_id, // we map to user_id in chat usually, so let's check
            name: apt.patient_name
          });
        }
      });
      setChatUsers(uniquePatients);
    } catch (error) {
      console.error(error);
    }
  };

  // Actions
  const handleBookAppointment = async () => {
    try {
      await axios.post('http://localhost:5000/api/appointments', {
        doctor_id: bookingModal.doctor.id,
        clinic_id: 1,
        date: bookingData.date,
        time_slot: bookingData.slot
      });
      toast.success('Appointment Scheduled!');
      setBookingModal({ open: false, doctor: null });
      fetchAppointments();
    } catch (error) {
      toast.error('Scheduling Failed');
    }
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await axios.put(`http://localhost:5000/api/appointments/${id}/cancel`);
      toast.success('Appointment cancelled');
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to cancel appointment');
    }
  };

  const handlePaymentUpload = async (e) => {
    e.preventDefault();
    if (!paymentFile) {
      toast.error('Please choose a screenshot file');
      return;
    }

    const formData = new FormData();
    formData.append('appointment_id', paymentModal.appointment.id);
    formData.append('amount', paymentModal.appointment.fee || 2000);
    formData.append('screenshot', paymentFile);

    try {
      await axios.post('http://localhost:5000/api/payments/upload-screenshot', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Payment Proof Submitted');
      setPaymentModal({ open: false, appointment: null });
      setPaymentFile(null);
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to upload proof');
    }
  };

  const verifyPayment = async (appointmentId) => {
    try {
      await axios.put(`http://localhost:5000/api/payments/verify-by-appointment/${appointmentId}`, { status: 'verified' });
      toast.success('Payment Verified & Appointment Confirmed!');
      fetchAppointments();
    } catch (error) {
      toast.error('Verification Failed');
    }
  };

  const viewHealthHistory = async (patientId, patientName) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/history/${patientId}`);
      setHistoryModal({ open: true, patientId, patientName, records: data });
    } catch (error) {
      toast.error('Could not fetch history');
    }
  };

  const handleRecordPrescription = async (e) => {
    e.preventDefault();
    const payload = {
      patient_id: recordModal.appointment.patient_id,
      appointment_id: recordModal.appointment.id,
      symptoms: recordData.symptoms,
      diagnosis: recordData.diagnosis,
      notes: recordData.notes,
      prescriptions: recordData.prescriptions.filter(p => p.medicine_name.trim() !== '')
    };

    try {
      await axios.post('http://localhost:5000/api/history', payload);
      // Mark appointment as completed
      await axios.put(`http://localhost:5000/api/appointments/${recordModal.appointment.id}/complete`);
      toast.success('Consultation Registered & Prescription Saved!');
      setRecordModal({ open: false, appointment: null });
      setRecordData({
        symptoms: '',
        diagnosis: '',
        notes: '',
        prescriptions: [{ medicine_name: '', dosage: '', duration: '', instructions: '' }]
      });
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to save record');
    }
  };

  const handleUpdateFee = async (doctorId, fee) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/doctors/${doctorId}/fee`, { fee: Number(fee) });
      toast.success('Doctor fee updated successfully');
      fetchDoctors();
    } catch (error) {
      toast.error('Failed to update doctor fee');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action is irreversible.')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
      toast.success('User deleted successfully');
      fetchAllUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${roleModal.user.id}/role`, { role: roleModal.newRole });
      toast.success('User role updated');
      setRoleModal({ open: false, user: null });
      fetchAllUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${passwordModal.user.id}/password`, { password: passwordModal.newPassword });
      toast.success('Password reset successfully');
      setPasswordModal({ open: false, user: null });
    } catch (error) {
      toast.error('Failed to reset password');
    }
  };

  const handleAddPrescriptionField = () => {
    setRecordData(prev => ({
      ...prev,
      prescriptions: [...prev.prescriptions, { medicine_name: '', dosage: '', duration: '', instructions: '' }]
    }));
  };

  const handleRemovePrescriptionField = (idx) => {
    setRecordData(prev => ({
      ...prev,
      prescriptions: prev.prescriptions.filter((_, i) => i !== idx)
    }));
  };

  const handlePrescriptionChange = (idx, field, val) => {
    const updated = [...recordData.prescriptions];
    updated[idx][field] = val;
    setRecordData(prev => ({ ...prev, prescriptions: updated }));
  };

  // Chat Actions
  const fetchChatMessages = async (otherUserId) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/messages/${otherUserId}`);
      setChatModal(prev => ({ ...prev, messages: data }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { data } = await axios.post('http://localhost:5000/api/messages', {
        receiver_id: chatModal.otherUser.id,
        message: newMessage
      });
      setChatModal(prev => ({
        ...prev,
        messages: [...prev.messages, { ...data, sender_name: user.name }]
      }));
      setNewMessage('');
    } catch (error) {
      toast.error('Message delivery failed');
    }
  };

  const openChatWithUser = (otherUserId, otherUserName) => {
    setChatModal({
      open: true,
      otherUser: { id: otherUserId, name: otherUserName },
      messages: []
    });
    fetchChatMessages(otherUserId);
  };

  if (loading || !user) return <div className="p-20 text-center text-slate-400 animate-pulse">Establishing secure connection...</div>;

  // Filter Specialists
  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpec = specFilter ? doc.specialization === specFilter : true;
    const matchesTreatment = treatmentFilter ? doc.treatment_type === treatmentFilter : true;
    return matchesSearch && matchesSpec && matchesTreatment;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Activity className="text-blue-500 animate-pulse" size={36} />
            Command Center
          </h1>
          <p className="text-slate-400 mt-2 font-light">
            Logged in as <span className="font-semibold text-blue-400 capitalize">{user.role}</span> &bull; Welcome back, <span className="font-semibold text-white">{user.name}</span>
          </p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-slate-900/60 p-1.5 rounded-xl border border-slate-800 gap-1 mt-4 md:mt-0">
          {(user.role === 'admin' || user.role === 'superadmin') && (
            <button 
              onClick={() => setActiveTab('system')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'system' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              System Management
            </button>
          )}
          <button 
            onClick={() => setActiveTab('registry')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'registry' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Registry & Schedules
          </button>
          {(user.role === 'patient' || user.role === 'admin' || user.role === 'superadmin') && (
            <button 
              onClick={() => setActiveTab('specialists')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'specialists' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Consult Specialists
            </button>
          )}
          {(user.role !== 'assistant' && user.role !== 'admin' && user.role !== 'superadmin') && (
            <button 
              onClick={() => {
                setActiveTab('ledger');
                if (user.role === 'patient') fetchPatientHistory(user.id);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'ledger' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Health Ledger
            </button>
          )}
        </div>
      </div>

      {/* Tab CONTENT: REGISTRY */}
      {activeTab === 'registry' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Active Registry Table (Span 2) */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="text-blue-400" size={24} />
              <h2 className="text-2xl font-bold text-white">Active Registry</h2>
            </div>
            
            <div className="glass-card rounded-2xl overflow-hidden border border-slate-700/50">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-800">
                  <thead className="bg-slate-900/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">{user.role === 'patient' ? 'Doctor' : 'Patient'}</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Status</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/20">
                    {appointments.map(apt => (
                      <tr key={apt.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 flex items-center gap-2">
                          <Clock size={16} className="text-slate-500" />
                          {new Date(apt.date).toLocaleDateString()} at {apt.time_slot}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                          {user.role === 'patient' ? apt.doctor_name : apt.patient_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${
                            apt.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                            apt.status === 'completed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                            'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${
                            apt.payment_status === 'verified' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                            apt.payment_status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                            'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {apt.payment_status}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            
                            {/* Patient: Pay button */}
                            {user.role === 'patient' && apt.payment_status === 'pending' && (
                              <button 
                                onClick={() => setPaymentModal({ open: true, appointment: apt })}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition shadow-lg shadow-emerald-950"
                              >
                                <Upload size={14} /> Pay Fee
                              </button>
                            )}

                            {/* Patient: Message Doctor */}
                            {user.role === 'patient' && (
                              <button 
                                onClick={() => openChatWithUser(apt.doctor_id, apt.doctor_name)}
                                className="text-slate-300 hover:text-white bg-slate-800 border border-slate-700 p-1.5 rounded-lg transition"
                                title="Message Doctor"
                              >
                                <MessageSquare size={16} />
                              </button>
                            )}

                            {/* Assistant: Verify Payment */}
                            {user.role === 'assistant' && apt.payment_status === 'pending' && (
                              <button 
                                onClick={() => verifyPayment(apt.id)}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
                              >
                                <CheckCircle size={14} /> Verify
                              </button>
                            )}

                            {/* Doctor: Record Consultation & View History */}
                            {user.role === 'doctor' && (
                              <>
                                <button 
                                  onClick={() => viewHealthHistory(apt.patient_id, apt.patient_name)}
                                  className="text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1.5 rounded-lg text-xs transition"
                                >
                                  View History
                                </button>
                                {apt.status !== 'completed' && (
                                  <button 
                                    onClick={() => setRecordModal({ open: true, appointment: apt })}
                                    className="bg-purple-600 hover:bg-purple-500 text-white px-2.5 py-1.5 rounded-lg text-xs transition font-semibold"
                                  >
                                    Consult
                                  </button>
                                )}
                                <button 
                                  onClick={() => openChatWithUser(apt.patient_id, apt.patient_name)}
                                  className="text-slate-300 hover:text-white bg-slate-800 border border-slate-700 p-1.5 rounded-lg transition"
                                  title="Chat with Patient"
                                >
                                  <MessageSquare size={16} />
                                </button>
                              </>
                            )}
                            {/* Super Admin / Admin: Verify Payment & Cancel Appointment */}
                            {(user.role === 'superadmin' || user.role === 'admin') && (
                              <>
                                {apt.payment_status === 'pending' && (
                                  <button 
                                    onClick={() => verifyPayment(apt.id)}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
                                  >
                                    <CheckCircle size={14} /> Verify
                                  </button>
                                )}
                                {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                                  <button 
                                    onClick={() => handleCancelAppointment(apt.id)}
                                    className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </>
                            )}

                          </div>
                        </td>
                      </tr>
                    ))}
                    {appointments.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500">No active records found in the registry.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar Widgets (Clinic Timings / Staff Profiles) */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 rounded-2xl border border-slate-700/50 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Clock3 className="text-blue-400" size={20} />
                  Clinic Hours
                </h3>
                {(user.role === 'doctor' || user.role === 'assistant') && (
                  <button 
                    onClick={() => setEditTimings(!editTimings)}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    {editTimings ? 'Cancel' : 'Edit'}
                  </button>
                )}
              </div>
              
              <div className="space-y-3">
                {Object.entries(clinicTimings).map(([day, time]) => (
                  <div key={day} className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0">
                    <span className="text-sm font-semibold text-slate-400 uppercase">{day}</span>
                    {editTimings ? (
                      <input 
                        type="text" 
                        value={time} 
                        onChange={(e) => setClinicTimings(prev => ({ ...prev, [day]: e.target.value }))}
                        className="bg-slate-900 text-white text-xs px-2 py-1 rounded border border-slate-700 w-2/3 text-right"
                      />
                    ) : (
                      <span className="text-sm text-white font-medium">{time}</span>
                    )}
                  </div>
                ))}
              </div>

              {editTimings && (
                <button 
                  onClick={() => {
                    setEditTimings(false);
                    toast.success('Schedule timings updated secure');
                  }}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white text-xs py-2 rounded-xl transition"
                >
                  Save Schedule Timings
                </button>
              )}
            </div>

            {/* Dynamic Clinic Directory */}
            <div className="glass-card p-6 rounded-2xl border border-slate-700/50">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <User className="text-purple-400" size={20} />
                Clinic Directory
              </h3>
              
              <div className="space-y-4">
                {staffMembers.map(staff => {
                  const nameParts = staff.name.split(' ');
                  const lastName = nameParts[nameParts.length - 1];
                  const initial = lastName ? lastName[0] : staff.name[0];
                  const isDoc = staff.role === 'doctor';
                  return (
                    <div key={staff.id} className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border ${
                        isDoc 
                          ? 'bg-purple-600/20 border-purple-500/30 text-purple-400' 
                          : 'bg-blue-600/20 border-blue-500/30 text-blue-400'
                      }`}>
                        {initial}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{staff.name}</h4>
                        <p className="text-xs text-slate-400 capitalize">{staff.role}</p>
                      </div>
                    </div>
                  );
                })}
                {staffMembers.length === 0 && (
                  <div className="text-xs text-slate-500 animate-pulse">Establishing staff lookup...</div>
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Tab CONTENT: CONSULT SPECIALISTS (Patient only) */}
      {activeTab === 'specialists' && (
        <div>
          {/* Filters Banner */}
          <div className="glass-card p-6 rounded-2xl border border-slate-700/50 mb-8 flex flex-col md:flex-row items-center gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Search Specialists, Specialties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:border-blue-500 focus:outline-none text-white text-sm"
              />
            </div>

            {/* Specialization Filter */}
            <div className="w-full md:w-1/4">
              <select 
                value={specFilter} 
                onChange={(e) => setSpecFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:border-blue-500 focus:outline-none text-white text-sm"
              >
                <option value="">All Specializations</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Herbalist">Herbalist</option>
              </select>
            </div>

            {/* Treatment Type Filter */}
            <div className="w-full md:w-1/4">
              <select 
                value={treatmentFilter} 
                onChange={(e) => setTreatmentFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:border-blue-500 focus:outline-none text-white text-sm"
              >
                <option value="">All Treatment Modalities</option>
                <option value="allopathic">Allopathic</option>
                <option value="homeopathic">Homeopathic</option>
                <option value="herbal">Herbal</option>
              </select>
            </div>
            
            {(searchQuery || specFilter || treatmentFilter) && (
              <button 
                onClick={() => { setSearchQuery(''); setSpecFilter(''); setTreatmentFilter(''); }}
                className="text-xs text-red-400 hover:underline"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredDoctors.map(doc => (
              <div key={doc.id} className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                      {doc.treatment_type}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">{doc.experience_years || 10}+ Years Exp</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{doc.name}</h3>
                  <p className="text-sm text-blue-400 font-medium mb-3">{doc.specialization}</p>
                  <p className="text-sm text-slate-400 mb-6 font-light leading-relaxed">
                    {doc.bio || 'General treatment consultations and comprehensive wellness management.'}
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center py-3 border-t border-slate-800/60 mb-4">
                    <span className="text-slate-400 text-xs">Consultation Fee</span>
                    <span className="text-emerald-400 font-bold text-sm">Rs. {doc.fee}</span>
                  </div>
                  {user.role === 'patient' && (
                    <button 
                      onClick={() => setBookingModal({ open: true, doctor: doc })}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-semibold transition"
                    >
                      Select & Book Slot
                    </button>
                  )}
                  {user.role === 'superadmin' && (
                    <button 
                      onClick={() => {
                        const newFee = window.prompt(`Enter new fee for ${doc.name}:`, doc.fee);
                        if (newFee && !isNaN(newFee)) handleUpdateFee(doc.id, newFee);
                      }}
                      className="w-full bg-orange-600 hover:bg-orange-500 text-white py-2.5 rounded-xl font-semibold transition mt-2"
                    >
                      Update Fee
                    </button>
                  )}
                </div>
              </div>
            ))}
            {filteredDoctors.length === 0 && (
              <div className="col-span-3 py-16 text-center text-slate-500">No specialists match the selected criteria.</div>
            )}
          </div>
        </div>
      )}

      {/* Tab CONTENT: HEALTH LEDGER (Patient history details) */}
      {activeTab === 'ledger' && (
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="text-purple-400" size={28} />
            <h2 className="text-2xl font-bold text-white">Your Clinical Ledger</h2>
          </div>

          <div className="space-y-6">
            {history.map(record => (
              <div key={record.id} className="glass-card p-6 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-start pb-4 border-b border-slate-800/80 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Diagnosis: {record.diagnosis}</h3>
                    <p className="text-xs text-slate-400 mt-1">Consulted by <span className="text-blue-400 font-medium">{record.doctor_name}</span></p>
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">{new Date(record.created_at).toLocaleDateString()}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Reported Symptoms</h4>
                    <p className="text-sm text-slate-300 leading-relaxed font-light">{record.symptoms}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Clinical Notes</h4>
                    <p className="text-sm text-slate-300 leading-relaxed font-light">{record.notes || 'No notes added.'}</p>
                  </div>
                </div>

                {record.prescriptions && record.prescriptions.length > 0 && (
                  <div className="border-t border-slate-800/40 pt-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Prescription Sheet</h4>
                    <div className="bg-slate-900/60 rounded-xl overflow-hidden border border-slate-800">
                      <table className="min-w-full divide-y divide-slate-800">
                        <thead className="bg-slate-950/40">
                          <tr>
                            <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-400 uppercase">Medicine</th>
                            <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-400 uppercase">Dosage</th>
                            <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-400 uppercase">Duration</th>
                            <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-400 uppercase">Instructions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 bg-slate-900/20 text-xs">
                          {record.prescriptions.map(p => (
                            <tr key={p.id}>
                              <td className="px-4 py-3 text-white font-semibold">{p.medicine_name}</td>
                              <td className="px-4 py-3 text-slate-300">{p.dosage}</td>
                              <td className="px-4 py-3 text-slate-300">{p.duration}</td>
                              <td className="px-4 py-3 text-slate-400 font-light">{p.instructions || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {history.length === 0 && (
              <div className="glass-card p-12 text-center text-slate-500 rounded-2xl">
                No past medical history or prescription records exist in your health ledger.
              </div>
            )}
          </div>
        </div>
      )}

      {/* -------------------- MODALS -------------------- */}

      {/* 1. Booking Appointment Modal */}
      {bookingModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-md p-6 rounded-2xl border border-slate-700/60 shadow-2xl relative">
            <button 
              onClick={() => setBookingModal({ open: false, doctor: null })}
              className="absolute right-4 top-4 text-slate-400 hover:text-white transition"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-white mb-1">Book Consultation Slot</h3>
            <p className="text-xs text-blue-400 mb-6">Securing session with {bookingModal.doctor?.name}</p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Select Date</label>
                <input 
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Preferred Time Slot</label>
                <select 
                  value={bookingData.slot}
                  onChange={(e) => setBookingData(prev => ({ ...prev, slot: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="10:00 AM">10:00 AM (Morning Slot)</option>
                  <option value="11:30 AM">11:30 AM (Late Morning)</option>
                  <option value="02:00 PM">02:00 PM (Afternoon)</option>
                  <option value="04:30 PM">04:30 PM (Evening Session)</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleBookAppointment}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl transition"
            >
              Confirm Appointment
            </button>
          </div>
        </div>
      )}

      {/* 2. Payment Proof Upload Modal */}
      {paymentModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-md p-6 rounded-2xl border border-slate-700/60 shadow-2xl relative">
            <button 
              onClick={() => setPaymentModal({ open: false, appointment: null })}
              className="absolute right-4 top-4 text-slate-400 hover:text-white transition"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-white mb-1">Pay Consultation Fee</h3>
            <p className="text-xs text-emerald-400 mb-6">Direct Transfer / EasyPaisa Portal</p>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2 mb-6">
              <div className="flex justify-between"><span className="font-semibold">Bank Name:</span> <span>HBL Bank Limited</span></div>
              <div className="flex justify-between"><span className="font-semibold">Account Title:</span> <span>Doctor Hub Inc</span></div>
              <div className="flex justify-between"><span className="font-semibold">Account Number:</span> <span className="font-bold text-white">0987-1234-5678-9012</span></div>
              <div className="flex justify-between border-t border-slate-800 pt-2"><span className="font-semibold text-white">Consulation Amount:</span> <span className="text-emerald-400 font-bold">Rs. 2,000</span></div>
            </div>

            <form onSubmit={handlePaymentUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Upload Transaction Screenshot</label>
                <input 
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPaymentFile(e.target.files[0])}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 file:cursor-pointer"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl transition mt-4"
              >
                Submit Payment Receipt
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Record Consultation Modal (Doctor only) */}
      {recordModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="glass-card w-full max-w-2xl p-6 rounded-2xl border border-slate-700/60 shadow-2xl relative my-8">
            <button 
              onClick={() => setRecordModal({ open: false, appointment: null })}
              className="absolute right-4 top-4 text-slate-400 hover:text-white transition"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-white mb-1">Create Immutable Consultation Sheet</h3>
            <p className="text-xs text-purple-400 mb-6">Patient: {recordModal.appointment?.patient_name}</p>

            <form onSubmit={handleRecordPrescription} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Symptom Log</label>
                  <textarea 
                    rows="3"
                    value={recordData.symptoms}
                    onChange={(e) => setRecordData(prev => ({ ...prev, symptoms: e.target.value }))}
                    placeholder="Enter reported clinical symptoms..."
                    required
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Clinical Diagnosis</label>
                  <textarea 
                    rows="3"
                    value={recordData.diagnosis}
                    onChange={(e) => setRecordData(prev => ({ ...prev, diagnosis: e.target.value }))}
                    placeholder="Enter medical diagnosis..."
                    required
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Dietary/Treatment Advice (Notes)</label>
                <textarea 
                  rows="2"
                  value={recordData.notes}
                  onChange={(e) => setRecordData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Extra advice, rest timings, etc..."
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Prescriptions Subform */}
              <div className="border-t border-slate-800 pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-bold text-white">Prescribed Medicines</h4>
                  <button 
                    type="button" 
                    onClick={handleAddPrescriptionField}
                    className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Medicine
                  </button>
                </div>

                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                  {recordData.prescriptions.map((p, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end bg-slate-900/40 p-3 rounded-xl border border-slate-800">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Medicine Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Panadol"
                          value={p.medicine_name}
                          onChange={(e) => handlePrescriptionChange(idx, 'medicine_name', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Dosage</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 1-0-1"
                          value={p.dosage}
                          onChange={(e) => handlePrescriptionChange(idx, 'dosage', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Duration</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 5 Days"
                          value={p.duration}
                          onChange={(e) => handlePrescriptionChange(idx, 'duration', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                        />
                      </div>
                      <div className="flex gap-2 items-center">
                        <div className="flex-1">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Instructions</label>
                          <input 
                            type="text" 
                            placeholder="After meal"
                            value={p.instructions}
                            onChange={(e) => handlePrescriptionChange(idx, 'instructions', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                          />
                        </div>
                        {idx > 0 && (
                          <button 
                            type="button" 
                            onClick={() => handleRemovePrescriptionField(idx)}
                            className="text-red-500 hover:text-red-400 mb-1"
                          >
                            <Trash size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2.5 rounded-xl transition mt-4"
              >
                Sign & Lock Medical Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. View Health History Modal (Doctor lookup) */}
      {historyModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="glass-card w-full max-w-2xl p-6 rounded-2xl border border-slate-700/60 shadow-2xl relative my-8">
            <button 
              onClick={() => setHistoryModal({ open: false, patientId: null, patientName: '', records: [] })}
              className="absolute right-4 top-4 text-slate-400 hover:text-white transition"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-white mb-1">Clinical History Sheet</h3>
            <p className="text-xs text-blue-400 mb-6">Patient: {historyModal.patientName}</p>

            <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
              {historyModal.records.map(record => (
                <div key={record.id} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs">
                  <div className="flex justify-between pb-2 border-b border-slate-800 mb-3 font-semibold text-slate-300">
                    <span>Diagnosis: {record.diagnosis}</span>
                    <span>{new Date(record.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <span className="block text-[10px] uppercase text-slate-500 font-bold mb-1">Symptoms</span>
                      <p className="text-slate-300">{record.symptoms}</p>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase text-slate-500 font-bold mb-1">Advice/Notes</span>
                      <p className="text-slate-300">{record.notes || '-'}</p>
                    </div>
                  </div>

                  {record.prescriptions && record.prescriptions.length > 0 && (
                    <div className="border-t border-slate-800/40 pt-2">
                      <span className="block text-[10px] uppercase text-slate-500 font-bold mb-2">Prescribed Regimen</span>
                      <div className="bg-slate-950/40 p-2 rounded border border-slate-900 space-y-1">
                        {record.prescriptions.map(p => (
                          <div key={p.id} className="flex justify-between text-slate-300">
                            <span className="font-semibold text-white">{p.medicine_name} ({p.dosage})</span>
                            <span className="text-slate-400 font-light">{p.duration} - {p.instructions}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {historyModal.records.length === 0 && (
                <div className="text-center text-slate-500 py-10">No past health logs found for this patient.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab CONTENT: SYSTEM MANAGEMENT */}
      {activeTab === 'system' && (user.role === 'admin' || user.role === 'superadmin') && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <User className="text-orange-400" size={24} />
            <h2 className="text-2xl font-bold text-white">System User Management</h2>
          </div>
          
          <div className="glass-card rounded-2xl overflow-hidden border border-slate-700/50">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-800">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">User ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/20">
                  {allUsers.map(sysUser => (
                    <tr key={sysUser.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 font-mono">
                        #{sysUser.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                        {sysUser.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                        {sysUser.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-[10px] leading-5 font-bold uppercase tracking-widest rounded-full border ${
                          sysUser.role === 'admin' || sysUser.role === 'superadmin' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                          sysUser.role === 'doctor' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                          sysUser.role === 'patient' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {sysUser.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {sysUser.id !== user.id && (
                          <button 
                            onClick={() => setRoleModal({ open: true, user: sysUser, newRole: sysUser.role })}
                            className="text-slate-400 hover:text-white bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg transition text-xs"
                          >
                            Edit Role
                          </button>
                        )}
                        {sysUser.id !== user.id && (
                          <button 
                            onClick={() => setPasswordModal({ open: true, user: sysUser, newPassword: '' })}
                            className="ml-2 text-slate-400 hover:text-white bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg transition text-xs"
                          >
                            Reset Password
                          </button>
                        )}
                        {user.role === 'superadmin' && sysUser.id !== user.id && (
                          <button 
                            onClick={() => handleDeleteUser(sysUser.id)}
                            className="ml-2 text-red-400 hover:text-red-300 bg-red-900/20 border border-red-900/50 px-3 py-1.5 rounded-lg transition text-xs"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {allUsers.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-slate-500">Retrieving system accounts...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. Communication Center / Chat Drawer Modal */}
      {chatModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm p-0">
          <div className="bg-slate-900/95 border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between shadow-2xl relative">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <h3 className="text-sm font-bold text-white">{chatModal.otherUser?.name}</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Secure Consultation Tunnel</p>
                </div>
              </div>
              <button 
                onClick={() => setChatModal({ open: false, otherUser: null, messages: [] })}
                className="text-slate-400 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Message Registry */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900/20">
              {chatModal.messages.map(msg => {
                const isMe = msg.sender_id === user.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${
                      isMe 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                    }`}>
                      <p className="font-semibold text-[10px] opacity-70 mb-1">{isMe ? 'You' : msg.sender_name}</p>
                      <p className="font-light">{msg.message}</p>
                      <span className="block text-[8px] opacity-50 text-right mt-1.5">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
              {chatModal.messages.length === 0 && (
                <div className="text-center text-slate-600 text-xs py-20 font-light italic">
                  Tunnel secure. Type a message below to start communicating.
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 bg-slate-950/40 flex gap-2">
              <input 
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your secure message..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl transition flex items-center justify-center"
              >
                <Send size={16} />
              </button>
            </form>

          </div>
        </div>
      )}

    {/* 6. Edit Role Modal */}
    {roleModal.open && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative">
          <button onClick={() => setRoleModal({ open: false, user: null })} className="absolute top-4 right-4 text-slate-400 hover:text-white transition">
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold text-white mb-6">Modify User Role</h2>
          <form onSubmit={handleUpdateRole} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Select New Role</label>
              <select 
                value={roleModal.newRole || ''}
                onChange={(e) => setRoleModal(prev => ({ ...prev, newRole: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                required
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="assistant">Assistant</option>
                <option value="admin">Admin</option>
                {user.role === 'superadmin' && <option value="superadmin">Super Admin</option>}
              </select>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition">
              Confirm Role Change
            </button>
          </form>
        </div>
      </div>
    )}

    {/* 7. Reset Password Modal */}
    {passwordModal.open && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative">
          <button onClick={() => setPasswordModal({ open: false, user: null })} className="absolute top-4 right-4 text-slate-400 hover:text-white transition">
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold text-white mb-6">Reset Password</h2>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">New Password for {passwordModal.user?.name}</label>
              <input 
                type="text"
                value={passwordModal.newPassword || ''}
                onChange={(e) => setPasswordModal(prev => ({ ...prev, newPassword: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                placeholder="Enter new password"
                required
                minLength="6"
              />
            </div>
            <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl transition">
              Confirm Reset
            </button>
          </form>
        </div>
      </div>
    )}

    </div>
  );
}
