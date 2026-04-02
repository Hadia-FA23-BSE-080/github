'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PricingPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<{name: string, price: number} | null>(null);
  const [loading, setLoading] = useState(false);

  const initiatePurchase = (planName: string, planPrice: number) => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert("Please Log In or Register first to purchase an Ad Package!");
      router.push('/login');
      return;
    }
    // Open Checkout Modal
    setSelectedPlan({ name: planName, price: planPrice });
  }

  const handlePayment = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    // Small delay to simulate real bank processing
    await new Promise(r => setTimeout(r, 1500));
    
    const userStr = localStorage.getItem('user');
    const user = JSON.parse(userStr!);
    
    // Process "payment" via API
    const res = await fetch('/api/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, planName: selectedPlan!.name, planPrice: selectedPlan!.price })
    });
    
    if (res.ok) {
      user.plan = selectedPlan!.name; // Save new plan locally
      localStorage.setItem('user', JSON.stringify(user));
      alert(`🎉 Payment Successful! You are now subscribed to the ${selectedPlan!.name} plan.`);
      router.push('/dashboard/client/publish'); // Redirect to use their new plan
    } else {
      alert("❌ Payment Failed. Please try again or check your card details.");
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 flex-1 relative">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Pricing Packages</h1>
        <p className="text-foreground/60">Choose the right plan to amplify your visibility in the marketplace.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Basic */}
        <div className="border border-white/10 rounded-2xl p-8 bg-card flex flex-col items-center text-center">
          <h3 className="text-xl font-bold mb-2">Basic</h3>
          <p className="text-4xl font-black mb-6">$10<span className="text-sm font-normal text-foreground/60">/ad</span></p>
          <ul className="space-y-4 mb-8 flex-1 text-foreground/80 text-sm">
            <li>✓ 7 days visibility</li>
            <li>✓ Standard search listing</li>
            <li>✓ Basic Analytics</li>
          </ul>
          <button onClick={() => initiatePurchase('Basic', 10)} className="w-full py-3 font-bold rounded-lg border border-white/20 hover:bg-white/5 transition flex items-center justify-center gap-2">
            Buy Basic
          </button>
        </div>

        {/* Standard */}
        <div className="border border-primary/50 relative rounded-2xl p-8 bg-card shadow-[0_0_30px_rgba(79,70,229,0.15)] flex flex-col items-center text-center scale-105 z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]">RECOMMENDED</div>
          <h3 className="text-xl font-bold mb-2">Standard</h3>
          <p className="text-4xl font-black mb-6 text-primary">$25<span className="text-sm font-normal text-foreground/60">/ad</span></p>
          <ul className="space-y-4 mb-8 flex-1 text-foreground/80 text-sm">
            <li>✓ 14 days visibility</li>
            <li>✓ Highlighted color ranking</li>
            <li>✓ Homepage features</li>
            <li>✓ Detailed Analytics</li>
          </ul>
          <button onClick={() => initiatePurchase('Standard', 25)} className="w-full py-3 font-bold rounded-lg bg-primary text-white hover:bg-primary/90 transition shadow-[0_0_15px_rgba(79,70,229,0.5)]">
            Buy Standard
          </button>
        </div>

        {/* Premium */}
        <div className="border border-white/10 rounded-2xl p-8 bg-card flex flex-col items-center text-center">
          <h3 className="text-xl font-bold mb-2">Premium</h3>
          <p className="text-4xl font-black mb-6">$50<span className="text-sm font-normal text-foreground/60">/ad</span></p>
          <ul className="space-y-4 mb-8 flex-1 text-foreground/80 text-sm">
            <li>✓ 30 days visibility</li>
            <li>✓ Top of search results</li>
            <li>✓ Social media promotion</li>
            <li>✓ Private Account Manager</li>
          </ul>
          <button onClick={() => initiatePurchase('Premium', 50)} className="w-full py-3 font-bold rounded-lg border border-white/20 hover:bg-white/5 transition flex items-center justify-center gap-2">
            Buy Premium
          </button>
        </div>
      </div>

      {/* Checkout Modal Overlay */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-white/10 p-8 rounded-2xl max-w-md w-full shadow-2xl relative">
            <button onClick={() => setSelectedPlan(null)} className="absolute top-4 right-4 text-foreground/50 hover:text-white transition font-bold text-xl">✕</button>
            <h2 className="text-2xl font-bold mb-2">Secure Checkout</h2>
            <p className="text-foreground/60 mb-6 text-sm flex justify-between border-b border-white/10 pb-4">
              <span>Selected Package: <strong className="text-primary">{selectedPlan.name}</strong></span>
              <span className="font-bold">${selectedPlan.price}.00</span>
            </p>
            
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                 <label className="block text-sm font-medium mb-1 text-foreground/80">Cardholder Name</label>
                 <input required type="text" placeholder="John Doe" className="w-full px-4 py-3 text-white bg-background border border-white/10 rounded-lg focus:border-primary outline-none transition" />
              </div>
              <div>
                 <label className="block text-sm font-medium mb-1 text-foreground/80">Card Number</label>
                 <input required type="text" maxLength={19} placeholder="xxxx xxxx xxxx xxxx" className="w-full px-4 py-3 text-white bg-background border border-white/10 rounded-lg focus:border-primary outline-none tracking-widest transition" />
              </div>
              <div className="flex gap-4">
                 <div className="flex-1">
                   <label className="block text-sm font-medium mb-1 text-foreground/80">Expiry Date</label>
                   <input required type="text" maxLength={5} placeholder="MM/YY" className="w-full px-4 py-3 text-white bg-background border border-white/10 rounded-lg focus:border-primary outline-none transition text-center" />
                 </div>
                 <div className="flex-1">
                   <label className="block text-sm font-medium mb-1 text-foreground/80">CVC</label>
                   <input required type="text" maxLength={4} placeholder="123" className="w-full px-4 py-3 text-white bg-background border border-white/10 rounded-lg focus:border-primary outline-none transition text-center" />
                 </div>
              </div>

              <div className="pt-4 mt-2 border-t border-white/10">
                <button disabled={loading} type="submit" className="w-full py-4 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition shadow-[0_0_15px_rgba(79,70,229,0.5)] disabled:opacity-50">
                  {loading ? 'Processing Payment...' : `Pay $${selectedPlan.price}.00`}
                </button>
              </div>
              <p className="text-center text-[10px] text-foreground/40 mt-4">
                🔒 Payments are securely simulated for this prototype.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
