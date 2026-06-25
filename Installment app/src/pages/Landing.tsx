import React, { useState, useEffect } from 'react';
import { mockDb } from '../lib/supabaseClient';
import type { Product, Announcement } from '../types';
import { Button, Badge, Card, Alert } from '../components/ui';
import { Sparkles, Phone, MessageCircle, HelpCircle, Send, CheckCircle, Calculator, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

interface LandingProps {
  onApplyProduct: (product: Product) => void;
  user: any;
}

export const Landing: React.FC<LandingProps> = ({ onApplyProduct }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [calcAmount, setCalcAmount] = useState<number>(50000);
  const [calcMonths, setCalcMonths] = useState<number>(6);
  const [calcMarkup, setCalcMarkup] = useState<number>(10);
  const [calcDownPayment, setCalcDownPayment] = useState<number>(10000);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const prods = await mockDb.getTable('products');
        const anns = await mockDb.getTable('announcements');
        setProducts(prods);
        setAnnouncements(anns);
      } catch (e) {
        console.error("Failed to load homepage data.");
      }
    };
    load();
  }, []);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mockDb.insert('inquiries', { ...inquiryForm, status: 'pending' });
      setInquiryForm({ name: '', email: '', phone: '', message: '' });
      toast.success('Inquiry submitted successfully!', {
        description: 'Our team will contact you shortly via email.'
      });
    } catch {
      toast.error('Submission failed. Please try again.');
    }
  };

  const totalMarkup = (calcAmount - calcDownPayment) * (calcMarkup / 100);
  const totalPayable = (calcAmount - calcDownPayment) + totalMarkup;
  const monthlyPayment = totalPayable / calcMonths;

  const faqs = [
    { q: 'Who is eligible to apply?', a: 'Any Pakistani citizen over 18 with a valid CNIC, verifiable income, and a clean credit record can apply for our installment plans.' },
    { q: 'What documents are required?', a: 'CNIC (Front & Back), a recent selfie, utility bill, and 3 months bank statement or salary slip.' },
    { q: 'Why is a guarantor required?', a: 'A guarantor is mandatory as a security protocol. They must provide CNIC, phone, and income details.' },
    { q: 'How long does approval take?', a: 'Our credit team reviews applications and provides a decision within 24 business hours.' },
    { q: 'Are there any hidden fees?', a: 'No. Our markup is disclosed upfront in the EMI calculator. What you see is exactly what you pay.' },
  ];

  const steps = [
    { step: '01', icon: '🛍️', title: 'Select Product', desc: 'Browse our catalog and choose your desired gadget.' },
    { step: '02', icon: '📋', title: 'Submit Application', desc: 'Fill in your personal, employment, and guarantor details.' },
    { step: '03', icon: '⚡', title: 'Get Approved', desc: 'Our system reviews and approves within 24 hours.' },
    { step: '04', icon: '🎉', title: 'Enjoy & Pay Monthly', desc: 'Receive your product and pay comfortable monthly installments.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 text-foreground">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden py-20 sm:py-28 lg:py-36 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        {/* Glow blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl bg-indigo-650" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl bg-violet-650" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 shadow-sm mx-auto">
            🇵🇰 Pakistan's #1 Consumer Financing Platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-none text-white max-w-4xl mx-auto">
            Dream Now,{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">
              Pay Later.
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed text-slate-300">
            Instant approvals, transparent plans, zero hidden fees. Shop smartphones, laptops &amp; gaming consoles on flexible monthly installments.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="#products" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto shadow-indigo-500/25 shadow-lg px-8 py-6 h-auto text-base">
                Apply Now →
              </Button>
            </a>
            <a href="#calculator" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto border border-white/10 bg-white/5 hover:bg-white/10 text-white px-8 py-6 h-auto text-base backdrop-blur-md">
                EMI Calculator
              </Button>
            </a>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto pt-6 border-t border-white/10">
            {[
              ['98%', 'Approval Rate'],
              ['24h', 'Processing'],
              ['10k+', 'Happy Clients']
            ].map(([val, lbl]) => (
              <div key={lbl} className="text-center">
                <p className="text-2xl sm:text-3xl font-black text-indigo-455">{val}</p>
                <p className="text-xs sm:text-sm mt-1 text-slate-400">{lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANNOUNCEMENTS ── */}
      {announcements.filter(a => a.is_active).length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {announcements.filter(a => a.is_active).map((ann) => (
              <div key={ann.id} className="relative overflow-hidden rounded-2xl p-6 flex items-center gap-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-650/15">
                <div className="flex-1 min-w-0">
                  <Badge className="bg-white/20 text-white hover:bg-white/30 border-none mb-3">
                    {ann.type.toUpperCase()}
                  </Badge>
                  <h3 className="text-base sm:text-lg font-bold leading-tight">{ann.title}</h3>
                  <p className="text-xs sm:text-sm mt-1.5 text-indigo-100">{ann.content}</p>
                </div>
                {ann.image_url && (
                  <img src={ann.image_url} alt={ann.title} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl shrink-0 border border-white/25 shadow-md" />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Simple Process</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">How Installments Work</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">Apply, get verified, and take your dream product home in 4 easy steps.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <Card key={s.step} className="relative group hover:scale-[1.02] transition-all duration-350 p-6 flex flex-col justify-between">
                <div className="absolute top-4 right-4 text-4xl font-black opacity-10 group-hover:opacity-15 transition-opacity text-slate-400 select-none">{s.step}</div>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">{s.icon}</div>
                <div>
                  <h3 className="text-base font-extrabold text-foreground mb-2">{s.title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section id="products" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Our Catalog</span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mt-1">Featured Products</h2>
            </div>
            <p className="text-xs text-muted-foreground sm:max-w-xs">Select any high-demand electronic gadget below to checkout installment plans.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((prod) => (
              <Card key={prod.id} className="overflow-hidden flex flex-col p-0 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-100 dark:bg-slate-950">
                  <img src={prod.images?.[0] || ''} alt={prod.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]" />
                  <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-sm">In Stock</span>
                </div>
                <div className="flex flex-col flex-1 p-5 gap-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">{prod.category}</span>
                    <h3 className="text-sm font-bold text-foreground mt-1 leading-tight line-clamp-2">{prod.name}</h3>
                  </div>
                  <div className="flex items-baseline justify-between mt-auto pt-3.5 border-t border-slate-100 dark:border-slate-800/80">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Monthly from</p>
                      <p className="text-base font-black text-indigo-650 dark:text-indigo-400">Rs. {Math.round((prod.installment_price || prod.price) / 6).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Cash Price</p>
                      <p className="text-xs font-semibold text-muted-foreground line-through">Rs. {prod.price?.toLocaleString()}</p>
                    </div>
                  </div>
                  <Button onClick={() => onApplyProduct(prod)} className="w-full justify-center">
                    Apply for Installments
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── EMI CALCULATOR ── */}
      <section id="calculator" className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Free Calculator Tool</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">Estimate Your Repayments</h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">Adjust value sliders below to dynamically calculate your monthly dues.</p>
          </div>
          
          <Card className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-6 sm:p-8 bg-card shadow-lg border border-slate-200/50 dark:border-slate-800">
            <div className="space-y-6">
              {[
                { label: `Product Price: Rs. ${calcAmount.toLocaleString()}`, min: 10000, max: 500000, step: 5000, value: calcAmount, onChange: setCalcAmount },
                { label: `Down Payment: Rs. ${calcDownPayment.toLocaleString()}`, min: 2000, max: Math.floor(calcAmount * 0.5), step: 1000, value: calcDownPayment, onChange: setCalcDownPayment },
              ].map(({ label, min, max, step, value, onChange }) => (
                <div key={label} className="space-y-2">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wider">{label}</p>
                  <input 
                    type="range" 
                    min={min} 
                    max={max} 
                    step={step} 
                    value={value} 
                    onChange={e => onChange(Number(e.target.value))} 
                    className="w-full accent-indigo-600 dark:accent-indigo-500 cursor-pointer h-1.5 rounded-lg bg-slate-100 dark:bg-slate-800" 
                  />
                </div>
              ))}
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Tenure Select', value: calcMonths, onChange: setCalcMonths, options: [3,6,9,12,18,24].map(m => ({ v: m, l: `${m} Months` })) },
                  { label: 'Markup Rate %', value: calcMarkup, onChange: setCalcMarkup, options: [0,5,10,15,20,25].map(m => ({ v: m, l: `${m}% Markup` })) },
                ].map(({ label, value, onChange, options }) => (
                  <div key={label} className="space-y-1.5">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">{label}</p>
                    <select 
                      value={value} 
                      onChange={e => onChange(Number(e.target.value))} 
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-card rounded-xl text-xs text-foreground font-semibold outline-none"
                    >
                      {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-6 sm:p-8 text-center space-y-6 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-600 text-white shadow-xl shadow-indigo-600/25">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-indigo-100">Estimated Repayments</p>
                <p className="text-3xl sm:text-4xl font-black mt-2">Rs. {Math.round(monthlyPayment).toLocaleString()}</p>
                <p className="text-xs mt-1 text-indigo-200">per month for {calcMonths} months</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/15">
                {[
                  ['Principal', `Rs. ${(calcAmount - calcDownPayment).toLocaleString()}`],
                  ['Markup', `Rs. ${Math.round(totalMarkup).toLocaleString()}`],
                  ['Total Payable', `Rs. ${Math.round(totalPayable).toLocaleString()}`],
                  ['Down Payment', `Rs. ${calcDownPayment.toLocaleString()}`],
                ].map(([l, v]) => (
                  <div key={l} className="text-left">
                    <p className="text-[9px] uppercase tracking-wider text-indigo-200 font-bold">{l}</p>
                    <p className="text-sm font-extrabold text-white mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
              <a href="#products" className="block">
                <Button variant="secondary" className="w-full border border-white/35 bg-white/10 hover:bg-white/20 text-white font-bold h-11 text-xs">
                  Apply Now →
                </Button>
              </a>
            </div>
          </Card>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Reviews</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">What Our Customers Say</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Kamran Shah', role: 'Freelancer', quote: 'I got my MacBook Pro on easy installments within 24 hours. Paperless process and excellent customer support!', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
              { name: 'Ayesha Siddiqui', role: 'Lecturer', quote: 'No hidden fees. Exactly what the calculator showed is what I paid. Highly recommend their zero markup seasonal offer.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
              { name: 'Bilal Khan', role: 'Business Owner', quote: 'EasyInstall simplified gadget financing for me. Bank transfer payments are extremely fast and smooth.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
            ].map((t, idx) => (
              <Card key={idx} className="p-6 space-y-4 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i} className="text-amber-400 text-sm">★</span>)}
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">"{t.quote}"</p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover shrink-0 border dark:border-slate-800" />
                  <div>
                    <p className="text-xs font-bold text-foreground">{t.name}</p>
                    <p className="text-[10px] text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">FAQs</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground animate-fade-in">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <Card key={idx} className="overflow-hidden p-0 border border-slate-200/50 dark:border-slate-800/80 bg-card">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)} 
                  className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-950/20"
                >
                  <span className="font-semibold text-sm sm:text-base text-foreground pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-indigo-600 dark:text-indigo-455 transition-transform duration-200 shrink-0 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm leading-relaxed text-muted-foreground border-t border-slate-100 dark:border-slate-850">
                    <div className="pt-4">{faq.a}</div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="py-16 sm:py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-6 sm:p-10 border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
            <div className="text-center mb-8 space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Contact Us</span>
              <h2 className="text-3xl font-black tracking-tight text-foreground">Have Questions? Ask Us</h2>
              <p className="text-xs text-muted-foreground">Our team will reply within a few hours via email.</p>
            </div>

            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Full Name *</label>
                  <input type="text" required placeholder="Ali Ahmed" value={inquiryForm.name} onChange={e => setInquiryForm({ ...inquiryForm, name: e.target.value })} className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-card rounded-xl text-xs text-foreground focus:ring-2 focus:ring-ring outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Email Address *</label>
                  <input type="email" required placeholder="ali@gmail.com" value={inquiryForm.email} onChange={e => setInquiryForm({ ...inquiryForm, email: e.target.value })} className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-card rounded-xl text-xs text-foreground focus:ring-2 focus:ring-ring outline-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Phone (Optional)</label>
                <input type="text" placeholder="03001234567" value={inquiryForm.phone} onChange={e => setInquiryForm({ ...inquiryForm, phone: e.target.value })} className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-card rounded-xl text-xs text-foreground focus:ring-2 focus:ring-ring outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Message *</label>
                <textarea required rows={4} placeholder="Tell us what you want to inquire..." value={inquiryForm.message} onChange={e => setInquiryForm({ ...inquiryForm, message: e.target.value })} className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-card rounded-xl text-xs text-foreground focus:ring-2 focus:ring-ring outline-none resize-none" />
              </div>
              <Button type="submit" className="w-full justify-center mt-6 py-3" icon={<Send className="w-4 h-4" />}>
                Submit Inquiry
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* ── FLOATING BUTTONS ── */}
      <div className="fixed bottom-5 right-5 flex flex-col gap-3 z-50">
        <a href="tel:+923344548470" title="Call Us" className="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg transition-transform hover:scale-110 bg-indigo-650 hover:bg-indigo-700 text-white shadow-indigo-600/30">
          <Phone className="w-5 h-5" />
        </a>
        <a href="https://wa.me/923344548470?text=Hi,%20I%20want%20to%20apply%20for%2520installment." target="_blank" rel="noopener noreferrer" title="WhatsApp" className="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg transition-transform hover:scale-110 bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30">
          <MessageCircle className="w-5 h-5" />
        </a>
      </div>

    </div>
  );
};
