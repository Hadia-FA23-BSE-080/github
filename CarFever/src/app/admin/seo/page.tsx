'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Globe, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { updateSEOSettings, type SEOSettingsPayload } from '@/lib/admin-actions';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { DbSEOSetting } from '@/lib/supabase/types';

// ─── Page list using exact DB page_path values ───────────────────────────────
const PAGES: { path: string; name: string }[] = [
  { path: 'home',        name: 'Home Page' },
  { path: 'buy-car',     name: 'Buy Car' },
  { path: 'sell-car',    name: 'Sell Car' },
  { path: 'inspections', name: 'Inspections' },
  { path: 'blog',        name: 'Blog' },
  { path: 'about',       name: 'About Us' },
  { path: 'contact',     name: 'Contact' },
];

// ─── Empty form state ─────────────────────────────────────────────────────────
const EMPTY_FORM = {
  meta_title:       '',
  meta_description: '',
  canonical_url:    '',
  og_image:         '',
  schema_markup:    '',
};

type FormState = typeof EMPTY_FORM;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function schemaToString(value: DbSEOSetting['schema_markup']): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return JSON.stringify(value, null, 2);
}

export default function AdminSEOPage() {
  const [selectedPath, setSelectedPath] = useState<string>(PAGES[0].path);
  const [formData,     setFormData]     = useState<FormState>(EMPTY_FORM);
  const [fetching,     setFetching]     = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [schemaError,  setSchemaError]  = useState<string | null>(null);

  // ── Fetch settings for the currently selected page ──────────────────────────
  const fetchSettings = useCallback(async (path: string) => {
    setFetching(true);
    setSchemaError(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('seo_settings')
        .select('meta_title, meta_description, canonical_url, og_image, schema_markup')
        .eq('page_path', path)
        .maybeSingle(); // returns null — not an error — when no row found

      if (error) throw error;

      if (data) {
        setFormData({
          meta_title:       data.meta_title       ?? '',
          meta_description: data.meta_description ?? '',
          canonical_url:    data.canonical_url    ?? '',
          og_image:         data.og_image         ?? '',
          schema_markup:    schemaToString(data.schema_markup),
        });
      } else {
        // No saved settings yet for this page — clear the form
        setFormData(EMPTY_FORM);
      }
    } catch (err: any) {
      toast.error(`Failed to load SEO settings: ${err.message}`);
      setFormData(EMPTY_FORM);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings(selectedPath);
  }, [selectedPath, fetchSettings]);

  // ── Input handler ────────────────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'schema_markup') setSchemaError(null);
  };

  // ── Save ─────────────────────────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSchemaError(null);

    // Validate JSON-LD before sending to server
    let parsedSchema: DbSEOSetting['schema_markup'] = null;
    if (formData.schema_markup.trim()) {
      try {
        parsedSchema = JSON.parse(formData.schema_markup);
      } catch {
        setSchemaError('Invalid JSON — please fix the Structured Data field before saving.');
        return;
      }
    }

    setSaving(true);
    try {
      const payload: SEOSettingsPayload = {
        meta_title:       formData.meta_title       || null,
        meta_description: formData.meta_description || null,
        canonical_url:    formData.canonical_url    || null,
        og_image:         formData.og_image         || null,
        schema_markup:    parsedSchema,
      };

      await updateSEOSettings(selectedPath, payload);
      toast.success('SEO settings saved successfully.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save SEO settings.');
    } finally {
      setSaving(false);
    }
  };

  const selectedPage = PAGES.find(p => p.path === selectedPath)!;
  const isBusy = fetching || saving;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">SEO Management</h2>
        <p className="text-zinc-400 mt-1">
          Per-page meta titles, descriptions, canonical URLs, Open Graph images, and JSON-LD.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">

        {/* ── Page selector sidebar ── */}
        <div className="md:col-span-4 lg:col-span-3">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-base">Select Page</CardTitle>
              <CardDescription className="text-xs">
                Choose a page to edit its SEO settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <nav className="space-y-1">
                {PAGES.map(page => {
                  const active = selectedPath === page.path;
                  return (
                    <button
                      key={page.path}
                      onClick={() => setSelectedPath(page.path)}
                      disabled={fetching}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        active
                          ? 'bg-[#0055FE]/15 text-[#0055FE] font-semibold border border-[#0055FE]/25'
                          : 'text-zinc-400 hover:bg-zinc-800 hover:text-white border border-transparent'
                      }`}
                    >
                      <span>{page.name}</span>
                      <Globe className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-[#0055FE]' : 'text-zinc-600'}`} />
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* ── Form panel ── */}
        <div className="md:col-span-8 lg:col-span-9">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-start justify-between gap-4 pb-4">
              <div>
                <CardTitle className="text-white text-xl">
                  {selectedPage.name}
                  <span className="ml-2 text-sm font-normal text-zinc-500">SEO Settings</span>
                </CardTitle>
                <CardDescription className="mt-1 font-mono text-xs">
                  page_path: <span className="text-zinc-300">&quot;{selectedPath}&quot;</span>
                </CardDescription>
              </div>
              <Button
                onClick={handleSave}
                disabled={isBusy}
                className="bg-[#0055FE] hover:bg-blue-700 text-white shrink-0"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</>
                ) : (
                  <><Save className="w-4 h-4 mr-2" /> Save Settings</>
                )}
              </Button>
            </CardHeader>

            <CardContent>
              {fetching ? (
                <div className="py-24 flex flex-col items-center justify-center gap-3 text-zinc-500">
                  <Loader2 className="w-7 h-7 animate-spin" />
                  <span className="text-sm">Loading settings…</span>
                </div>
              ) : (
                <form onSubmit={handleSave} className="space-y-6">

                  {/* Meta Title */}
                  <div className="space-y-2">
                    <Label htmlFor="meta_title" className="text-zinc-300 text-sm font-medium">
                      Meta Title
                    </Label>
                    <Input
                      id="meta_title"
                      name="meta_title"
                      value={formData.meta_title}
                      onChange={handleChange}
                      className="bg-zinc-950 border-zinc-700 text-white placeholder-zinc-600 focus:border-[#0055FE]"
                      placeholder="e.g. Buy Used Cars in Pakistan | Car Fever"
                    />
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-600">Ideal: 50–60 characters</span>
                      <span className={formData.meta_title.length > 60 ? 'text-amber-400 font-medium' : 'text-zinc-600'}>
                        {formData.meta_title.length} / 60
                      </span>
                    </div>
                  </div>

                  {/* Meta Description */}
                  <div className="space-y-2">
                    <Label htmlFor="meta_description" className="text-zinc-300 text-sm font-medium">
                      Meta Description
                    </Label>
                    <Textarea
                      id="meta_description"
                      name="meta_description"
                      value={formData.meta_description}
                      onChange={handleChange}
                      rows={3}
                      className="bg-zinc-950 border-zinc-700 text-white placeholder-zinc-600 focus:border-[#0055FE] resize-none"
                      placeholder="A compelling one-sentence description that appears in search results…"
                    />
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-600">Ideal: 150–160 characters</span>
                      <span className={formData.meta_description.length > 160 ? 'text-amber-400 font-medium' : 'text-zinc-600'}>
                        {formData.meta_description.length} / 160
                      </span>
                    </div>
                  </div>

                  {/* Canonical URL + OG Image */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="canonical_url" className="text-zinc-300 text-sm font-medium">
                        Canonical URL
                      </Label>
                      <Input
                        id="canonical_url"
                        name="canonical_url"
                        value={formData.canonical_url}
                        onChange={handleChange}
                        className="bg-zinc-950 border-zinc-700 text-white placeholder-zinc-600 focus:border-[#0055FE]"
                        placeholder="https://carfever.com/buy-car"
                      />
                      <p className="text-xs text-zinc-600">
                        Leave blank to use the page&apos;s own URL.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="og_image" className="text-zinc-300 text-sm font-medium">
                        OG Image URL
                        <span className="ml-1.5 text-zinc-600 font-normal">(Social share image)</span>
                      </Label>
                      <Input
                        id="og_image"
                        name="og_image"
                        value={formData.og_image}
                        onChange={handleChange}
                        className="bg-zinc-950 border-zinc-700 text-white placeholder-zinc-600 focus:border-[#0055FE]"
                        placeholder="https://…/og-image.jpg"
                      />
                      <p className="text-xs text-zinc-600">Recommended: 1200 × 630 px.</p>
                    </div>
                  </div>

                  {/* OG Image preview */}
                  {formData.og_image && (
                    <div className="rounded-xl overflow-hidden border border-zinc-800 aspect-[1200/630] max-w-sm bg-zinc-950">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.og_image}
                        alt="OG image preview"
                        className="w-full h-full object-cover"
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  )}

                  {/* JSON-LD Schema */}
                  <div className="space-y-2">
                    <Label htmlFor="schema_markup" className="text-zinc-300 text-sm font-medium">
                      Structured Data
                      <span className="ml-1.5 text-zinc-600 font-normal">(JSON-LD)</span>
                    </Label>
                    <Textarea
                      id="schema_markup"
                      name="schema_markup"
                      value={formData.schema_markup}
                      onChange={handleChange}
                      rows={10}
                      className={`bg-zinc-950 border-zinc-700 text-white placeholder-zinc-600 focus:border-[#0055FE] font-mono text-xs resize-y ${
                        schemaError ? 'border-red-500 focus:border-red-500' : ''
                      }`}
                      placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "WebPage",\n  "name": "Car Fever"\n}'}
                      spellCheck={false}
                    />
                    {schemaError ? (
                      <p className="text-xs text-red-400 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {schemaError}
                      </p>
                    ) : (
                      <p className="text-xs text-zinc-600">
                        Must be valid JSON. Validated client-side before saving.
                      </p>
                    )}
                  </div>

                  {/* Bottom save row */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                    <p className="text-xs text-zinc-600">
                      Saved settings are stored in the{' '}
                      <code className="text-zinc-400">seo_settings</code> table under{' '}
                      <code className="text-zinc-400">page_path = &quot;{selectedPath}&quot;</code>.
                    </p>
                    <Button
                      type="submit"
                      disabled={isBusy}
                      className="bg-[#0055FE] hover:bg-blue-700 text-white"
                    >
                      {saving ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</>
                      ) : (
                        <><Save className="w-4 h-4 mr-2" /> Save Settings</>
                      )}
                    </Button>
                  </div>

                </form>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
