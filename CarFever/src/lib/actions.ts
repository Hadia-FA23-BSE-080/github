"use server";

import { createServiceRoleClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ============================================================================
// SUBMIT CAR LISTING (Sell Car Form)
// ============================================================================
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

    // Upload images to Supabase Storage
    const imageUrls: string[] = [];
    for (const file of formData.images) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('car-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Image upload error:', uploadError);
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from('car-images')
        .getPublicUrl(filePath);

      imageUrls.push(publicUrlData.publicUrl);
    }

    // Calculate price in PKR (convert from Lacs to actual number)
    const priceLacs = parseFloat(formData.price);
    const pricePKR = Math.round(priceLacs * 1000000);

    // Insert car listing into database
    const { data: carData, error: carError } = await supabase
      .from('cars')
      .insert({
        title: `${formData.make} ${formData.model}`,
        brand: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        price: pricePKR,
        price_display: `PKR ${priceLacs.toFixed(1)} Lacs`,
        mileage: parseInt(formData.mileage) || null,
        transmission: formData.transmission.charAt(0).toUpperCase() + formData.transmission.slice(1),
        fuel_type: formData.fuelType.charAt(0).toUpperCase() + formData.fuelType.slice(1),
        engine: formData.engineCapacity ? `${formData.engineCapacity} cc` : null,
        city: formData.city,
        location: formData.city,
        description: formData.description || `Pristine ${formData.make} ${formData.model} up for sale.`,
        images: imageUrls.length > 0 ? imageUrls : ["https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=300&q=80"],
        features: [],
        status: 'pending' as const,
        seller_name: formData.sellerName,
        seller_phone: formData.sellerPhone,
      } as any)
      .select()
      .single();

    if (carError) {
      console.error('Car insertion error:', carError);
      throw new Error(`Failed to save car listing: ${carError.message}`);
    }

    const carId = (carData as any)?.id;

    // Revalidate admin pages to show new pending listing
    revalidatePath('/admin/cars');
    revalidatePath('/buy-car');

    return { success: true, carId };
  } catch (error) {
    console.error('submitCarListing error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to submit car listing' 
    };
  }
}

// ============================================================================
// SUBMIT INQUIRY (Contact/Make Offer Forms)
// ============================================================================
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
      .select()
      .single();

    if (error) {
      console.error('Inquiry insertion error:', error);
      throw new Error(`Failed to save inquiry: ${error.message}`);
    }

    const inquiryId = (data as any)?.id;

    // Revalidate admin inquiries page
    revalidatePath('/admin/inquiries');

    return { success: true, inquiryId };
  } catch (error) {
    console.error('submitInquiry error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to submit inquiry' 
    };
  }
}

// ============================================================================
// SUBMIT INSPECTION BOOKING
// ============================================================================
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
  try {
    const supabase = createServiceRoleClient();

    // Plan pricing
    const planPrices = {
      basic: 3500,
      standard: 5500,
      premium: 8500,
    };

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
      .select()
      .single();

    if (error) {
      console.error('Inspection insertion error:', error);
      throw new Error(`Failed to save inspection booking: ${error.message}`);
    }

    const inspectionId = (data as any)?.id;

    // Revalidate admin inspections page
    revalidatePath('/admin/inspections');

    return { success: true, inspectionId };
  } catch (error) {
    console.error('submitInspectionBooking error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to submit inspection booking' 
    };
  }
}
