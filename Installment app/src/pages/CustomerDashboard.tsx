import React, { useState, useEffect } from 'react';
import { mockDb } from '../lib/supabaseClient';
import { toast } from 'sonner';
import { Button, Badge, Card, StatCard, PageHeader, EmptyState } from '../components/ui';
import { CreditCard, Calendar, FileText, CheckCircle, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface CustomerDashboardProps {
  user: any;
  onApplyNew: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ user, onApplyNew }) => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const apps = await mockDb.getTable('applications');
        const products = await mockDb.getTable('products');
        
        // Filter for current customer
        const userApps = apps
          .filter((app: any) => app.customer_id === user.id)
          .map((app: any) => ({
            ...app,
            product: products.find((p: any) => p.id === app.product_id)
          }));

        setApplications(userApps);
        if (userApps.length > 0) {
          setSelectedApp(userApps[0]);
        }
      } catch (err) {
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Calculate metrics
  const totalApproved = applications.filter(a => a.status === 'approved').length;
  const totalPending = applications.filter(a => a.status === 'pending').length;
  
  const totalPaidAmount = applications
    .filter(a => a.status === 'approved')
    .reduce((acc, app) => {
      const paid = app.repayment_schedule
        ?.filter((s: any) => s.status === 'paid')
        ?.reduce((sAcc: number, item: any) => sAcc + item.amount, 0) || 0;
      return acc + paid;
    }, 0);

  const totalRemaining = applications
    .filter(a => a.status === 'approved')
    .reduce((acc, app) => {
      const unpaid = app.repayment_schedule
        ?.filter((s: any) => s.status === 'pending' || s.status === 'late')
        ?.reduce((sAcc: number, item: any) => sAcc + item.amount, 0) || 0;
      return acc + unpaid;
    }, 0);

  const upcomingPayments = applications
    .filter(a => a.status === 'approved')
    .flatMap(app => 
      (app.repayment_schedule || [])
        .filter((s: any) => s.status === 'pending')
        .map((s: any) => ({ ...s, productName: app.product?.name, appId: app.id }))
    )
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const handleSimulatePayment = async (appId: string, index: number) => {
    try {
      const apps = await mockDb.getTable('applications');
      const appIdx = apps.findIndex((a: any) => a.id === appId);
      if (appIdx !== -1) {
        const app = apps[appIdx];
        app.repayment_schedule[index].status = 'paid';
        app.repayment_schedule[index].paidDate = new Date().toISOString().split('T')[0];
        
        await mockDb.update('applications', appId, { repayment_schedule: app.repayment_schedule });
        
        // Refresh state
        const products = await mockDb.getTable('products');
        const userApps = apps
          .filter((app: any) => app.customer_id === user.id)
          .map((app: any) => ({
            ...app,
            product: products.find((p: any) => p.id === app.product_id)
          }));
        setApplications(userApps);
        setSelectedApp(userApps.find((a: any) => a.id === appId));
        toast.success('Payment received successfully. Simulated invoice generated.', {
          description: `Paid Rs. ${app.repayment_schedule[index].amount.toLocaleString()} for ${app.product?.name || 'Installment'}`
        });
      }
    } catch (err) {
      toast.error('Payment simulation failed.');
    }
  };

  const handleSimulateInvoiceDownload = (app: any, schedItem: any) => {
    toast.info(`Invoice Ref: INV-${app.id.substring(0,6)}-${schedItem.dueDate}`, {
      description: `Due Amount: Rs. ${schedItem.amount.toLocaleString()} | Status: ${schedItem.status.toUpperCase()}`,
      action: {
        label: "Open PDF",
        onClick: () => window.open('#', '_blank')
      }
    });
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <PageHeader 
          title="Customer Dashboard" 
          subtitle={`Welcome back, ${user.full_name}. Track your credit and monthly dues.`}
          actions={
            <Button
              onClick={onApplyNew}
              icon={<CreditCard className="w-4 h-4" />}
            >
              Apply for New Installment
            </Button>
          }
        />

        {/* Dashboard Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Approved Installments"
            value={totalApproved}
            icon={<CheckCircle className="w-5 h-5" />}
            color="indigo"
          />
          <StatCard
            label="Pending Requests"
            value={totalPending}
            icon={<Clock className="w-5 h-5" />}
            color="amber"
          />
          <StatCard
            label="Paid Installments"
            value={`Rs. ${totalPaidAmount.toLocaleString()}`}
            icon={<CheckCircle className="w-5 h-5" />}
            color="emerald"
          />
          <StatCard
            label="Remaining Balance"
            value={`Rs. ${totalRemaining.toLocaleString()}`}
            icon={<AlertTriangle className="w-5 h-5" />}
            color="rose"
          />
        </div>

        {/* Content Layout */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Card className="h-48 animate-pulse bg-slate-100 dark:bg-slate-900"></Card>
              <Card className="h-64 animate-pulse bg-slate-100 dark:bg-slate-900"></Card>
            </div>
            <Card className="h-96 animate-pulse bg-slate-100 dark:bg-slate-900"></Card>
          </div>
        ) : applications.length === 0 ? (
          <EmptyState
            icon="🗒️"
            title="No Installment Applications Found"
            description="You have not applied for any installment plans yet. Browse products and tap Apply to start."
            action={
              <Button onClick={onApplyNew}>
                Browse Products
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Side: Selected Application Details */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Selector */}
              <Card className="p-4 flex items-center space-x-3 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-sm">
                <label className="text-xs font-semibold text-muted-foreground uppercase whitespace-nowrap">Switch Application:</label>
                <select
                  value={selectedApp?.id || ''}
                  onChange={(e) => setSelectedApp(applications.find(a => a.id === e.target.value))}
                  className="p-2.5 border rounded-xl bg-background text-sm font-semibold border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-ring flex-1 outline-none text-foreground"
                >
                  {applications.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.product?.name} (Status: {app.status.toUpperCase()})
                    </option>
                  ))}
                </select>
              </Card>

              {selectedApp && (
                <>
                  {/* Status Detail Card */}
                  <Card className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg text-foreground">Application Details</h3>
                      <Badge variant={
                        selectedApp.status === 'approved' ? 'success' :
                        selectedApp.status === 'pending' ? 'warning' : 'error'
                      } dot>
                        {selectedApp.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Payable Amount</p>
                        <p className="font-extrabold text-foreground mt-1">Rs. {selectedApp.total_payable.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Down Payment Paid</p>
                        <p className="font-extrabold text-foreground mt-1">Rs. {selectedApp.down_payment.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Installments Plan</p>
                        <p className="font-extrabold text-foreground mt-1">{selectedApp.installments_count} Months</p>
                      </div>
                    </div>
                  </Card>

                  {/* Installment Schedule */}
                  <Card className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-sm space-y-4">
                    <h3 className="font-bold text-lg text-foreground">Repayment Schedule</h3>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 dark:border-slate-800 text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                            <th className="py-3 px-1">Month</th>
                            <th className="py-3 px-1">Due Date</th>
                            <th className="py-3 px-1">Amount</th>
                            <th className="py-3 px-1">Status</th>
                            <th className="py-3 px-1 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                          {selectedApp.repayment_schedule?.map((item: any, idx: number) => (
                            <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/30 transition-colors">
                              <td className="py-3.5 px-1 font-medium text-foreground">Installment {idx + 1}</td>
                              <td className="py-3.5 px-1 text-slate-500">{item.dueDate}</td>
                              <td className="py-3.5 px-1 font-bold text-foreground">Rs. {item.amount.toLocaleString()}</td>
                              <td className="py-3.5 px-1">
                                <Badge variant={item.status === 'paid' ? 'success' : 'warning'}>
                                  {item.status.toUpperCase()}
                                </Badge>
                              </td>
                              <td className="py-3.5 px-1 text-right space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleSimulateInvoiceDownload(selectedApp, item)}
                                  className="text-xs h-8 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-semibold"
                                >
                                  <FileText className="w-3.5 h-3.5 mr-1" />
                                  Invoice
                                </Button>
                                {item.status !== 'paid' && selectedApp.status === 'approved' && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleSimulatePayment(selectedApp.id, idx)}
                                    className="h-8 text-xs px-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:bg-indigo-950/80 border-0"
                                  >
                                    Pay Now
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </>
              )}
            </div>

            {/* Right Side Widgets: Upcoming Payments, Notifications */}
            <div className="space-y-6">
              
              {/* Upcoming Payments */}
              <Card className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="font-bold text-base text-foreground">Upcoming Payments</h3>
                <div className="space-y-3">
                  {upcomingPayments.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No pending payments due.</p>
                  ) : (
                    upcomingPayments.slice(0, 3).map((pay: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800/80">
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{pay.productName}</p>
                          <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>Due Date: {pay.dueDate}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-extrabold text-rose-600 dark:text-rose-400">Rs. {pay.amount.toLocaleString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              {/* Verified Documents Checklist */}
              <Card className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-base text-foreground">Uploaded Documents</h3>
                </div>
                
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Selfie Photograph</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">✓ Verified</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">CNIC Card Front</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">✓ Verified</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">CNIC Card Back</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">✓ Verified</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Salary Slip / Proof</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">✓ Verified</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Bank Statement</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">✓ Verified</span>
                  </div>
                </div>
              </Card>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
