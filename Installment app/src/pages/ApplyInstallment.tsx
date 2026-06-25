import React, { useState, useEffect } from 'react';
import { mockDb } from '../lib/supabaseClient';
import type { Product } from '../types';
import { Button, Badge, Card, PageHeader, Alert } from '../components/ui';
import { ChevronLeft, ChevronRight, Check, AlertCircle, Upload, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

interface ApplyInstallmentProps {
  selectedProduct: Product | null;
  user: any;
  onSuccess: () => void;
}

export const ApplyInstallment: React.FC<ApplyInstallmentProps> = ({ selectedProduct, user, onSuccess }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeStep, setActiveStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal
    productId: selectedProduct?.id || '',
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    cnic: '',
    // Step 2: Employment
    company: '',
    occupation: '',
    salary: '',
    experience: '',
    // Step 3: Financial
    bankName: '',
    accountNo: '',
    expenses: '',
    // Step 4: Guarantor
    gFullName: '',
    gCnic: '',
    gPhone: '',
    gAddress: '',
    gOccupation: '',
    gIncome: '',
    gBankName: '',
    gBankAccount: '',
    // Step 5: Docs
    cnicFront: null as string | null,
    cnicBack: null as string | null,
    selfie: null as string | null,
    utilityBill: null as string | null,
    salarySlip: null as string | null,
    bankStatement: null as string | null,
  });

  useEffect(() => {
    const fetchProds = async () => {
      try {
        const p = await mockDb.getTable('products');
        setProducts(p);
        if (!formData.productId && p.length > 0) {
          setFormData(prev => ({ ...prev, productId: p[0].id }));
        }
      } catch (e) {
        toast.error("Failed to load catalog products.");
      }
    };
    fetchProds();
  }, []);

  const currentProduct = products.find(p => p.id === formData.productId);

  // Simulated file uploads to base64 or placeholders
  const handleFileUpload = (field: string, filename: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: `https://easyinstall-documents.supabase.co/storage/v1/object/public/documents/${field}_${filename}_simulated.jpg`
    }));
    toast.success(`${field.replace(/([A-Z])/g, ' $1')} simulated upload complete.`);
  };

  const validateStep = async (step: number) => {
    setError(null);
    if (step === 1) {
      if (!formData.productId || !formData.fullName || !formData.phone || !formData.cnic) {
        setError('Please fill in all personal fields.');
        return false;
      }
      // Fraud prevention checks
      const blacklist = await mockDb.getTable('blacklist');
      if (blacklist.includes(formData.cnic) || blacklist.includes(formData.phone)) {
        setError('Verification failed. This CNIC or Phone number is blacklisted.');
        return false;
      }
      // Check CNIC duplicates in applications
      const profiles = await mockDb.getTable('profiles');
      
      const duplicateCnic = profiles.some((p: any) => p.cnic === formData.cnic && p.id !== user?.id);
      if (duplicateCnic) {
        setError('Duplicate Account Detected. A customer account already exists with this CNIC.');
        return false;
      }
    }
    if (step === 2) {
      if (!formData.company || !formData.occupation || !formData.salary) {
        setError('Please fill in employment details.');
        return false;
      }
    }
    if (step === 3) {
      if (!formData.bankName || !formData.accountNo || !formData.expenses) {
        setError('Please fill in financial/bank details.');
        return false;
      }
    }
    if (step === 4) {
      if (!formData.gFullName || !formData.gCnic || !formData.gPhone || !formData.gAddress) {
        setError('Please provide complete mandatory guarantor details.');
        return false;
      }
      if (formData.gCnic === formData.cnic) {
        setError('Guarantor CNIC cannot be identical to customer CNIC.');
        return false;
      }
    }
    if (step === 5) {
      if (!formData.cnicFront || !formData.cnicBack || !formData.selfie || !formData.bankStatement) {
        setError('Please upload CNIC (Front & Back), Selfie, and Bank statement.');
        return false;
      }
    }
    return true;
  };

  const handleNext = async () => {
    const isValid = await validateStep(activeStep);
    if (isValid) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!user) {
      setError('Please log in to submit your application.');
      return;
    }
    setIsSubmitting(true);
    try {
      // Simulate fingerprinting
      const fingerprint = 'fp-' + Math.random().toString(36).substr(2, 9);
      const ip = '182.180.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255);

      // 1. Update customer profile info
      const profiles = await mockDb.getTable('profiles');
      const idx = profiles.findIndex((p: any) => p.id === user.id);
      if (idx !== -1) {
        profiles[idx] = {
          ...profiles[idx],
          cnic: formData.cnic,
          cnic_front_url: formData.cnicFront,
          cnic_back_url: formData.cnicBack,
          selfie_url: formData.selfie,
          utility_bill_url: formData.utilityBill,
          salary_slip_url: formData.salarySlip,
          bank_statement_url: formData.bankStatement,
          updated_at: new Date().toISOString()
        };
        await mockDb.saveTable('profiles', profiles);
      }

      // 2. Create Application
      const markup = 12; // default 12% markup
      const productPrice = currentProduct?.price || 0;
      const downPayment = Math.round(productPrice * 0.2); // 20% down payment
      const principal = productPrice - downPayment;
      const markupAmount = principal * (markup / 100);
      const totalPayable = principal + markupAmount;
      const monthlyAmount = Math.round(totalPayable / 6); // 6 months installments default

      const schedule = Array.from({ length: 6 }).map((_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() + i + 1);
        return {
          dueDate: d.toISOString().split('T')[0],
          amount: monthlyAmount,
          status: 'pending'
        };
      });

      const newApp = await mockDb.insert('applications', {
        customer_id: user.id,
        product_id: formData.productId,
        status: 'pending',
        installments_count: 6,
        markup_percent: markup,
        down_payment: downPayment,
        late_fee_percent: 5,
        total_payable: totalPayable,
        repayment_schedule: schedule,
        employment_details: {
          company: formData.company,
          occupation: formData.occupation,
          salary: Number(formData.salary),
          experience: formData.experience
        },
        financial_details: {
          bank_name: formData.bankName,
          account_no: formData.accountNo,
          monthly_income: Number(formData.salary),
          monthly_expenses: Number(formData.expenses)
        },
        device_details: {
          ip,
          browser: navigator.userAgent,
          fingerprint
        }
      });

      // 3. Create Guarantor Info
      await mockDb.insert('guarantors', {
        application_id: newApp.id,
        full_name: formData.gFullName,
        cnic: formData.gCnic,
        phone: formData.gPhone,
        address: formData.gAddress,
        occupation: formData.gOccupation,
        monthly_income: Number(formData.gIncome),
        bank_info: {
          bank_name: formData.gBankName,
          account_no: formData.gBankAccount
        }
      });

      // 4. Log Audit activity
      await mockDb.insert('auditLogs', {
        admin_id: null,
        action: 'submit_application',
        details: { applicationId: newApp.id, ip, fingerprint }
      });

      toast.success('Application Submitted Successfully!', {
        description: 'EasyInstall underwriters will verify details shortly.'
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-800 overflow-hidden transition-colors duration-300">
        
        {/* Header & Steps Tracker */}
        <div className="bg-indigo-600 text-white p-6 md:p-8">
          <h2 className="text-2xl font-bold">Apply For Installments Plan</h2>
          <p className="text-indigo-200 text-sm mt-1">Verify your info to check financing limit</p>
          
          {/* Steps Horizontal */}
          <div className="flex items-center justify-between mt-8 text-xs md:text-sm overflow-x-auto whitespace-nowrap gap-2 pb-2">
            {[
              { s: 1, label: 'Personal' },
              { s: 2, label: 'Employment' },
              { s: 3, label: 'Financial' },
              { s: 4, label: 'Guarantor' },
              { s: 5, label: 'Documents' },
              { s: 6, label: 'Review' }
            ].map((step) => (
              <div key={step.s} className="flex items-center space-x-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  activeStep >= step.s ? 'bg-white text-indigo-600' : 'bg-indigo-500 text-indigo-200'
                }`}>
                  {activeStep > step.s ? <Check className="w-3.5 h-3.5" /> : step.s}
                </span>
                <span className={activeStep === step.s ? 'font-bold' : 'text-indigo-200'}>{step.label}</span>
                {step.s < 6 && <span className="text-indigo-400">→</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-6">
            <Alert variant="error" icon={<AlertCircle className="w-5 h-5 shrink-0" />}>
              {error}
            </Alert>
          </div>
        )}

        {/* Step Forms */}
        <div className="p-6 md:p-8 space-y-6">

          {/* STEP 1: Personal */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold border-b border-slate-100 dark:border-slate-800 pb-2 text-foreground">Personal Information</h3>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">Select Product *</label>
                <select
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-card text-sm text-foreground focus:ring-2 focus:ring-ring outline-none font-semibold"
                >
                  <option value="" disabled>Choose a product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} (Cash Price: Rs. {p.price.toLocaleString()})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-card text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +923123456789"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-card text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">CNIC Number (National ID) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 42101-1234567-1"
                  value={formData.cnic}
                  onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                  className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-card text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Employment */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold border-b border-slate-100 dark:border-slate-800 pb-2 text-foreground">Employment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">Company / Organization *</label>
                  <input
                    type="text"
                    placeholder="e.g. Systems Limited"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-card text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">Occupation / Designation *</label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-card text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">Monthly Net Income (Rs.) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 100000"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-card text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">Work Experience *</label>
                  <input
                    type="text"
                    placeholder="e.g. 2 Years"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-card text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Financial */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold border-b border-slate-100 dark:border-slate-800 pb-2 text-foreground">Financial Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">Bank Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. HBL"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-card text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">Bank Account/IBAN Number *</label>
                  <input
                    type="text"
                    placeholder="e.g. PK12HABB0000123456"
                    value={formData.accountNo}
                    onChange={(e) => setFormData({ ...formData, accountNo: e.target.value })}
                    className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-card text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">Estimated Monthly Household Expenses (Rs.) *</label>
                <input
                  type="number"
                  placeholder="e.g. 40000"
                  value={formData.expenses}
                  onChange={(e) => setFormData({ ...formData, expenses: e.target.value })}
                  className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-card text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Guarantor */}
          {activeStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold border-b border-slate-100 dark:border-slate-800 pb-2 text-foreground">Guarantor Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">Guarantor Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Muhammad Khan"
                    value={formData.gFullName}
                    onChange={(e) => setFormData({ ...formData, gFullName: e.target.value })}
                    className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-card text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">Guarantor Phone Number *</label>
                  <input
                    type="text"
                    placeholder="e.g. 03331234567"
                    value={formData.gPhone}
                    onChange={(e) => setFormData({ ...formData, gPhone: e.target.value })}
                    className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-card text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">Guarantor CNIC *</label>
                  <input
                    type="text"
                    placeholder="e.g. 42101-7654321-1"
                    value={formData.gCnic}
                    onChange={(e) => setFormData({ ...formData, gCnic: e.target.value })}
                    className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-card text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">Guarantor Occupation</label>
                  <input
                    type="text"
                    placeholder="e.g. Shop Manager"
                    value={formData.gOccupation}
                    onChange={(e) => setFormData({ ...formData, gOccupation: e.target.value })}
                    className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-card text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">Guarantor Income (Optional)</label>
                  <input
                    type="number"
                    placeholder="e.g. 150000"
                    value={formData.gIncome}
                    onChange={(e) => setFormData({ ...formData, gIncome: e.target.value })}
                    className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-card text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">Guarantor Address *</label>
                  <input
                    type="text"
                    placeholder="e.g. DHA Phase 6, Karachi"
                    value={formData.gAddress}
                    onChange={(e) => setFormData({ ...formData, gAddress: e.target.value })}
                    className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-card text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Documents */}
          {activeStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold border-b border-slate-100 dark:border-slate-800 pb-2 text-foreground">Documents Upload</h3>
              <p className="text-xs text-muted-foreground mb-4">Upload clean and high-resolution JPEG/PNG files. Max limit 5MB.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { field: 'cnicFront', label: 'CNIC Front Image *' },
                  { field: 'cnicBack', label: 'CNIC Back Image *' },
                  { field: 'selfie', label: 'Selfie Photograph *' },
                  { field: 'utilityBill', label: 'Recent Utility Bill' },
                  { field: 'salarySlip', label: 'Salary Slip / Business Proof' },
                  { field: 'bankStatement', label: '3 Months Bank Statement *' }
                ].map((doc) => (
                  <Card key={doc.field} className="border-dashed border-slate-350 dark:border-slate-800 p-6 text-center flex flex-col justify-between items-center bg-slate-50/50 dark:bg-slate-950/20 gap-3">
                    <span className="text-2xl">📁</span>
                    <h4 className="text-xs font-bold text-foreground">{doc.label}</h4>
                    {formData[doc.field as keyof typeof formData] ? (
                      <div className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs flex items-center justify-center space-x-1">
                        <span>✓ Uploaded</span>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleFileUpload(doc.field, 'file')}
                        className="text-xs font-semibold"
                        icon={<Upload className="w-3.5 h-3.5" />}
                      >
                        Upload Doc
                      </Button>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: Review */}
          {activeStep === 6 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b border-slate-100 dark:border-slate-800 pb-2 text-foreground">Review Application Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-950/40 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-805">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-2">Personal Details</h4>
                  <ul className="space-y-1 text-sm text-foreground">
                    <li><span className="text-muted-foreground">Name:</span> {formData.fullName}</li>
                    <li><span className="text-muted-foreground">Phone:</span> {formData.phone}</li>
                    <li><span className="text-muted-foreground">CNIC:</span> {formData.cnic}</li>
                    <li><span className="text-muted-foreground">Email:</span> {formData.email}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-2">Selected Product</h4>
                  <p className="text-sm font-semibold text-foreground">{currentProduct?.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">Cash Price: Rs. {currentProduct?.price.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-950/40 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-805">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-2">Employment & Financials</h4>
                  <ul className="space-y-1 text-sm text-foreground">
                    <li><span className="text-muted-foreground">Employer:</span> {formData.company} ({formData.occupation})</li>
                    <li><span className="text-muted-foreground">Monthly Net Salary:</span> Rs. {Number(formData.salary).toLocaleString()}</li>
                    <li><span className="text-muted-foreground">Monthly Expenses:</span> Rs. {Number(formData.expenses).toLocaleString()}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-2">Guarantor Details</h4>
                  <ul className="space-y-1 text-sm text-foreground">
                    <li><span className="text-muted-foreground">Name:</span> {formData.gFullName}</li>
                    <li><span className="text-muted-foreground">Phone:</span> {formData.gPhone}</li>
                    <li><span className="text-muted-foreground">CNIC:</span> {formData.gCnic}</li>
                    <li><span className="text-muted-foreground">Address:</span> {formData.gAddress}</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 text-center rounded-2xl border border-indigo-100/40 dark:border-indigo-900/40">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Installment Estimation</p>
                <p className="text-xl font-bold text-indigo-650 dark:text-indigo-400 mt-1">6 Monthly Installments Plan</p>
                <p className="text-xs text-muted-foreground mt-1">Estimated Down Payment due immediately upon approval: 20%</p>
              </div>

              <div className="flex gap-2.5 p-4 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-xl text-xs">
                <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Legal Consent Statement:</p>
                  <p className="leading-relaxed">By submitting this form, you authorize EasyInstall credit score team to query and inspect your credit report, source of salary, and verify phone numbers with PMD registry databases for security and fraud prevention checks.</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 dark:bg-slate-950 px-6 py-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 transition">
          {activeStep > 1 ? (
            <Button
              onClick={handleBack}
              variant="secondary"
              icon={<ChevronLeft className="w-4 h-4" />}
            >
              Back
            </Button>
          ) : (
            <div></div>
          )}

          {activeStep < 6 ? (
            <Button
              onClick={handleNext}
              icon={<ChevronRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 border-none text-white px-8"
              icon={<Check className="w-4 h-4" />}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          )}
        </div>

      </div>
    </div>
  );
};
