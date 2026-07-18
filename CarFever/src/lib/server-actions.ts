'use server';

import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Json } from '@/lib/supabase/types';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface FetchCarsFilters {
  make?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  year?: number | null;
  fuelType?: string | null;
  search?: string | null;
  sortBy?: 'price-asc' | 'price-desc' | 'year-desc' | 'newest';
  page?: number;
  limit?: number;
}

export interface FetchCarsResult {
  cars: ApprovedCar[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ApprovedCar {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  currency: string | null;
  mileage: number | null;
  fuel_type: string | null;
  transmission: string | null;
  color: string | null;
  city: string | null;
  images: string[] | Json;
  description: string | null;
  features: string[] | Json;
  slug: string | null;
  condition: string | null;
  is_featured: boolean;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// FETCH APPROVED CARS
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchApprovedCars(
  filters: FetchCarsFilters = {}
): Promise<FetchCarsResult> {
  const {
    make,
    minPrice,
    maxPrice,
    year,
    fuelType,
    search,
    sortBy = 'newest',
    page = 1,
    limit = 6,
  } = filters;

  try {
    const supabase = createServerClient();

    let query = supabase
      .from('cars')
      .select('id, title, make, model, year, price, currency, mileage, fuel_type, transmission, color, exterior_color, city, description, features, images, slug, condition, is_featured, created_at', { count: 'exact' })
      .eq('status', 'approved');

    // ── Filters ──────────────────────────────────────────────────────────────
    if (make) query = query.ilike('make', `%${make}%`);
    if (minPrice != null) query = query.gte('price', minPrice);
    if (maxPrice != null) query = query.lte('price', maxPrice);
    if (year) query = query.eq('year', year);
    if (fuelType) query = query.ilike('fuel_type', `%${fuelType}%`);
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,make.ilike.%${search}%,model.ilike.%${search}%`
      );
    }

    // ── Sorting ───────────────────────────────────────────────────────────────
    switch (sortBy) {
      case 'price-asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price-desc':
        query = query.order('price', { ascending: false });
        break;
      case 'year-desc':
        query = query.order('year', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    // ── Pagination ────────────────────────────────────────────────────────────
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('fetchApprovedCars error:', error.message);
      return { cars: [], total: 0, page, totalPages: 0 };
    }

    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    return {
      cars: (data ?? []) as ApprovedCar[],
      total,
      page,
      totalPages,
    };
  } catch (err) {
    console.error('fetchApprovedCars exception:', err);
    return { cars: [], total: 0, page, totalPages: 0 };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBMIT CAR LISTING
// ─────────────────────────────────────────────────────────────────────────────

export async function submitCarListing(formData: {
  make: string;
  model: string;
  year: string;
  mileage: string;
  fuelType: string;
  transmission: string;
  engineCapacity: string;
  city: string;
  price: string;
  sellerName: string;
  sellerPhone: string;
  description: string;
  images: File[];
}) {
  try {
    const supabase = createServiceRoleClient();

    const imageUrls: string[] = [];
    for (const file of formData.images) {
      const ext = file.name.split('.').pop();
      const path = `listings/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('car-images')
        .upload(path, file, { upsert: false });

      if (uploadError) {
        console.error('Image upload error:', uploadError.message);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from('car-images')
        .getPublicUrl(path);

      imageUrls.push(urlData.publicUrl);
    }

    const priceLacs = parseFloat(formData.price);
    const pricePKR = Math.round(priceLacs * 100000);
    const title = `${formData.year} ${formData.make} ${formData.model}`;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-6);

    const { data, error } = await supabase
      .from('cars')
      .insert({
        title,
        slug,
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        price: pricePKR,
        currency: 'PKR',
        mileage: formData.mileage ? parseInt(formData.mileage) : null,
        transmission: formData.transmission.charAt(0).toUpperCase() + formData.transmission.slice(1),
        fuel_type: formData.fuelType.charAt(0).toUpperCase() + formData.fuelType.slice(1),
        city: formData.city,
        description: formData.description || `${title} for sale.`,
        images: imageUrls.length > 0 ? imageUrls : ['https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=600&q=80'],
        features: [],
        status: 'pending' as const,
        seller_name: formData.sellerName || null,
        seller_phone: formData.sellerPhone || null,
      })
      .select('id')
      .single();

    if (error) throw new Error(error.message);

    revalidatePath('/admin/cars');
    revalidatePath('/buy-car');

    return { success: true, carId: (data as any)?.id as string };
  } catch (err) {
    console.error('submitCarListing error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to submit car listing',
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBMIT INQUIRY
// ─────────────────────────────────────────────────────────────────────────────

export async function submitInquiry(formData: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  carId?: string;
}) {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('inquiries')
      .insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject,
        message: formData.message,
        car_id: formData.carId || null,
      } as any)
      .select('id')
      .single();

    if (error) throw new Error(error.message);

    revalidatePath('/admin/inquiries');

    return { success: true, inquiryId: (data as any)?.id as string };
  } catch (err) {
    console.error('submitInquiry error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to submit inquiry',
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBMIT INSPECTION BOOKING
// ─────────────────────────────────────────────────────────────────────────────

export async function submitInspectionBooking(formData: {
  make: string;
  model: string;
  year: string;
  registrationNumber: string;
  address: string;
  plan: 'basic' | 'standard' | 'premium';
  date: string;
  timeSlot: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
}) {
  const planPrices = { basic: 3500, standard: 5500, premium: 8500 };

  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('inspections')
      .insert({
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        registration_number: formData.registrationNumber,
        address: formData.address,
        plan: formData.plan,
        plan_price: planPrices[formData.plan],
        scheduled_date: formData.date,
        time_slot: formData.timeSlot,
        customer_name: formData.customerName,
        customer_phone: formData.customerPhone,
      } as any)
      .select('id')
      .single();

    if (error) throw new Error(error.message);

    revalidatePath('/admin/inspections');

    return { success: true, inspectionId: (data as any)?.id as string };
  } catch (err) {
    console.error('submitInspectionBooking error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to submit inspection booking',
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// FETCH SINGLE CAR BY ID & INCREMENT VIEWS
// ─────────────────────────────────────────────────────────────────────────────

export async function getCarById(id: string): Promise<ApprovedCar | null> {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('getCarById error:', error);
      return null;
    }

    return data as ApprovedCar;
  } catch (err) {
    console.error('getCarById exception:', err);
    return null;
  }
}

export async function incrementCarViews(id: string): Promise<void> {
  try {
    const supabase = createServiceRoleClient();
    await supabase.rpc('increment_car_views', { car_id: id });
  } catch (err) {
    console.error('incrementCarViews error:', err);
    try {
      const supabase = createServiceRoleClient();
      const { data: car } = await supabase.from('cars').select('views_count').eq('id', id).single();
      if (car) {
        await supabase
          .from('cars')
          .update({ views_count: (car.views_count || 0) + 1 })
          .eq('id', id);
      }
    } catch (fallbackErr) {
      console.error('incrementCarViews fallback error:', fallbackErr);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SYNC NEW USER (BYPASS RLS)
// ─────────────────────────────────────────────────────────────────────────────

export async function syncUserToDatabase(user: {
  name: string;
  email: string;
  role: 'buyer' | 'seller';
}) {
  try {
    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from('users')
      .insert({
        name: user.name,
        email: user.email,
        role: user.role,
        status: 'active',
      });

    if (error) throw error;
    revalidatePath('/admin/users');
    return { success: true };
  } catch (err) {
    console.error('syncUserToDatabase error:', err);
    return { success: false };
  }
}