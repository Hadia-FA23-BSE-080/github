import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Seed data helper
const getInitialData = () => {
  const defaultProducts = [
    {
      id: 'prod-1',
      name: 'iPhone 15 Pro Max',
      price: 1599,
      cash_price: 1499,
      installment_price: 1800,
      category: 'Mobile Phones',
      images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=60'],
      stock: 15,
      description: 'The ultimate iPhone with titanium design, A17 Pro chip, customizable Action button, and the most powerful iPhone camera system ever.',
      created_at: new Date().toISOString()
    },
    {
      id: 'prod-2',
      name: 'Samsung Galaxy S24 Ultra',
      price: 1499,
      cash_price: 1399,
      installment_price: 1680,
      category: 'Mobile Phones',
      images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=60'],
      stock: 20,
      description: 'Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity and possibility.',
      created_at: new Date().toISOString()
    },
    {
      id: 'prod-3',
      name: 'MacBook Pro 16" M3 Max',
      price: 3499,
      cash_price: 3299,
      installment_price: 3999,
      category: 'Laptops',
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=60'],
      stock: 8,
      description: 'MacBook Pro blasts forward with the M3, M3 Pro, and M3 Max chips. Built on 3‑nanometer technology and featuring an all-new GPU architecture.',
      created_at: new Date().toISOString()
    },
    {
      id: 'prod-4',
      name: 'Sony PlayStation 5 Slim',
      price: 499,
      cash_price: 469,
      installment_price: 600,
      category: 'Gaming',
      images: ['https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=60'],
      stock: 25,
      description: 'Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio.',
      created_at: new Date().toISOString()
    }
  ];

  const defaultAnnouncements = [
    {
      id: 'ann-1',
      title: 'Zero Interest Installment Offer!',
      content: 'Get 3 months installments plan on all cash prices with 0% markup. Valid till this weekend.',
      type: 'offer',
      image_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=60',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'ann-2',
      title: 'New Arrival - Samsung Galaxy S24 Series',
      content: 'Now available on easy installments. Apply today and get instant approval within 24 hours.',
      type: 'banner',
      image_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=60',
      is_active: true,
      created_at: new Date().toISOString()
    }
  ];

  const defaultProfiles = [
    {
      id: 'admin-id-1',
      role: 'admin',
      full_name: 'Super Admin',
      email: 'admin@installment.com',
      phone: '+923001234567',
      is_blacklisted: false,
      manual_verification_status: 'verified',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'customer-id-1',
      role: 'customer',
      full_name: 'Ali Khan',
      email: 'ali@example.com',
      phone: '+923123456789',
      cnic: '42101-1234567-1',
      is_blacklisted: false,
      manual_verification_status: 'verified',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const defaultApplications = [
    {
      id: 'app-1',
      customer_id: 'customer-id-1',
      product_id: 'prod-1',
      status: 'pending',
      installments_count: 6,
      markup_percent: 10,
      down_payment: 300,
      late_fee_percent: 5,
      total_payable: 1980,
      repayment_schedule: [
        { dueDate: '2026-07-24', amount: 330, status: 'pending' },
        { dueDate: '2026-08-24', amount: 330, status: 'pending' },
        { dueDate: '2026-09-24', amount: 330, status: 'pending' },
        { dueDate: '2026-10-24', amount: 330, status: 'pending' },
        { dueDate: '2026-11-24', amount: 330, status: 'pending' },
        { dueDate: '2026-12-24', amount: 330, status: 'pending' }
      ],
      employment_details: {
        company: 'Systems Limited',
        occupation: 'Software Engineer',
        salary: 150000,
        experience: '3 Years'
      },
      financial_details: {
        bank_name: 'Habib Bank Limited',
        account_no: 'PK12HABB000123456789',
        monthly_income: 150000,
        monthly_expenses: 60000
      },
      device_details: {
        ip: '192.168.10.25',
        browser: 'Chrome/Windows 11',
        fingerprint: 'fp-9823123asdjhk'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const defaultGuarantors = [
    {
      id: 'g-1',
      application_id: 'app-1',
      full_name: 'Muhammad Usman',
      cnic: '42101-7654321-1',
      phone: '+923331234567',
      address: 'DHA Phase 6, Karachi',
      occupation: 'Manager',
      monthly_income: 200000,
      bank_info: {
        bank_name: 'Meezan Bank',
        account_no: 'PK12MEZN000765432109'
      },
      created_at: new Date().toISOString()
    }
  ];

  const defaultInquiries = [
    {
      id: 'inq-1',
      name: 'Zeeshan Ahmed',
      email: 'zeeshan@example.com',
      phone: '+923219876543',
      message: 'I want to buy the PS5 on a 12-month plan. What is the down payment?',
      status: 'pending',
      created_at: new Date().toISOString()
    }
  ];

  return {
    products: defaultProducts,
    announcements: defaultAnnouncements,
    profiles: defaultProfiles,
    applications: defaultApplications,
    guarantors: defaultGuarantors,
    payments: [],
    messages: [],
    inquiries: defaultInquiries,
    auditLogs: [],
    blacklist: ['42101-0000000-0', '+923000000000'] // default blacklisted CNIC / Phones for demo validation
  };
};

// Initialize localStorage if empty
if (!localStorage.getItem('installment_db')) {
  localStorage.setItem('installment_db', JSON.stringify(getInitialData()));
}

// ----------------------------------------------------
// Mock DB helper classes representing Supabase features
// ----------------------------------------------------
export class MockDatabase {
  private getDb() {
    return JSON.parse(localStorage.getItem('installment_db') || '{}');
  }

  private saveDb(db: any) {
    localStorage.setItem('installment_db', JSON.stringify(db));
  }

  private mapTable(table: string): string {
    if (table === 'applications') return 'installment_applications';
    return table;
  }

  async getTable(table: string) {
    const isRealSupabase = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (isRealSupabase && supabase) {
      try {
        const realTable = this.mapTable(table);
        const { data, error } = await supabase.from(realTable).select('*');
        if (error) {
          console.warn(`Supabase error for ${realTable}, trying fallback:`, error);
          const db = this.getDb();
          return db[table] || [];
        }
        return data || [];
      } catch (e) {
        console.warn(`Supabase getTable connection failed for ${table}, trying fallback:`, e);
        const db = this.getDb();
        return db[table] || [];
      }
    } else {
      const db = this.getDb();
      return db[table] || [];
    }
  }

  async saveTable(table: string, data: any[]) {
    const isRealSupabase = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (isRealSupabase && supabase) {
      try {
        const realTable = this.mapTable(table);
        const { error } = await supabase.from(realTable).upsert(data);
        if (error) {
          console.warn(`Supabase error saving table ${realTable}, trying fallback:`, error);
          const db = this.getDb();
          db[table] = data;
          this.saveDb(db);
        }
      } catch (e) {
        console.warn(`Supabase saveTable connection failed for ${table}, trying fallback:`, e);
        const db = this.getDb();
        db[table] = data;
        this.saveDb(db);
      }
    } else {
      const db = this.getDb();
      db[table] = data;
      this.saveDb(db);
    }
  }

  async insert(table: string, record: any) {
    const isRealSupabase = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (isRealSupabase && supabase) {
      try {
        const realTable = this.mapTable(table);
        const { data, error } = await supabase.from(realTable).insert(record).select().single();
        if (error) {
          console.warn(`Supabase error inserting into ${realTable}, trying fallback:`, error);
          return await this.insertMock(table, record);
        }
        return data;
      } catch (e) {
        console.warn(`Supabase insert connection failed for ${table}, trying fallback:`, e);
        return await this.insertMock(table, record);
      }
    } else {
      return await this.insertMock(table, record);
    }
  }

  private async insertMock(table: string, record: any) {
    const tableData = await this.getTable(table);
    const newRecord = {
      id: record.id || Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      ...record
    };
    tableData.push(newRecord);
    await this.saveTable(table, tableData);
    return newRecord;
  }

  async update(table: string, id: string, updates: any) {
    const isRealSupabase = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (isRealSupabase && supabase) {
      try {
        const realTable = this.mapTable(table);
        const { data, error } = await supabase.from(realTable).update(updates).eq('id', id).select().single();
        if (error) {
          console.warn(`Supabase error updating ${realTable}, trying fallback:`, error);
          return await this.updateMock(table, id, updates);
        }
        return data;
      } catch (e) {
        console.warn(`Supabase update connection failed for ${table}, trying fallback:`, e);
        return await this.updateMock(table, id, updates);
      }
    } else {
      return await this.updateMock(table, id, updates);
    }
  }

  private async updateMock(table: string, id: string, updates: any) {
    const tableData = await this.getTable(table);
    const index = tableData.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      tableData[index] = {
        ...tableData[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      await this.saveTable(table, tableData);
      return tableData[index];
    }
    throw new Error(`Record with ID ${id} not found in ${table}`);
  }

  async delete(table: string, id: string) {
    const isRealSupabase = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (isRealSupabase && supabase) {
      try {
        const realTable = this.mapTable(table);
        const { error } = await supabase.from(realTable).delete().eq('id', id);
        if (error) {
          console.warn(`Supabase error deleting from ${realTable}, trying fallback:`, error);
          return await this.deleteMock(table, id);
        }
        return true;
      } catch (e) {
        console.warn(`Supabase delete connection failed for ${table}, trying fallback:`, e);
        return await this.deleteMock(table, id);
      }
    } else {
      return await this.deleteMock(table, id);
    }
  }

  private async deleteMock(table: string, id: string) {
    const tableData = await this.getTable(table);
    const filtered = tableData.filter((item: any) => item.id !== id);
    await this.saveTable(table, filtered);
    return true;
  }
}

export const mockDb = new MockDatabase();

// ----------------------------------------------------
// Real Supabase vs Mock Routing Client
// ----------------------------------------------------
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Auth Helper
export const authService = {
  getCurrentUser: async (): Promise<any> => {
    if (supabase) {
      try {
        const { data, error: userError } = await supabase.auth.getUser();
        if (userError || !data.user) {
          return await authService.getCurrentUserMock();
        }
        // Fetch profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        if (profileError) {
          return await authService.getCurrentUserMock();
        }
        return { user: data.user, profile };
      } catch (e) {
        console.warn("Supabase getCurrentUser failed, using mock auth session:", e);
        return await authService.getCurrentUserMock();
      }
    } else {
      return await authService.getCurrentUserMock();
    }
  },

  getCurrentUserMock: async (): Promise<any> => {
    const session = localStorage.getItem('installment_session');
    if (session) {
      const profile = JSON.parse(session);
      return {
        user: { id: profile.id, email: profile.email, user_metadata: { full_name: profile.full_name } },
        profile
      };
    }
    return null;
  },

  signUp: async (email: string, full_name: string, phone: string, role: string = 'customer'): Promise<any> => {
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: 'Password123!', // default placeholder password for simple demo signups
          options: {
            data: { full_name, phone }
          }
        });
        if (error) {
          console.warn("Supabase signUp failed, using mock signup:", error);
          return await authService.signUpMock(email, full_name, phone, role);
        }
        return data;
      } catch (e) {
        console.warn("Supabase signUp connection failed, using mock signup:", e);
        return await authService.signUpMock(email, full_name, phone, role);
      }
    } else {
      return await authService.signUpMock(email, full_name, phone, role);
    }
  },

  signUpMock: async (email: string, full_name: string, phone: string, role: string = 'customer'): Promise<any> => {
    // Verify blacklist
    const db = await mockDb.getTable('blacklist');
    if (db.includes(phone)) {
      throw new Error('This phone number is blacklisted.');
    }

    // Check duplicates
    const profiles = await mockDb.getTable('profiles');
    if (profiles.some((p: any) => p.email === email)) {
      throw new Error('Email already registered.');
    }
    if (profiles.some((p: any) => p.phone === phone)) {
      throw new Error('Phone number already registered.');
    }

    const newUserId = 'user-' + Math.random().toString(36).substr(2, 9);
    const newProfile = {
      id: newUserId,
      role,
      full_name,
      phone,
      email,
      is_blacklisted: false,
      manual_verification_status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    await mockDb.insert('profiles', newProfile);
    localStorage.setItem('installment_session', JSON.stringify(newProfile));
    return { user: { id: newUserId, email }, profile: newProfile };
  },

  signIn: async (email: string): Promise<any> => {
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: 'Password123!'
        });
        if (error) {
          console.warn("Supabase signIn failed, trying mock signin:", error);
          return await authService.signInMock(email);
        }
        return data;
      } catch (e) {
        console.warn("Supabase signIn connection failed, trying mock signin:", e);
        return await authService.signInMock(email);
      }
    } else {
      return await authService.signInMock(email);
    }
  },

  signInMock: async (email: string): Promise<any> => {
    const profiles = await mockDb.getTable('profiles');
    const profile = profiles.find((p: any) => p.email === email);
    if (!profile) {
      throw new Error('User not found. Please register.');
    }
    if (profile.is_blacklisted) {
      throw new Error('Your account is blacklisted. Please contact administrator.');
    }
    localStorage.setItem('installment_session', JSON.stringify(profile));
    return { user: { id: profile.id, email }, profile };
  },

  signOut: async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn("Supabase signOut connection failed:", e);
      }
    }
    localStorage.removeItem('installment_session');
    window.location.reload();
  }
};

// Re-export type definitions for cleaner imports
export type { Product, Announcement, InstallmentApplication, Profile } from '../types';

