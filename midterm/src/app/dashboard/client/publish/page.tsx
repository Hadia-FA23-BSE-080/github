'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PublishAd() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Real Estate');
  const [image, setImage] = useState('');

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setImage(event.target?.result as string);
    reader.readAsDataURL(file); // Convert image to Base64 String locally
  };

  const submit = async (status: string) => {
    if (!title || !price) {
      return alert("Title and Price fields are strictly required!");
    }
    
    // Get user from local storage
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : { email: 'guest@test.com' };

    await fetch('/api/ads', {
      method: 'POST',
      body: JSON.stringify({ 
        title, 
        price: Number(price), 
        description, 
        status, 
        userId: user.email, 
        category, 
        image 
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    router.push('/dashboard/client');
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl flex-1">
      <h1 className="text-3xl font-bold mb-2">Create New Marketplace Ad</h1>
      <p className="text-foreground/60 mb-8">Fill out the details to publish your sponsored ad. Include a nice picture!</p>
      
      <div className="space-y-6 bg-card border border-white/10 p-8 rounded-2xl shadow-2xl relative">
         <div className="absolute top-0 w-full left-0 h-1 bg-gradient-to-r from-primary to-blue-500 rounded-t-2xl"></div>

         <div>
           <label className="block mb-2 font-medium text-sm text-foreground/80">Cover Image (Upload)</label>
           <div className={`border-2 border-dashed ${image ? 'border-primary/50' : 'border-white/20 hover:border-white/40'} rounded-xl p-4 transition text-center relative overflow-hidden`}>
             <input type="file" accept="image/*" onChange={handleImage} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
             {image ? (
               <img src={image} alt="Preview" className="h-48 w-full object-cover rounded-lg" />
             ) : (
               <div className="py-8">
                 <div className="text-3xl mb-2">📸</div>
                 <p className="text-foreground/60 font-medium">Click or drag an image here to upload</p>
                 <p className="text-xs text-foreground/40 mt-1">JPEG, PNG up to 5MB</p>
               </div>
             )}
           </div>
         </div>

         <div>
           <label className="block mb-2 font-medium text-sm text-foreground/80">Ad Title</label>
           <input required placeholder="e.g. 2024 Tesla Model 3 Long Range" className="w-full bg-background border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition" value={title} onChange={e => setTitle(e.target.value)} />
         </div>
         
         <div className="flex flex-col md:flex-row gap-4">
           <div className="flex-1">
             <label className="block mb-2 font-medium text-sm text-foreground/80">Price (USD)</label>
             <input required type="number" placeholder="45000" className="w-full bg-background border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition" value={price} onChange={e => setPrice(e.target.value)} />
           </div>
           <div className="flex-1">
             <label className="block mb-2 font-medium text-sm text-foreground/80">Category</label>
             <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-background border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition appearance-none cursor-pointer">
               <option className="bg-card text-white" value="Real Estate">Real Estate</option>
               <option className="bg-card text-white" value="Vehicles">Vehicles</option>
               <option className="bg-card text-white" value="Electronics">Electronics</option>
               <option className="bg-card text-white" value="Services">Services</option>
             </select>
           </div>
         </div>
         
         <div>
           <label className="block mb-2 font-medium text-sm text-foreground/80">Description</label>
           <textarea placeholder="Tell buyers exactly what you are offering..." className="w-full bg-background border border-white/10 rounded-lg p-3 text-white h-40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition resize-none" value={description} onChange={e => setDescription(e.target.value)} />
         </div>
         
         <div className="flex gap-4 pt-6 mt-6 border-t border-white/10">
           <button onClick={() => submit('draft')} className="flex-1 py-3.5 rounded-lg border border-white/20 hover:bg-white/5 transition font-bold tracking-wide">
             SAVE DRAFT
           </button>
           <button onClick={() => submit('review')} className="flex-[2] py-3.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition shadow-[0_0_20px_rgba(79,70,229,0.5)] font-bold tracking-wide">
             SUBMIT FOR REVIEW
           </button>
         </div>
      </div>
    </div>
  );
}
