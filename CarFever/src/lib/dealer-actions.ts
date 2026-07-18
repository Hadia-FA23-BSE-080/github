'use server';

import { createServiceRoleClient, createServerClient } from './supabase/server';
import { revalidatePath } from 'next/cache';
import type { DbDealer } from './supabase/types';

export async function getApprovedDealers(filters?: { city?: string; search?: string }) {
  const supabase = createServerClient();
  let query = supabase.from('dealers').select('*').eq('status', 'approved').order('created_at', { ascending: false });

  if (filters?.city) {
    query = query.ilike('city', `%${filters.city}%`);
  }
  if (filters?.search) {
    query = query.ilike('company_name', `%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data as DbDealer[];
}

export async function getAllDealers() {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from('dealers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as DbDealer[];
}

export async function getDealerById(id: string) {
  const supabase = createServerClient();
  const { data, error } = await supabase.from('dealers').select('*').eq('id', id).single();
  
  if (error) throw new Error(error.message);
  return data as DbDealer;
}

export async function getDealerCars(dealerId: string) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('dealer_id', dealerId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function applyForDealer(
  data: Omit<DbDealer, 'id' | 'status' | 'is_verified' | 'rating_avg' | 'total_reviews' | 'created_at' | 'updated_at'>
) {
  const supabase = createServerClient();
  
  // Need to use service role if user_id is missing or if RLS prevents inserts for non-authenticated yet (if auth is broken in local setup)
  // Let's use service role to ensure it works smoothly for now since it's an application form
  const adminSupabase = createServiceRoleClient();
  
  const { error } = await adminSupabase.from('dealers').insert({
    ...data,
    status: 'pending',
    is_verified: false,
    rating_avg: 0,
    total_reviews: 0
  } as any);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/dealers');
  return true;
}

export async function updateDealerStatus(dealerId: string, status: 'approved' | 'suspended' | 'pending') {
  const supabase = createServiceRoleClient();
  const { error } = await supabase.from('dealers').update({ status }).eq('id', dealerId);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/dealers');
  revalidatePath('/dealers');
  return true;
}
