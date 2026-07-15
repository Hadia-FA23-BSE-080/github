'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock save
    setTimeout(() => {
      setLoading(false);
      toast.success('Settings saved successfully');
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage platform configuration and preferences.</p>
      </div>

      <div className="grid gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">General Information</CardTitle>
            <CardDescription>Basic details about your marketplace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="siteName" className="text-zinc-300">Site Name</Label>
                <Input id="siteName" defaultValue="Car Fever" className="bg-zinc-950 border-zinc-800" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail" className="text-zinc-300">Contact Email</Label>
                <Input id="contactEmail" defaultValue="contact@carfever.com" className="bg-zinc-950 border-zinc-800" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportPhone" className="text-zinc-300">Support Phone</Label>
                <Input id="supportPhone" defaultValue="+1 (555) 123-4567" className="bg-zinc-950 border-zinc-800" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-zinc-300">Default Currency</Label>
                <Input id="currency" defaultValue="USD ($)" className="bg-zinc-950 border-zinc-800" readOnly />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-zinc-800 pt-4 flex justify-end">
            <Button onClick={handleSave} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">API Keys & Integrations</CardTitle>
            <CardDescription>Manage third-party service connections.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stripeKey" className="text-zinc-300">Stripe Public Key</Label>
                <Input id="stripeKey" type="password" defaultValue="pk_test_1234567890abcdef" className="bg-zinc-950 border-zinc-800" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="analyticsKey" className="text-zinc-300">Google Analytics ID</Label>
                <Input id="analyticsKey" defaultValue="G-ABC123XYZ" className="bg-zinc-950 border-zinc-800" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-zinc-800 pt-4 flex justify-end">
            <Button onClick={handleSave} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
