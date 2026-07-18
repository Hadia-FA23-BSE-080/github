'use server';

import { revalidatePath } from 'next/cache';
import { createServiceRoleClient } from './supabase/server';
import { Database } from './supabase/types';

// ─── Car CRUD ────────────────────────────────────────────────────────────────

export async function createCar(data: Database['public']['Tables']['cars']['Insert']) {
  const supabase = createServiceRoleClient();
  const { data: result, error } = await supabase
    .from('cars')
    .insert(data as any)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/admin/cars');
  revalidatePath('/buy-car');
  return result;
}

export async function updateCar(id: string, data: Partial<Database['public']['Tables']['cars']['Insert']>) {
  const supabase = createServiceRoleClient();
  const { data: result, error } = await supabase
    .from('cars')
    .update(data as any)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/admin/cars');
  revalidatePath('/buy-car');
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
  revalidatePath('/buy-car');
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

export async function uploadImage(file: File): Promise<string> {
  const supabase = createServiceRoleClient();

  const ext = file.name.split('.').pop() || 'jpg';
  const filename = `admin/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from('car-images')
    .upload(filename, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(`Image upload failed: ${error.message}`);

  const { data } = supabase.storage.from('car-images').getPublicUrl(filename);
  return data.publicUrl;
}

// ============================================================================
// SEO SETTINGS
// ============================================================================

export interface SEOSettingsPayload {
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_image: string | null;
  schema_markup: import('./supabase/types').Json | null;
}

export async function updateSEOSettings(
  pagePath: string,
  data: SEOSettingsPayload,
): Promise<true> {
  const supabase = createServiceRoleClient();

  // Check whether a record for this page_path already exists.
  const { data: existing, error: fetchError } = await supabase
    .from('seo_settings')
    .select('id')
    .eq('page_path', pagePath)
    .maybeSingle(); // maybeSingle() returns null (not an error) when no row found

  if (fetchError) throw new Error(fetchError.message);

  if (existing) {
    // Record exists → UPDATE
    const { error } = await supabase
      .from('seo_settings')
      .update({
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        canonical_url: data.canonical_url,
        og_image: data.og_image,
        schema_markup: data.schema_markup,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id);

    if (error) throw new Error(error.message);
  } else {
    // No record yet → INSERT
    const { error } = await supabase
      .from('seo_settings')
      .insert({
        page_path: pagePath,
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        canonical_url: data.canonical_url,
        og_image: data.og_image,
        schema_markup: data.schema_markup,
        updated_at: new Date().toISOString(),
      });

    if (error) throw new Error(error.message);
  }

  revalidatePath('/admin/seo');
  return true;
}

export async function getAnalytics(_type: string, _dateRange: { start: string, end: string }) {
  const supabase = createServiceRoleClient();

  const [{ count: users }, { count: cars }, { count: inquiries }, { count: inspections }] =
    await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('cars').select('*', { count: 'exact', head: true }),
      supabase.from('inquiries').select('*', { count: 'exact', head: true }),
      supabase.from('inspections').select('*', { count: 'exact', head: true }),
    ]);

  return {
    users: users || 0,
    cars: cars || 0,
    inquiries: inquiries || 0,
    inspections: inspections || 0,
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

// ============================================================================
// USERS ADMIN ACTIONS
// ============================================================================

export async function updateUserStatus(
  userId: string,
  status: 'active' | 'suspended' | 'pending',
): Promise<true> {
  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from('users')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/users');
  return true;
}

// ============================================================================
// SITE SETTINGS
// ============================================================================

/**
 * Upsert every key/value pair into the `site_settings` table.
 * Each setting is stored as a separate row: { key, value }.
 * Uses ON CONFLICT (key) DO UPDATE via Supabase upsert with ignoreDuplicates: false.
 */
export async function saveSiteSettings(
  settings: Record<string, string>,
): Promise<true> {
  const supabase = createServiceRoleClient();

  const rows = Object.entries(settings).map(([key, value]) => ({
    key,
    value: value as import('./supabase/types').Json,
    updated_at: new Date().toISOString(),
  }));

  // upsert with onConflict: 'key' — insert if key is new, update if key exists
  const { error } = await supabase
    .from('site_settings')
    .upsert(rows, { onConflict: 'key' });

  if (error) throw new Error(error.message);

  revalidatePath('/admin/settings');
  return true;
}

// ============================================================================
// AUTH
// ============================================================================

/**
 * Signs the current user out of Supabase Auth.
 * Called from the admin layout logout button.
 * Uses the service-role client so it always succeeds regardless of the
 * caller's own session state.
 */
export async function logoutAdmin(): Promise<void> {
  // signOut is a browser-side operation; we use the anon server client here
  // just to call the Supabase Auth API with the correct project URL/key.
  // The actual session cookie deletion happens on the client after redirect.
  const supabase = createServiceRoleClient();
  await supabase.auth.signOut();
  revalidatePath('/admin/login');
}

// ============================================================================
// FETCH ALL USERS (bypasses RLS using service role)
// ============================================================================

export async function fetchAllUsers() {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from('users')
    .select('id, auth_user_id, name, email, phone, role, status, avatar_url, bio, listings_count, last_login, created_at, updated_at')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

// ============================================================================
// VERIFY ADMIN LOGIN (bypasses Supabase Auth — uses users table directly)
// ============================================================================

export async function verifyAdminLogin(email: string, password: string): Promise<{
  success: boolean;
  user?: { id: string; name: string; email: string; role: string };
  error?: string;
}> {
  // Simple hardcoded admin credentials as primary check
  const ADMIN_EMAIL = 'admin@carfever.com';
  const ADMIN_PASSWORD = 'admin123';

  if (
    email.toLowerCase().trim() === ADMIN_EMAIL &&
    password === ADMIN_PASSWORD
  ) {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from('users')
      .select('id, name, email, role')
      .eq('email', ADMIN_EMAIL)
      .maybeSingle();

    if (data && data.role === 'admin') {
      return { success: true, user: data };
    }
  }

  // Check any admin in users table (future-proof)
  const supabase = createServiceRoleClient();
  const { data: users } = await supabase
    .from('users')
    .select('id, name, email, role')
    .eq('email', email.toLowerCase().trim())
    .eq('role', 'admin')
    .maybeSingle();

  if (!users) {
    return { success: false, error: 'Invalid email or password.' };
  }

  // Since we do not store hashed passwords in users table,
  // accept any admin if credentials match hardcoded password
  if (password !== ADMIN_PASSWORD) {
    return { success: false, error: 'Invalid email or password.' };
  }

  return { success: true, user: users };
}
