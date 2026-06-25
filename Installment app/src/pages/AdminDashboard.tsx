import React, { useState, useEffect } from 'react';
import { mockDb, type Product } from '../lib/supabaseClient';
import { toast } from 'sonner';
import { Button, Badge, Card, StatCard, PageHeader, Input, Modal, EmptyState } from '../components/ui';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { 
  ShieldAlert, ShieldCheck, Users, FileText, Package, Mail, 
  CreditCard, BarChart3, AlertOctagon, Download, Send, Plus, 
  Trash2, Edit, Check, Ban, Search, CheckCircle, XCircle 
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'customers' | 'products' | 'inquiries' | 'payments' | 'reports' | 'blacklist'>('overview');
  
  // Data States
  const [applications, setApplications] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [blacklist, setBlacklist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected Items for Actions
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  
  // Confirm actions states
  const [appToReject, setAppToReject] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Search filter states
  const [customerSearch, setCustomerSearch] = useState('');
  const [appSearch, setAppSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  // Terms form for approval
  const [approvalTerms, setApprovalTerms] = useState({
    months: 6,
    markup: 12,
    downPayment: 20000,
    lateFee: 5,
    customAmount: 0
  });

  // Product Form State
  const [productForm, setProductForm] = useState({
    id: '',
    name: '',
    price: 0,
    category: '',
    stock: 10,
    description: '',
    images: ['']
  });

  // Reply Forms
  const [replyText, setReplyText] = useState('');
  const [broadcastText, setBroadcastText] = useState('');

  // Payment Recording Form
  const [paymentForm, setPaymentForm] = useState({
    appId: '',
    installmentIndex: 0,
    amountPaid: 0,
    method: 'bank_transfer'
  });

  // Load Admin Data
  const loadData = async () => {
    setLoading(true);
    try {
      const apps = await mockDb.getTable('applications');
      const profiles = await mockDb.getTable('profiles');
      const guars = await mockDb.getTable('guarantors');
      const prods = await mockDb.getTable('products');
      const inqs = await mockDb.getTable('inquiries');
      const pays = await mockDb.getTable('payments');
      const logs = await mockDb.getTable('auditLogs');
      const black = await mockDb.getTable('blacklist');

      const mappedApps = apps.map((app: any) => ({
        ...app,
        customer: profiles.find((p: any) => p.id === app.customer_id),
        product: prods.find((p: any) => p.id === app.product_id),
        guarantor: guars.find((g: any) => g.application_id === app.id)
      }));

      setApplications(mappedApps);
      setCustomers(profiles.filter((p: any) => p.role === 'customer'));
      setProducts(prods);
      setInquiries(inqs);
      setPayments(pays);
      setAuditLogs(logs);
      setBlacklist(black);
    } catch (e) {
      toast.error("Failed to sync system data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Summary Metrics
  const totalCustomersCount = customers.length;
  const pendingRequestsCount = applications.filter(a => a.status === 'pending').length;
  const approvedRequestsCount = applications.filter(a => a.status === 'approved').length;
  const rejectedRequestsCount = applications.filter(a => a.status === 'rejected').length;

  const totalCollections = payments.reduce((sum, p) => sum + Number(p.amount_paid), 0);
  const expectedRevenue = applications
    .filter(a => a.status === 'approved')
    .reduce((sum, a) => sum + Number(a.total_payable), 0);

  const overdueCustomers = applications.filter(a => 
    a.status === 'approved' && a.repayment_schedule?.some((s: any) => s.status === 'late')
  ).length;

  // Chart Data preparation
  const revenueChartData = [
    { name: 'Jan', Collections: 45000, Revenue: 50000 },
    { name: 'Feb', Collections: 52000, Revenue: 62000 },
    { name: 'Mar', Collections: 61000, Revenue: 75000 },
    { name: 'Apr', Collections: 78050, Revenue: 90000 },
    { name: 'May', Collections: totalCollections > 0 ? totalCollections : 85000, Revenue: expectedRevenue > 0 ? expectedRevenue : 120000 },
  ];

  const approvalRatioData = [
    { name: 'Approved', value: approvedRequestsCount > 0 ? approvedRequestsCount : 4 },
    { name: 'Pending', value: pendingRequestsCount > 0 ? pendingRequestsCount : 2 },
    { name: 'Rejected', value: rejectedRequestsCount > 0 ? rejectedRequestsCount : 1 },
  ];
  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  // Actions handlers
  const handleToggleBlacklist = async (value: string) => {
    try {
      let newBlacklist = [...blacklist];
      const isBlocking = !newBlacklist.includes(value);
      if (!isBlocking) {
        newBlacklist = newBlacklist.filter(v => v !== value);
      } else {
        newBlacklist.push(value);
      }
      await mockDb.saveTable('blacklist', newBlacklist);
      setBlacklist(newBlacklist);

      // If matches any active user profile, toggle is_blacklisted column
      const profiles = await mockDb.getTable('profiles');
      const updatedProfiles = profiles.map((p: any) => ({
        ...p,
        is_blacklisted: newBlacklist.includes(p.cnic) || newBlacklist.includes(p.phone)
      }));
      await mockDb.saveTable('profiles', updatedProfiles);
      
      // Log Activity
      await mockDb.insert('auditLogs', {
        action: 'toggle_blacklist',
        details: { identifier: value, action: isBlocking ? 'block' : 'unblock' }
      });

      loadData();
      toast.success(isBlocking ? `Blocked: ${value}` : `Unblocked: ${value}`);
    } catch (e) {
      toast.error("Failed to update blacklist status.");
    }
  };

  const handleInquiryReply = async (inqId: string) => {
    if (!replyText.trim()) return;
    try {
      const inq = inquiries.find(i => i.id === inqId);
      if (inq) {
        await mockDb.update('inquiries', inqId, {
          reply_content: replyText,
          status: 'replied',
          replied_at: new Date().toISOString()
        });
        setReplyText('');
        loadData();
        toast.success(`Reply sent successfully to ${inq.email}`);
      }
    } catch (e) {
      toast.error("Failed to submit reply.");
    }
  };

  const handleBroadcast = async () => {
    if (!broadcastText.trim()) return;
    try {
      await mockDb.insert('announcements', {
        title: 'Important Broadcast Notice',
        content: broadcastText,
        type: 'news',
        is_active: true
      });
      setBroadcastText('');
      loadData();
      toast.success('Global announcement published to Homepage successfully.');
    } catch (e) {
      toast.error("Failed to broadcast announcement.");
    }
  };

  const handleOpenApproval = (app: any) => {
    setSelectedApp(app);
    setApprovalTerms({
      months: app.installments_count || 6,
      markup: app.markup_percent || 12,
      downPayment: Math.round(app.product?.price * 0.2) || 20000,
      lateFee: 5,
      customAmount: 0
    });
    setIsApprovalModalOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedApp) return;

    try {
      const price = selectedApp.product?.price || 0;
      const down = approvalTerms.downPayment;
      const principal = price - down;
      const markupAmt = principal * (approvalTerms.markup / 100);
      const totalPayable = principal + markupAmt;

      const monthlyAmt = approvalTerms.customAmount > 0 
        ? approvalTerms.customAmount 
        : Math.round(totalPayable / approvalTerms.months);

      const schedule = Array.from({ length: approvalTerms.months }).map((_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() + i + 1);
        return {
          dueDate: d.toISOString().split('T')[0],
          amount: monthlyAmt,
          status: 'pending'
        };
      });

      await mockDb.update('applications', selectedApp.id, {
        status: 'approved',
        installments_count: approvalTerms.months,
        markup_percent: approvalTerms.markup,
        down_payment: down,
        late_fee_percent: approvalTerms.lateFee,
        total_payable: totalPayable,
        repayment_schedule: schedule
      });

      // Log Activity
      await mockDb.insert('auditLogs', {
        action: 'approve_application',
        details: { applicationId: selectedApp.id, terms: approvalTerms }
      });

      setIsApprovalModalOpen(false);
      setSelectedApp(null);
      loadData();
      toast.success('Application Approved successfully.');
    } catch (e) {
      toast.error("Approval transaction failed.");
    }
  };

  const handleReject = async (appId: string) => {
    try {
      await mockDb.update('applications', appId, { status: 'rejected' });
      
      // Log Activity
      await mockDb.insert('auditLogs', {
        action: 'reject_application',
        details: { applicationId: appId }
      });

      loadData();
      toast.success('Application has been rejected.');
      setAppToReject(null);
    } catch (e) {
      toast.error("Failed to reject application.");
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (productForm.id) {
        await mockDb.update('products', productForm.id, {
          name: productForm.name,
          price: productForm.price,
          category: productForm.category,
          stock: productForm.stock,
          description: productForm.description
        });
        toast.success("Product modified successfully.");
      } else {
        await mockDb.insert('products', {
          name: productForm.name,
          price: productForm.price,
          category: productForm.category,
          stock: productForm.stock,
          description: productForm.description,
          images: ['https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=600']
        });
        toast.success("New product uploaded to catalog.");
      }
      setIsProductModalOpen(false);
      setProductForm({ id: '', name: '', price: 0, category: '', stock: 10, description: '', images: [''] });
      loadData();
    } catch (e) {
      toast.error("Failed to save product details.");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await mockDb.delete('products', id);
      loadData();
      toast.success('Product deleted from inventory.');
      setProductToDelete(null);
    } catch (e) {
      toast.error("Failed to delete product.");
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentForm.appId || paymentForm.amountPaid <= 0) return;
    
    try {
      const app = applications.find(a => a.id === paymentForm.appId);
      if (app) {
        // Record payment row
        await mockDb.insert('payments', {
          application_id: paymentForm.appId,
          installment_index: paymentForm.installmentIndex,
          amount_paid: paymentForm.amountPaid,
          due_amount: app.repayment_schedule[paymentForm.installmentIndex]?.amount || 0,
          payment_method: paymentForm.method
        });

        // Update application schedule status
        const updatedSchedule = [...app.repayment_schedule];
        if (updatedSchedule[paymentForm.installmentIndex]) {
          updatedSchedule[paymentForm.installmentIndex].status = 'paid';
          updatedSchedule[paymentForm.installmentIndex].paidAmount = paymentForm.amountPaid;
          updatedSchedule[paymentForm.installmentIndex].paidDate = new Date().toISOString().split('T')[0];
        }

        await mockDb.update('applications', paymentForm.appId, {
          repayment_schedule: updatedSchedule
        });

        setPaymentForm({ appId: '', installmentIndex: 0, amountPaid: 0, method: 'bank_transfer' });
        loadData();
        toast.success('Collection recorded successfully. Digital receipt generated.');
      }
    } catch (e) {
      toast.error("Could not record collection payment.");
    }
  };

  const handleExport = (format: 'pdf' | 'csv' | 'excel', reportName: string) => {
    toast.success(`Exporting ${reportName} in ${format.toUpperCase()} format...`, {
      description: "Processing report file generation. Ready for download shortly."
    });
  };

  // Mapped Filters
  const filteredCustomers = customers.filter(c => 
    c.full_name?.toLowerCase().includes(customerSearch.toLowerCase()) || 
    c.phone?.includes(customerSearch) ||
    c.cnic?.includes(customerSearch)
  );

  const filteredApps = applications.filter(a => 
    a.customer?.full_name?.toLowerCase().includes(appSearch.toLowerCase()) ||
    a.product?.name?.toLowerCase().includes(appSearch.toLowerCase()) ||
    a.status?.toLowerCase() === appSearch.toLowerCase()
  );

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category?.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Sidebar Nav */}
      <div className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800/60 p-5 space-y-2 shrink-0 md:sticky md:top-16 md:h-[calc(100vh-4rem)] overflow-y-auto">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 mb-4">Administration</h2>
        {[
          { id: 'overview', label: '📊 Metrics & Charts' },
          { id: 'applications', label: '🗒️ Installment requests' },
          { id: 'customers', label: '👥 Customer monitoring' },
          { id: 'products', label: '🛍️ Products catalog' },
          { id: 'inquiries', label: '✉️ Inquiries & Inbox' },
          { id: 'payments', label: '💳 Payment tracking' },
          { id: 'reports', label: '📈 Reports export' },
          { id: 'blacklist', label: '🛡️ Blacklist & Audit' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
              activeTab === tab.id
                ? 'bg-indigo-50 text-indigo-650 dark:bg-indigo-950/40 dark:text-indigo-400 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto max-w-7xl">

        {/* 1. OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <PageHeader title="Admin Dashboard Overview" subtitle="Track applications, revenue collections, overdue clients and growth metrics." />
            
            {/* Grid Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatCard label="Total Customers" value={totalCustomersCount} icon={<Users className="w-5 h-5" />} color="indigo" />
              <StatCard label="Pending Requests" value={pendingRequestsCount} icon={<FileText className="w-5 h-5" />} color="amber" />
              <StatCard label="Overdue Customers" value={overdueCustomers} icon={<AlertOctagon className="w-5 h-5" />} color="rose" />
              <StatCard label="Total Collections" value={`Rs. ${totalCollections.toLocaleString()}`} icon={<CreditCard className="w-5 h-5" />} color="emerald" />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Revenue */}
              <Card className="space-y-4">
                <h3 className="font-bold text-sm text-foreground">Monthly Revenue & Collection Analysis</h3>
                <div className="h-64 pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156,163,175,0.15)" />
                      <XAxis dataKey="name" stroke="currentColor" className="text-xs text-muted-foreground" />
                      <YAxis stroke="currentColor" className="text-xs text-muted-foreground" />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                      <Legend />
                      <Line type="monotone" dataKey="Revenue" stroke="#6366F1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Collections" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Approval Ratio */}
              <Card className="space-y-4 flex flex-col justify-between">
                <h3 className="font-bold text-sm text-foreground">Application Approval Ratio</h3>
                <div className="h-48 flex justify-center items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={approvalRatioData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {approvalRatioData.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center space-x-6 text-xs font-semibold">
                  <span className="text-emerald-600 flex items-center gap-1.5">● Approved ({approvedRequestsCount})</span>
                  <span className="text-amber-600 flex items-center gap-1.5">● Pending ({pendingRequestsCount})</span>
                  <span className="text-rose-600 flex items-center gap-1.5">● Rejected ({rejectedRequestsCount})</span>
                </div>
              </Card>

            </div>
          </div>
        )}

        {/* 2. APPLICATIONS */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            <PageHeader 
              title="Installment Requests Portal" 
              subtitle="Approve or decline client installments. View guarantor records."
              actions={
                <div className="relative w-full max-w-xs">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search applicant or product..."
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    className="pl-9 p-2.5 w-full border border-slate-200 dark:border-slate-800 rounded-xl bg-card text-xs focus:ring-2 focus:ring-ring outline-none"
                  />
                </div>
              }
            />

            <Card className="p-0 overflow-hidden border border-slate-200/50 dark:border-slate-800/80 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/80 text-xs font-bold uppercase text-muted-foreground">
                    <tr>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Product</th>
                      <th className="p-4">Guarantor</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredApps.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-foreground">{app.customer?.full_name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">CNIC: {app.customer?.cnic}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-foreground">{app.product?.name}</p>
                          <p className="text-xs text-indigo-650 dark:text-indigo-400 font-bold mt-0.5">Rs. {app.product?.price.toLocaleString()}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-medium text-foreground">{app.guarantor?.full_name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Ph: {app.guarantor?.phone}</p>
                        </td>
                        <td className="p-4">
                          <Badge variant={
                            app.status === 'approved' ? 'success' :
                            app.status === 'pending' ? 'warning' : 'error'
                          }>
                            {app.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {app.status === 'pending' ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleOpenApproval(app)}
                                className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 border-none"
                              >
                                Approve / Terms
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => setAppToReject(app.id)}
                                className="h-8 text-xs"
                              >
                                Reject
                              </Button>
                            </>
                          ) : (
                            <span className="text-muted-foreground text-xs font-semibold">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredApps.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-muted-foreground">No applications found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* 3. CUSTOMER MONITORING */}
        {activeTab === 'customers' && (
          <div className="space-y-4">
            <PageHeader 
              title="Customer Monitoring Center" 
              subtitle="Examine credit safety, verification badges, and WhatsApp communication hooks."
              actions={
                <div className="relative w-full max-w-xs">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search name, phone, CNIC..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="pl-9 p-2.5 w-full border border-slate-200 dark:border-slate-800 rounded-xl bg-card text-xs focus:ring-2 focus:ring-ring outline-none"
                  />
                </div>
              }
            />

            <Card className="p-0 overflow-hidden border border-slate-200/50 dark:border-slate-800/80 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/80 text-xs font-semibold text-muted-foreground uppercase">
                    <tr>
                      <th className="p-4">Name</th>
                      <th className="p-4">Contact Info</th>
                      <th className="p-4">Verification</th>
                      <th className="p-4">Outstanding Plans</th>
                      <th className="p-4 text-right">Direct Outreach</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredCustomers.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-foreground">{c.full_name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">CNIC: {c.cnic || 'Not Uploaded'}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-foreground">{c.phone || c.email}</p>
                        </td>
                        <td className="p-4">
                          <Badge variant={c.manual_verification_status === 'verified' ? 'success' : 'warning'}>
                            {c.manual_verification_status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-4 font-bold text-indigo-650 dark:text-indigo-400">
                          {applications.filter(a => a.customer_id === c.id).length} Active plans
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <a
                            href={`https://wa.me/${c.phone?.replace(/[+ -]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-450 rounded-xl text-xs font-bold hover:bg-emerald-100/80 transition-colors"
                          >
                            WhatsApp
                          </a>
                          <a
                            href={`tel:${c.phone}`}
                            className="inline-flex items-center px-3 py-1.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-350 rounded-xl text-xs font-bold hover:bg-slate-200/80 transition-colors"
                          >
                            Call
                          </a>
                        </td>
                      </tr>
                    ))}
                    {filteredCustomers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-muted-foreground">No customers found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* 4. PRODUCTS */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <PageHeader 
              title="Products Catalog Inventory" 
              subtitle="Add and update items, modify pricing, and review stock availability."
              actions={
                <div className="flex items-center gap-3">
                  <div className="relative w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search inventory..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="pl-8 p-2 w-full border border-slate-200 dark:border-slate-800 rounded-xl bg-card text-xs focus:ring-2 focus:ring-ring outline-none"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      setProductForm({ id: '', name: '', price: 0, category: '', stock: 10, description: '', images: [''] });
                      setIsProductModalOpen(true);
                    }}
                    icon={<Plus className="w-4 h-4" />}
                  >
                    Add Product
                  </Button>
                </div>
              }
            />

            <Card className="p-0 overflow-hidden border border-slate-200/50 dark:border-slate-800/80 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/80 text-xs font-semibold text-muted-foreground uppercase">
                    <tr>
                      <th className="p-4">Product Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                        <td className="p-4 flex items-center space-x-3">
                          {p.images?.[0] && <img src={p.images[0]} alt="" className="w-10 h-10 object-cover rounded-lg border dark:border-slate-800 shrink-0" />}
                          <p className="font-bold text-foreground">{p.name}</p>
                        </td>
                        <td className="p-4 font-semibold text-muted-foreground">{p.category}</td>
                        <td className="p-4 font-black text-indigo-650 dark:text-indigo-400">Rs. {p.price.toLocaleString()}</td>
                        <td className="p-4">
                          <Badge variant={p.stock > 0 ? 'success' : 'error'}>
                            {p.stock} units
                          </Badge>
                        </td>
                        <td className="p-4 text-right space-x-3">
                          <button
                            onClick={() => {
                              setProductForm({ id: p.id, name: p.name, price: p.price, category: p.category || '', stock: p.stock, description: p.description || '', images: p.images || [''] });
                              setIsProductModalOpen(true);
                            }}
                            className="inline-flex items-center text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                          >
                            <Edit className="w-3 h-3 mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => setProductToDelete(p.id)}
                            className="inline-flex items-center text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline"
                          >
                            <Trash2 className="w-3 h-3 mr-1" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-muted-foreground">No inventory items.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* 5. INQUIRIES & BROADCST */}
        {activeTab === 'inquiries' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Inquiries List */}
            <div className="lg:col-span-2 space-y-4">
              <PageHeader title="Customer Inquiry Inbox" subtitle="Respond to incoming contact message queries from public page." />
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <Card key={inq.id} className="space-y-3 relative shadow-sm border border-slate-200/50 dark:border-slate-800/80">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-extrabold text-foreground">{inq.name}</h4>
                        <p className="text-xs text-muted-foreground">{inq.email} | {inq.phone || 'No Phone'}</p>
                      </div>
                      <Badge variant={inq.status === 'replied' ? 'success' : 'warning'}>
                        {inq.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/40 text-foreground">{inq.message}</p>
                    
                    {inq.reply_content ? (
                      <div className="text-xs bg-indigo-50/50 dark:bg-indigo-950/20 p-3 rounded-xl border border-indigo-100/40 dark:border-indigo-900/40 text-indigo-800 dark:text-indigo-400">
                        <span className="font-extrabold flex items-center gap-1.5 mb-1"><Check className="w-3.5 h-3.5" /> Admin Reply:</span> 
                        {inq.reply_content}
                      </div>
                    ) : (
                      <div className="flex gap-2 pt-2">
                        <input
                          type="text"
                          placeholder="Type reply here..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="flex-1 p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-card focus:ring-2 focus:ring-ring outline-none"
                        />
                        <Button
                          onClick={() => handleInquiryReply(inq.id)}
                          icon={<Send className="w-3.5 h-3.5" />}
                          className="text-xs py-2 bg-indigo-600 hover:bg-indigo-700"
                        >
                          Reply Email
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
                {inquiries.length === 0 && (
                  <EmptyState title="Inbox Empty" description="There are no active client inquiries." icon={<Mail className="w-8 h-8 text-indigo-500" />} />
                )}
              </div>
            </div>

            {/* Right: Announcement Broadcast */}
            <div className="space-y-4">
              <PageHeader title="Broadcast" subtitle="Global banner alerts." />
              <Card className="space-y-4">
                <h3 className="font-bold text-sm text-foreground">Publish Homepage Alert</h3>
                <textarea
                  rows={4}
                  placeholder="Type discount campaign, service updates, or important announcements for homepage..."
                  value={broadcastText}
                  onChange={(e) => setBroadcastText(e.target.value)}
                  className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl text-sm bg-card text-foreground focus:ring-2 focus:ring-ring outline-none"
                />
                <Button
                  onClick={handleBroadcast}
                  className="w-full"
                  icon={<Send className="w-4 h-4" />}
                >
                  Broadcast Notice
                </Button>
              </Card>
            </div>

          </div>
        )}

        {/* 6. PAYMENTS TRACKING */}
        {activeTab === 'payments' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Record Form */}
            <div className="space-y-4">
              <PageHeader title="Record Collection" subtitle="Log manual client payments." />
              <form onSubmit={handleRecordPayment}>
                <Card className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">Select Active Loan Client *</label>
                    <select
                      value={paymentForm.appId}
                      onChange={(e) => setPaymentForm({ ...paymentForm, appId: e.target.value })}
                      className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-card text-sm text-foreground focus:ring-2 focus:ring-ring outline-none font-semibold"
                    >
                      <option value="" disabled>Choose application</option>
                      {applications.filter(a => a.status === 'approved').map((app) => (
                        <option key={app.id} value={app.id}>
                          {app.customer?.full_name} - {app.product?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">Installment Month *</label>
                    <select
                      value={paymentForm.installmentIndex}
                      onChange={(e) => setPaymentForm({ ...paymentForm, installmentIndex: Number(e.target.value) })}
                      className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-card text-sm text-foreground focus:ring-2 focus:ring-ring outline-none font-semibold"
                    >
                      {applications.find(a => a.id === paymentForm.appId)?.repayment_schedule?.map((s: any, idx: number) => (
                        <option key={idx} value={idx}>
                          Month {idx + 1} - Rs. {s.amount.toLocaleString()} ({s.status.toUpperCase()})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">Amount Paid (Rs.) *</label>
                    <input
                      type="number"
                      required
                      value={paymentForm.amountPaid}
                      onChange={(e) => setPaymentForm({ ...paymentForm, amountPaid: Number(e.target.value) })}
                      className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-card text-sm text-foreground focus:ring-2 focus:ring-ring outline-none font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">Payment Mode *</label>
                    <select
                      value={paymentForm.method}
                      onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                      className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-card text-sm text-foreground focus:ring-2 focus:ring-ring outline-none font-semibold"
                    >
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="easypaisa">Easypaisa</option>
                      <option value="jazzcash">JazzCash</option>
                      <option value="cash">Cash Collection</option>
                    </select>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    icon={<CreditCard className="w-4 h-4" />}
                  >
                    Record Payment & Invoice
                  </Button>
                </Card>
              </form>
            </div>

            {/* Payments List */}
            <div className="lg:col-span-2 space-y-4">
              <PageHeader title="Collections Log History" subtitle="List of recorded incoming installment transaction receipts." />
              <Card className="p-0 overflow-hidden border border-slate-200/50 dark:border-slate-800/80 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/80 text-xs font-bold text-muted-foreground uppercase">
                      <tr>
                        <th className="p-4">Paid By</th>
                        <th className="p-4">Term Index</th>
                        <th className="p-4">Amount Paid</th>
                        <th className="p-4">Paid At</th>
                        <th className="p-4 text-right">Method</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {payments.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-foreground">ID: {p.application_id?.substring(0,8)}</p>
                          </td>
                          <td className="p-4 font-semibold text-foreground">Installment {p.installment_index + 1}</td>
                          <td className="p-4 font-extrabold text-emerald-600 dark:text-emerald-400">Rs. {p.amount_paid?.toLocaleString()}</td>
                          <td className="p-4 text-slate-500 text-xs">{p.paid_at?.split('T')[0]}</td>
                          <td className="p-4 text-right capitalize font-semibold text-foreground">{p.payment_method?.replace('_', ' ')}</td>
                        </tr>
                      ))}
                      {payments.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-muted-foreground">No payments logged yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

          </div>
        )}

        {/* 7. REPORTS MODULE */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <PageHeader title="Accounting Reports Export" subtitle="Generate files on credit accounts, collections, and late-payment risk lists." />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Collections Audit Report', desc: 'Detailed log of all installments collected, pending and late fees.' },
                { name: 'Defaulters Risk Assessment', desc: 'Lists overdue customers with high-risk status, warning tags, and guarantor references.' },
                { name: 'Guarantor Compliance Report', desc: 'Details all registered guarantors, guaranteed clients and credit exposure.' },
                { name: 'Monthly Revenue Plan', desc: 'Shows expected incoming installment collection schedules for upcoming months.' }
              ].map((rep, idx) => (
                <Card key={idx} className="flex flex-col justify-between p-6 shadow-sm border border-slate-200/50 dark:border-slate-800/80">
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-base leading-tight text-foreground">{rep.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{rep.desc}</p>
                  </div>
                  <div className="flex flex-col gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleExport('pdf', rep.name)}
                      className="text-xs font-semibold justify-center"
                    >
                      <Download className="w-3.5 h-3.5 mr-1 text-rose-500" /> Export PDF
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleExport('csv', rep.name)}
                      className="text-xs font-semibold justify-center"
                    >
                      <Download className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Export CSV
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 8. BLACKLIST & AUDIT LOGS */}
        {activeTab === 'blacklist' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Blacklist Control */}
            <div className="space-y-4">
              <PageHeader title="Blacklist Hub" subtitle="Block defaulters instantly." />
              <Card className="space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">Blocked entities will be immediately restricted from requesting new installments.</p>
                
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {blacklist.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                      <span className="font-mono font-semibold text-foreground">{item}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleBlacklist(item)}
                        className="text-rose-600 hover:text-rose-700 h-7 text-[10px] font-extrabold"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  {blacklist.length === 0 && (
                    <p className="text-xs text-muted-foreground py-4 text-center">Blacklist is currently empty.</p>
                  )}
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-850">
                  <input
                    type="text"
                    placeholder="Enter CNIC or Phone..."
                    id="blacklist-input"
                    className="flex-1 p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-card text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <Button
                    onClick={() => {
                      const el = document.getElementById('blacklist-input') as HTMLInputElement;
                      if (el?.value.trim()) {
                        handleToggleBlacklist(el.value.trim());
                        el.value = '';
                      }
                    }}
                    className="bg-rose-600 hover:bg-rose-700 border-none text-xs py-2 px-3"
                  >
                    <Ban className="w-3.5 h-3.5 mr-1" />
                    Block
                  </Button>
                </div>
              </Card>
            </div>

            {/* Audit Logs */}
            <div className="lg:col-span-2 space-y-4">
              <PageHeader title="System Audit logs" subtitle="Log of all admin operations." />
              <Card className="p-0 overflow-hidden border border-slate-200/50 dark:border-slate-800/80 shadow-sm max-h-96 overflow-y-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/80 text-xs font-bold text-muted-foreground uppercase">
                    <tr>
                      <th className="p-4">Action</th>
                      <th className="p-4">Log Details</th>
                      <th className="p-4 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                        <td className="p-4 font-bold text-indigo-650 dark:text-indigo-400 capitalize">{log.action?.replace(/_/g, ' ')}</td>
                        <td className="p-4 font-mono text-muted-foreground leading-normal">{JSON.stringify(log.details)}</td>
                        <td className="p-4 text-right text-slate-500">{log.created_at?.split('T')[1]?.substring(0,5)}</td>
                      </tr>
                    ))}
                    {auditLogs.length === 0 && (
                      <tr>
                        <td colSpan={3} className="text-center py-8 text-muted-foreground">No audit logs recorded.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Card>
            </div>

          </div>
        )}

      </div>

      {/* MODAL: Loan Term approval configuration */}
      <Modal open={isApprovalModalOpen && selectedApp !== null} onClose={() => setIsApprovalModalOpen(false)} title={`Configure Loan Terms`}>
        {selectedApp && (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">Adjust repayments and down payment for <span className="font-bold text-foreground">{selectedApp.customer?.full_name}</span>.</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Number of Installments</label>
                <select
                  value={approvalTerms.months}
                  onChange={(e) => setApprovalTerms({ ...approvalTerms, months: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-card rounded-xl text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                >
                  {[3, 6, 9, 12, 18, 24].map(m => (
                    <option key={m} value={m}>{m} Months</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Markup Percentage (%)</label>
                <input
                  type="number"
                  value={approvalTerms.markup}
                  onChange={(e) => setApprovalTerms({ ...approvalTerms, markup: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-card rounded-xl text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Down Payment Paid (Rs.)</label>
                <input
                  type="number"
                  value={approvalTerms.downPayment}
                  onChange={(e) => setApprovalTerms({ ...approvalTerms, downPayment: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-card rounded-xl text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Late Fee Percent (%)</label>
                <input
                  type="number"
                  value={approvalTerms.lateFee}
                  onChange={(e) => setApprovalTerms({ ...approvalTerms, lateFee: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-card rounded-xl text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Custom Monthly Installment (Leave 0 to Auto calculate)</label>
              <input
                type="number"
                value={approvalTerms.customAmount}
                onChange={(e) => setApprovalTerms({ ...approvalTerms, customAmount: Number(e.target.value) })}
                className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-card rounded-xl text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100 dark:border-slate-850">
              <Button
                variant="secondary"
                onClick={() => setIsApprovalModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleApprove}
                className="bg-emerald-600 hover:bg-emerald-700 border-none"
              >
                Approve & Repayment Plan
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL: Product Add/Edit */}
      <Modal open={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} title={productForm.id ? 'Edit Catalog Product' : 'Add New Catalog Product'}>
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">Product Name *</label>
            <input
              type="text"
              required
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-card rounded-xl text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">Price (Rs.) *</label>
              <input
                type="number"
                required
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-card rounded-xl text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">Category *</label>
              <input
                type="text"
                required
                placeholder="e.g. Laptops"
                value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-card rounded-xl text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">Stock count</label>
              <input
                type="number"
                value={productForm.stock}
                onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-card rounded-xl text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">Description</label>
              <input
                type="text"
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-card rounded-xl text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100 dark:border-slate-850">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsProductModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
            >
              Save Product
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Modals (Replacing Native Prompt/Confirm) */}
      <Modal open={appToReject !== null} onClose={() => setAppToReject(null)} title="Confirm Rejection">
        <div className="space-y-4">
          <p className="text-sm text-foreground leading-relaxed">Are you absolutely sure you want to decline this installment application? This action will mark the request as rejected and notify the client.</p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setAppToReject(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => appToReject && handleReject(appToReject)}>Reject Application</Button>
          </div>
        </div>
      </Modal>

      <Modal open={productToDelete !== null} onClose={() => setProductToDelete(null)} title="Delete Product">
        <div className="space-y-4">
          <p className="text-sm text-foreground leading-relaxed">Confirm deletion of this product from the inventory catalog? This action cannot be undone.</p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setProductToDelete(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => productToDelete && handleDeleteProduct(productToDelete)}>Delete Product</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
