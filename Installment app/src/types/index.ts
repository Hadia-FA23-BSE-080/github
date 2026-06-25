export type UserRole = 'admin' | 'customer' | 'guarantor';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'additional_documents';
export type PaymentStatus = 'pending' | 'paid' | 'partially_paid' | 'late' | 'overdue';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  phone?: string;
  email?: string;
  cnic?: string;
  cnic_front_url?: string;
  cnic_back_url?: string;
  selfie_url?: string;
  utility_bill_url?: string;
  salary_slip_url?: string;
  bank_statement_url?: string;
  is_blacklisted: boolean;
  manual_verification_status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  cash_price?: number;
  installment_price?: number;
  category?: string;
  images?: string[];
  stock: number;
  description?: string;
  created_at: string;
}

export interface RepaymentScheduleItem {
  dueDate: string;
  amount: number;
  status: 'pending' | 'paid' | 'late';
  paidAmount?: number;
  paidDate?: string;
}

export interface InstallmentApplication {
  id: string;
  customer_id: string;
  product_id: string;
  status: ApplicationStatus;
  installments_count: number;
  markup_percent: number;
  down_payment: number;
  late_fee_percent: number;
  total_payable: number;
  repayment_schedule: RepaymentScheduleItem[];
  employment_details?: {
    company: string;
    occupation: string;
    salary: number;
    experience: string;
  };
  financial_details?: {
    bank_name: string;
    account_no: string;
    monthly_income: number;
    monthly_expenses: number;
  };
  device_details?: {
    ip: string;
    browser: string;
    fingerprint: string;
  };
  created_at: string;
  updated_at: string;
  // Join objects
  profiles?: Profile;
  products?: Product;
  guarantors?: Guarantor[];
}

export interface Guarantor {
  id: string;
  application_id: string;
  full_name: string;
  cnic: string;
  phone: string;
  address: string;
  occupation?: string;
  monthly_income?: number;
  bank_info?: {
    bank_name?: string;
    account_no?: string;
  };
  cnic_front_url?: string;
  cnic_back_url?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  application_id: string;
  installment_index: number;
  amount_paid: number;
  due_amount: number;
  paid_at: string;
  payment_method?: string;
  receipt_url?: string;
  status: PaymentStatus;
  late_fee_paid: number;
  created_at: string;
  installment_applications?: InstallmentApplication;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender?: Profile;
  receiver?: Profile;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  reply_content?: string;
  replied_by?: string;
  status: 'pending' | 'replied';
  created_at: string;
  replied_at?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'news' | 'banner' | 'offer';
  image_url?: string;
  action_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  admin_id?: string;
  action: string;
  details?: Record<string, any>;
  ip_address?: string;
  created_at: string;
  profiles?: Profile;
}
