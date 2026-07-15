'use server';

import { revalidatePath } from 'next/cache';
import { createServiceRoleClient } from './supabase/server';
import { Database } from './supabase/types';

// Helper to simulate network delay for testing loading states if needed
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function createCar(data: any) {
  const supabase = createServiceRoleClient();
  const { data: result, error } = await supabase
    .from('cars')
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/admin/cars');
  return result;
}

export async function updateCar(id: string, data: any) {
  const supabase = createServiceRoleClient();
  // @ts-ignore - Supabase type inference issue
  const { data: result, error } = await supabase
    .from('cars')
    .update(data as any)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/admin/cars');
  return result;
}

export async function deleteCar(id: string) {
  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from('cars')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/cars');
  return true;
}

export async function approveCar(id: string) {
  return updateCar(id, { status: 'approved' });
}

export async function rejectCar(id: string) {
  return updateCar(id, { status: 'rejected' });
}

export async function createBlog(data: any) {
  const supabase = createServiceRoleClient();
  const { data: result, error } = await supabase
    .from('blogs')
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/admin/blogs');
  return result;
}

export async function updateBlog(id: string, data: any) {
  const supabase = createServiceRoleClient();
  // @ts-ignore - Supabase type inference issue
  const { data: result, error } = await supabase
    .from('blogs')
    .update(data as any)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/admin/blogs');
  return result;
}

export async function publishBlog(id: string) {
  return updateBlog(id, { status: 'published', published_at: new Date().toISOString() });
}

export async function deleteBlog(id: string) {
  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from('blogs')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/blogs');
  return true;
}

export async function uploadImage(file: File) {
  // In a real implementation, you would upload to Supabase Storage
  // For demo, we just simulate an upload and return a fake URL or data URL
  
  // Example Supabase upload:
  // const { data, error } = await supabaseAdmin.storage.from('images').upload(filename, file);
  
  await delay(1000);
  return `https://dummyimage.com/800x600/000/fff&text=${file.name}`;
}

export async function updateSEOSettings(path: string, data: any) {
  const supabase = createServiceRoleClient();
  // Check if exists
  const { data: existing } = await supabase
    .from('seo_settings')
    .select('id')
    .eq('page_path', path)
    .single();

  let error;
  
  if (existing) {
    // @ts-ignore - Supabase type inference issue
    const { error: updateError } = await supabase
      .from('seo_settings')
      .update(data as any)
      .eq('id', (existing as any).id);
    error = updateError;
  } else {
    const { error: insertError } = await supabase
      .from('seo_settings')
      .insert({ ...data, page_path: path });
    error = insertError;
  }

  if (error) throw new Error(error.message);
  revalidatePath(path); // Revalidate the affected page path
  revalidatePath('/admin/seo');
  return true;
}

export async function getAnalytics(type: string, dateRange: { start: string, end: string }) {
  // Mock data for analytics dashboard
  await delay(800);
  
  return {
    views: Math.floor(Math.random() * 10000),
    users: Math.floor(Math.random() * 5000),
    conversions: Math.floor(Math.random() * 500),
    revenue: Math.floor(Math.random() * 50000),
    series: [
      { name: 'Jan', total: Math.floor(Math.random() * 5000) + 1000 },
      { name: 'Feb', total: Math.floor(Math.random() * 5000) + 1000 },
      { name: 'Mar', total: Math.floor(Math.random() * 5000) + 1000 },
      { name: 'Apr', total: Math.floor(Math.random() * 5000) + 1000 },
      { name: 'May', total: Math.floor(Math.random() * 5000) + 1000 },
      { name: 'Jun', total: Math.floor(Math.random() * 5000) + 1000 },
    ]
  };
}

// ============================================================================
// INQUIRIES ADMIN ACTIONS
// ============================================================================
export async function updateInquiryStatus(id: string, status: 'pending' | 'read' | 'replied' | 'archived') {
  const supabase = createServiceRoleClient();
  // @ts-ignore - Supabase type inference issue
  const { error } = await supabase
    .from('inquiries')
    .update({ status: status as any, is_read: status !== 'pending' } as any)
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/inquiries');
  return true;
}

export async function deleteInquiry(id: string) {
  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from('inquiries')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/inquiries');
  return true;
}

export async function markAllInquiriesRead() {
  const supabase = createServiceRoleClient();
  // @ts-ignore - Supabase type inference issue
  const { error } = await supabase
    .from('inquiries')
    .update({ status: 'read' as any, is_read: true } as any)
    .eq('is_read', false);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/inquiries');
  return true;
}

export async function clearAllInquiries() {
  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from('inquiries')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  if (error) throw new Error(error.message);
  revalidatePath('/admin/inquiries');
  return true;
}

// ============================================================================
// INSPECTIONS ADMIN ACTIONS
// ============================================================================
export async function updateInspectionStatus(id: string, status: 'pending' | 'scheduled' | 'completed' | 'cancelled') {
  const supabase = createServiceRoleClient();
  // @ts-ignore - Supabase type inference issue
  const { error } = await supabase
    .from('inspections')
    .update({ status: status as any } as any)
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/inspections');
  return true;
}

export async function deleteInspection(id: string) {
  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from('inspections')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/inspections');
  return true;
}
