'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Save, Loader2, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { saveSiteSettings } from '@/lib/admin-actions';

// ─── Keys we manage ───────────────────────────────────────────────────────────
// These must exactly match the `key` column values in site_settings table.
const SETTING_KEYS = [
  'site_name',
  'contact_email',
  'contact_phone',
  'currency',
  'stripe_public_key',
  'google_analytics_id',
] as const;

type SettingKey = (typeof SETTING_KEYS)[number];

type SettingsState = Record<SettingKey, string>;

const DEFAULTS: SettingsState = {
  site_name:            '',
  contact_email:        '',
  contact_phone:        '',
  currency:             'PKR',
  stripe_public_key:    '',
  google_analytics_id:  '',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Extract a plain string from a jsonb value stored in site_settings.value */
function jsonToString(val: unknown): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  return '';
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminSettingsPage() {
  const [settings,     setSettings]     = useState<SettingsState>(DEFAULTS);
  const [fetching,     setFetching]     = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [showStripeKey, setShowStripeKey] = useState(false);

  // ── Fetch all settings from DB ─────────────────────────────────────────────
  const fetchSettings = useCallback(async () => {
    setFetching(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', SETTING_KEYS as unknown as string[]);

      if (error) throw error;

      // Convert rows into a flat key→string map, merging over defaults
      const loaded: SettingsState = { ...DEFAULTS };
      for (const row of data ?? []) {
        if (SETTING_KEYS.includes(row.key as SettingKey)) {
          loaded[row.key as SettingKey] = jsonToString(row.value);
        }
      }
      setSettings(loaded);
    } catch (err: any) {
      toast.error(`Failed to load settings: ${err.message}`);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // ── Input handler ──────────────────────────────────────────────────────────
  const handleChange = (key: SettingKey) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSettings(prev => ({ ...prev, [key]: e.target.value }));
  };

  // ── Save handler — calls server action ────────────────────────────────────
  const handleSave = async (keys: SettingKey[]) => {
    setSaving(true);
    try {
      const subset = Object.fromEntries(
        keys.map(k => [k, settings[k]]),
      ) as Record<string, string>;

      await saveSiteSettings(subset);
      toast.success('Settings saved successfully.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  // ── Shared input class ─────────────────────────────────────────────────────
  const inputCls =
    'bg-zinc-950 border-zinc-700 text-white placeholder-zinc-600 focus:border-[#0055FE]';

  // ── Skeleton ───────────────────────────────────────────────────────────────
  const Skeleton = () => (
    <div className="h-10 bg-zinc-800 rounded-lg animate-pulse" />
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Settings</h2>
          <p className="text-zinc-400 mt-1">
            Platform configuration — stored in{' '}
            <code className="text-zinc-300 text-xs">site_settings</code> table.
          </p>
        </div>
        <button
          onClick={fetchSettings}
          disabled={fetching}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors disabled:opacity-40 mt-1"
          title="Reload settings from DB"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${fetching ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid gap-6">

        {/* ── General Information ── */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">General Information</CardTitle>
            <CardDescription>Basic details about your marketplace.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {fetching ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site_name" className="text-zinc-300">
                    Site Name
                  </Label>
                  <Input
                    id="site_name"
                    value={settings.site_name}
                    onChange={handleChange('site_name')}
                    placeholder="Car Fever"
                    className={inputCls}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_email" className="text-zinc-300">
                    Contact Email
                  </Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={settings.contact_email}
                    onChange={handleChange('contact_email')}
                    placeholder="contact@carfever.com"
                    className={inputCls}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_phone" className="text-zinc-300">
                    Contact Phone
                  </Label>
                  <Input
                    id="contact_phone"
                    type="tel"
                    value={settings.contact_phone}
                    onChange={handleChange('contact_phone')}
                    placeholder="+92 300 1234567"
                    className={inputCls}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-zinc-300">
                    Default Currency
                  </Label>
                  <Input
                    id="currency"
                    value={settings.currency}
                    onChange={handleChange('currency')}
                    placeholder="PKR"
                    className={inputCls}
                  />
                  <p className="text-xs text-zinc-600">
                    e.g. PKR, USD, EUR
                  </p>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="border-t border-zinc-800 pt-4 flex justify-end">
            <Button
              onClick={() =>
                handleSave(['site_name', 'contact_email', 'contact_phone', 'currency'])
              }
              disabled={saving || fetching}
              className="bg-[#0055FE] hover:bg-blue-700 text-white"
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</>
              ) : (
                <><Save className="w-4 h-4 mr-2" /> Save Changes</>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* ── API Keys & Integrations ── */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">API Keys & Integrations</CardTitle>
            <CardDescription>
              Third-party service connections. Keys are stored encrypted in the DB.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {fetching ? (
              <div className="space-y-4">
                <Skeleton />
                <Skeleton />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="stripe_public_key" className="text-zinc-300">
                    Stripe Public Key
                  </Label>
                  <div className="relative">
                    <Input
                      id="stripe_public_key"
                      type={showStripeKey ? 'text' : 'password'}
                      value={settings.stripe_public_key}
                      onChange={handleChange('stripe_public_key')}
                      placeholder="pk_live_…"
                      className={`${inputCls} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowStripeKey(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                      tabIndex={-1}
                    >
                      {showStripeKey
                        ? <EyeOff className="w-4 h-4" />
                        : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-zinc-600">
                    Only the public key — never enter your secret key here.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="google_analytics_id" className="text-zinc-300">
                    Google Analytics Measurement ID
                  </Label>
                  <Input
                    id="google_analytics_id"
                    value={settings.google_analytics_id}
                    onChange={handleChange('google_analytics_id')}
                    placeholder="G-XXXXXXXXXX"
                    className={inputCls}
                  />
                </div>
              </>
            )}
          </CardContent>

          <CardFooter className="border-t border-zinc-800 pt-4 flex justify-end">
            <Button
              onClick={() =>
                handleSave(['stripe_public_key', 'google_analytics_id'])
              }
              disabled={saving || fetching}
              className="bg-[#0055FE] hover:bg-blue-700 text-white"
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</>
              ) : (
                <><Save className="w-4 h-4 mr-2" /> Save Changes</>
              )}
            </Button>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
}
