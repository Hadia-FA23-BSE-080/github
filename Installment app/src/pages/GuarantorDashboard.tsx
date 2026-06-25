import React, { useState, useEffect } from 'react';
import { mockDb } from '../lib/supabaseClient';
import { Card, StatCard, PageHeader, Badge, EmptyState, Alert } from '../components/ui';
import { Users, FileCheck2, AlertCircle } from 'lucide-react';

interface GuarantorDashboardProps {
  user: any;
}

export const GuarantorDashboard: React.FC<GuarantorDashboardProps> = ({ user }) => {
  const [guaranteedClients, setGuaranteedClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const apps = await mockDb.getTable('applications');
        const guarantors = await mockDb.getTable('guarantors');
        const profiles = await mockDb.getTable('profiles');
        const products = await mockDb.getTable('products');

        // Find applications where guarantor's phone or CNIC matches the current user's phone/CNIC
        const clientApps = apps.map((app: any) => {
          const guarantor = guarantors.find((g: any) => g.application_id === app.id);
          const client = profiles.find((p: any) => p.id === app.customer_id);
          const product = products.find((p: any) => p.id === app.product_id);
          
          return {
            ...app,
            guarantor,
            client,
            product
          };
        }).filter((app: any) => 
          app.guarantor && (app.guarantor.phone === user.phone || app.guarantor.cnic === user.cnic || user.role === 'guarantor')
        );

        setGuaranteedClients(clientApps);
      } catch (e) {
        console.error("Failed to load guarantor clients.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Calculations
  const activeGuarantees = guaranteedClients.filter(c => c.status === 'approved').length;
  const pendingGuarantees = guaranteedClients.filter(c => c.status === 'pending').length;
  
  // Risk assessment: check if any guaranteed client has a late installment
  const highRiskClients = guaranteedClients.filter(c => 
    c.status === 'approved' && 
    c.repayment_schedule?.some((s: any) => s.status === 'late')
  );

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-6 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <PageHeader 
          title="Guarantor Portal" 
          subtitle="Review guaranteed client requests and track payment risk metrics." 
        />

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            label="Active Guaranteed Clients" 
            value={activeGuarantees} 
            icon={<Users className="w-5 h-5" />} 
            color="indigo"
          />
          <StatCard 
            label="Pending Approvals" 
            value={pendingGuarantees} 
            icon={<FileCheck2 className="w-5 h-5" />} 
            color="amber"
          />
          <StatCard 
            label="High Risk / Late Alarms" 
            value={highRiskClients.length} 
            icon={<AlertCircle className="w-5 h-5" />} 
            color="rose"
          />
        </div>

        {/* Alarm Banner */}
        {highRiskClients.length > 0 && (
          <Alert variant="error" icon={<AlertCircle className="w-5 h-5 text-destructive shrink-0" />}>
            <p className="font-bold">Immediate Risk Warning Alert</p>
            <p className="text-xs mt-1">One or more of your guaranteed clients has missed an installment date. Please contact them immediately to resolve outstanding dues and secure your credit standing.</p>
          </Alert>
        )}

        {/* Client List */}
        <Card className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-lg text-foreground">Guaranteed Client Portfolios</h3>
          
          {loading ? (
            <div className="space-y-4">
              <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
              <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
              <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
            </div>
          ) : guaranteedClients.length === 0 ? (
            <EmptyState 
              title="No Guaranteed Clients" 
              description="You are currently not listed as a guarantor for any active installment applications." 
              icon={<Users className="w-8 h-8 text-muted-foreground" />}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/80 text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                    <th className="py-3 px-1">Client Name</th>
                    <th className="py-3 px-1">Product Name</th>
                    <th className="py-3 px-1">Status</th>
                    <th className="py-3 px-1">Total Payable</th>
                    <th className="py-3 px-1">Risk Assessment</th>
                    <th className="py-3 px-1 text-right">Schedule Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {guaranteedClients.map((app) => {
                    const isLate = app.repayment_schedule?.some((s: any) => s.status === 'late');
                    const paidCount = app.repayment_schedule?.filter((s: any) => s.status === 'paid').length || 0;
                    const totalCount = app.repayment_schedule?.length || 0;
                    const progressPercent = totalCount > 0 ? (paidCount / totalCount) * 100 : 0;

                    return (
                      <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                        <td className="py-4 px-1">
                          <p className="font-bold text-foreground">{app.client?.full_name || 'Walk-in Customer'}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Ph: {app.client?.phone}</p>
                        </td>
                        <td className="py-4 px-1">
                          <p className="font-semibold text-foreground">{app.product?.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Rs. {app.product?.price.toLocaleString()}</p>
                        </td>
                        <td className="py-4 px-1">
                          <Badge variant={app.status === 'approved' ? 'success' : 'warning'}>
                            {app.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-4 px-1 font-bold text-foreground">
                          Rs. {app.total_payable.toLocaleString()}
                        </td>
                        <td className="py-4 px-1">
                          <Badge variant={isLate ? 'error' : 'success'} dot>
                            {isLate ? 'CRITICAL RISK' : 'LOW RISK'}
                          </Badge>
                        </td>
                        <td className="py-4 px-1 text-right">
                          <p className="text-xs font-semibold text-foreground">{paidCount}/{totalCount} Installments Paid</p>
                          <div className="w-24 bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden mt-1.5 ml-auto">
                            <div 
                              className="bg-indigo-600 dark:bg-indigo-500 h-full transition-all duration-300" 
                              style={{ width: `${progressPercent}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

      </div>
    </div>
  );
};
