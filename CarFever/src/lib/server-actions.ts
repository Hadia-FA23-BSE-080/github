'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { createServiceRoleClient } from '@/lib/supabase/server';

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
  brand: string;
  model: string;
  year: number;
  price: number;
  price_display: string | null;
  mileage: number | null;
  fuel_type: string | null;
  transmission: string | null;
  city: string | null;
  location: string | null;
  images: string[] | any;
  badge: string | null;
  rating: number | null;
  engine: string | null;
  description: string | null;
  features: string[] | any;
  slug: string | null;
  is_featured: boolean;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// FETCH APPROVED CARS  (replaces static car-data.ts on Buy Car page)
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
      .select('id, title, brand, model, year, price, price_display, mileage, fuel_type, transmission, city, location, images, badge, rating, engine, description, features, slug, is_featured, created_at', { count: 'exact' })
      .eq('status', 'approved');

    // ── Filters ──────────────────────────────────────────────────────────────
    if (make) query = query.ilike('brand', `%${make}%`);
    if (minPrice != null) query = query.gte('price', minPrice);
    if (maxPrice != null) query = query.lte('price', maxPrice);
    if (year) query = query.eq('year', year);
    if (fuelType) query = query.ilike('fuel_type', `%${fuelType}%`);
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,brand.ilike.%${search}%,model.ilike.%${search}%`
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
// SUBMIT CAR LISTING  (Sell Car wizard → Supabase)
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

    // Upload images to Supabase Storage ──────────────────────────────────────
    const imageUrls: string[] = [];
    for (const file of formData.images) {
      const ext = file.name.split('.').pop();
      const path = `listings/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('car-images')
        .upload(path, file, { upsert: false });

      if (uploadError) {
        console.error('Image upload error:', uploadError.message);
        // Non-fatal: continue without this image
        continue;
      }

      const { data: urlData } = supabase.storage
        .from('car-images')
        .getPublicUrl(path);

      imageUrls.push(urlData.publicUrl);
    }

    const priceLacs = parseFloat(formData.price);
    const pricePKR = Math.round(priceLacs * 100000);

    const { data, error } = await supabase
      .from('cars')
      .insert({
        title: `${formData.year} ${formData.make} ${formData.model}`,
        brand: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        price: pricePKR,
        price_display: `PKR ${priceLacs.toFixed(1)} Lacs`,
        mileage: formData.mileage ? parseInt(formData.mileage) : null,
        transmission:
          formData.transmission.charAt(0).toUpperCase() +
          formData.transmission.slice(1),
        fuel_type:
          formData.fuelType.charAt(0).toUpperCase() +
          formData.fuelType.slice(1),
        engine: formData.engineCapacity
          ? `${formData.engineCapacity} cc`
          : null,
        city: formData.city,
        location: formData.city,
        description:
          formData.description ||
          `${formData.year} ${formData.make} ${formData.model} for sale.`,
        images:
          imageUrls.length > 0
            ? imageUrls
            : [
                'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=600&q=80',
              ],
        features: [],
        status: 'pending' as const,
        seller_name: formData.sellerName,
        seller_phone: formData.sellerPhone,
      } as any)
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
      error:
        err instanceof Error ? err.message : 'Failed to submit car listing',
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBMIT INQUIRY  (Contact Seller / Make an Offer)
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
        status: 'pending' as const,
        is_read: false,
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
        customer_email: formData.customerEmail || null,
        status: 'pending' as const,
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
      error:
        err instanceof Error
          ? err.message
          : 'Failed to submit inspection booking',
    };
  }
}
