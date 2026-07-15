export type CarStatus = 'pending' | 'approved' | 'rejected' | 'draft';
export type InquiryStatus = 'pending' | 'read' | 'replied' | 'archived';
export type InspectionStatus = 'pending' | 'scheduled' | 'completed' | 'cancelled';
export type InspectionPlan = 'basic' | 'standard' | 'premium';
export type UserRole = 'buyer' | 'seller' | 'admin' | 'content_manager' | 'inspection_manager';
export type UserStatus = 'active' | 'suspended' | 'pending';
export type BlogStatus = 'draft' | 'published' | 'scheduled';

export type DbUser = {
  id: string;
  auth_user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  avatar_url: string | null;
  bio: string | null;
  listings_count: number;
  created_at: string;
  updated_at: string;
  last_login: string | null;
};

export type DbCar = {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  price_display: string | null;
  mileage: number | null;
  transmission: string | null;
  fuel_type: string | null;
  body_type: string | null;
  exterior_color: string | null;
  interior_color: string | null;
  engine: string | null;
  horsepower: number | null;
  condition: string | null;
  city: string | null;
  location: string | null;
  description: string | null;
  images: string[];
  features: string[];
  badge: string | null;
  rating: number | null;
  status: CarStatus;
  is_featured: boolean;
  views_count: number;
  slug: string | null;
  meta_title: string | null;
  meta_description: string | null;
  seller_id: string | null;
  seller_name: string | null;
  seller_email: string | null;
  seller_phone: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

export type DbInquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  car_id: string | null;
  status: InquiryStatus;
  is_read: boolean;
  created_at: string;
  updated_at: string;
};

export type DbInspection = {
  id: string;
  make: string;
  model: string;
  year: number;
  registration_number: string;
  address: string;
  plan: InspectionPlan;
  plan_price: number;
  scheduled_date: string;
  time_slot: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  status: InspectionStatus;
  car_id: string | null;
  user_id: string | null;
  inspector_id: string | null;
  report_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type DbCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
};

export type DbBlog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  author_id: string | null;
  category_id: string | null;
  tags: any;
  status: BlogStatus;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  views_count: number;
  allow_comments: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

export type DbSEOSetting = {
  id: string;
  page_path: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  canonical_url: string | null;
  schema_markup: any;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      users: {
        Row: DbUser;
        Insert: Partial<DbUser> & Pick<DbUser, 'name' | 'email'>;
        Update: Partial<DbUser>;
        Relationships: [];
      };
      cars: {
        Row: DbCar;
        Insert: Partial<DbCar> & Pick<DbCar, 'title' | 'brand' | 'model' | 'year'>;
        Update: Partial<DbCar>;
        Relationships: [];
      };
      inquiries: {
        Row: DbInquiry;
        Insert: Partial<DbInquiry> & Pick<DbInquiry, 'name' | 'email' | 'subject' | 'message'>;
        Update: Partial<DbInquiry>;
        Relationships: [];
      };
      inspections: {
        Row: DbInspection;
        Insert: Partial<DbInspection> & Pick<DbInspection, 'make' | 'model' | 'year' | 'registration_number' | 'address' | 'scheduled_date' | 'time_slot' | 'customer_name' | 'customer_phone'>;
        Update: Partial<DbInspection>;
        Relationships: [];
      };
      categories: {
        Row: DbCategory;
        Insert: Partial<DbCategory> & Pick<DbCategory, 'name' | 'slug'>;
        Update: Partial<DbCategory>;
        Relationships: [];
      };
      blogs: {
        Row: DbBlog;
        Insert: Partial<DbBlog> & Pick<DbBlog, 'title' | 'slug'>;
        Update: Partial<DbBlog>;
        Relationships: [];
      };
      seo_settings: {
        Row: DbSEOSetting;
        Insert: Partial<DbSEOSetting> & Pick<DbSEOSetting, 'page_path'>;
        Update: Partial<DbSEOSetting>;
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
  };
};
