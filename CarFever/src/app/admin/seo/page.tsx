'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Search, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { updateSEOSettings } from '@/lib/admin-actions';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PAGES = [
  { path: '/', name: 'Home Page' },
  { path: '/cars', name: 'Cars Listing' },
  { path: '/about', name: 'About Us' },
  { path: '/contact', name: 'Contact' },
  { path: '/blogs', name: 'Blog Overview' }
];

export default function AdminSEOPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [selectedPage, setSelectedPage] = useState('/');
  
  const [formData, setFormData] = useState({
    meta_title: '',
    meta_description: '',
    canonical_url: '',
    og_image: '',
    schema_markup: ''
  });

  useEffect(() => {
    fetchSEOSettings();
  }, [selectedPage]);

  async function fetchSEOSettings() {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .eq('page_path', selectedPage)
        .single();
        
      if (data) {
        setFormData({
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
          canonical_url: data.canonical_url || '',
          og_image: data.og_image || '',
          schema_markup: data.schema_markup ? JSON.stringify(data.schema_markup, null, 2) : ''
        });
      } else {
        // Reset if no data
        setFormData({
          meta_title: '',
          meta_description: '',
          canonical_url: '',
          og_image: '',
          schema_markup: ''
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let parsedSchema = null;
      if (formData.schema_markup) {
        try {
          parsedSchema = JSON.parse(formData.schema_markup);
        } catch (e) {
          throw new Error('Invalid JSON in Schema Markup');
        }
      }

      const dataToSave = {
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        canonical_url: formData.canonical_url,
        og_image: formData.og_image,
        schema_markup: parsedSchema
      };

      await updateSEOSettings(selectedPage, dataToSave);
      toast.success('SEO settings updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update SEO settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">SEO Management</h2>
        <p className="text-muted-foreground mt-1">Optimize your pages for search engines and social sharing.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-4 lg:col-span-3 space-y-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">Select Page</CardTitle>
              <CardDescription>Choose a page to edit its SEO metadata.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {PAGES.map((page) => (
                  <button
                    key={page.path}
                    onClick={() => setSelectedPage(page.path)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedPage === page.path 
                        ? 'bg-red-500/10 text-red-500 font-medium' 
                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    <span>{page.name}</span>
                    <Globe className={`w-4 h-4 ${selectedPage === page.path ? 'text-red-500' : 'text-zinc-500'}`} />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-8 lg:col-span-9">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white text-xl">
                  {PAGES.find(p => p.path === selectedPage)?.name} SEO
                </CardTitle>
                <CardDescription>Path: {selectedPage}</CardDescription>
              </div>
              <Button onClick={handleSubmit} disabled={loading || fetching} className="bg-red-600 hover:bg-red-700 text-white">
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Settings'}
              </Button>
            </CardHeader>
            <CardContent>
              {fetching ? (
                <div className="py-20 text-center text-zinc-500">Loading settings...</div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="meta_title" className="text-zinc-300">Meta Title</Label>
                    <Input 
                      id="meta_title" 
                      name="meta_title" 
                      value={formData.meta_title} 
                      onChange={handleChange} 
                      className="bg-zinc-950 border-zinc-800" 
                      placeholder="e.g. Premium Luxury Cars | Car Fever" 
                    />
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-zinc-500">Ideal length: 50-60 characters</span>
                      <span className={formData.meta_title.length > 60 ? 'text-amber-500' : 'text-zinc-500'}>
                        {formData.meta_title.length} chars
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="meta_description" className="text-zinc-300">Meta Description</Label>
                    <Textarea 
                      id="meta_description" 
                      name="meta_description" 
                      value={formData.meta_description} 
                      onChange={handleChange} 
                      className="bg-zinc-950 border-zinc-800" 
                      placeholder="Write a compelling description for search engine results..." 
                      rows={3}
                    />
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-zinc-500">Ideal length: 150-160 characters</span>
                      <span className={formData.meta_description.length > 160 ? 'text-amber-500' : 'text-zinc-500'}>
                        {formData.meta_description.length} chars
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="canonical_url" className="text-zinc-300">Canonical URL</Label>
                      <Input 
                        id="canonical_url" 
                        name="canonical_url" 
                        value={formData.canonical_url} 
                        onChange={handleChange} 
                        className="bg-zinc-950 border-zinc-800" 
                        placeholder="https://carfever.com/..." 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="og_image" className="text-zinc-300">Social Share Image (OG:Image URL)</Label>
                      <Input 
                        id="og_image" 
                        name="og_image" 
                        value={formData.og_image} 
                        onChange={handleChange} 
                        className="bg-zinc-950 border-zinc-800" 
                        placeholder="https://..." 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schema_markup" className="text-zinc-300">Structured Data (JSON-LD)</Label>
                    <Textarea 
                      id="schema_markup" 
                      name="schema_markup" 
                      value={formData.schema_markup} 
                      onChange={handleChange} 
                      className="bg-zinc-950 border-zinc-800 font-mono text-sm" 
                      placeholder="{ '@context': 'https://schema.org', '@type': 'WebPage', ... }" 
                      rows={8}
                    />
                    <p className="text-xs text-zinc-500 mt-1">Must be valid JSON.</p>
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
