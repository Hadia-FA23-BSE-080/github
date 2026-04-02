export default function CategoriesPage() {
  const categories = ["Real Estate", "Vehicles", "Electronics", "Services", "Jobs"];

  return (
    <div className="container mx-auto px-4 py-12 flex-1">
      <h1 className="text-4xl font-bold mb-6">Categories</h1>
      <p className="text-foreground/60 mb-8">Browse the marketplace by category.</p>
      
      <div className="flex flex-wrap gap-4">
        {categories.map((cat, i) => (
          <div key={i} className="px-6 py-4 border border-white/10 rounded-xl bg-card hover:bg-white/5 cursor-pointer transition-colors">
            <h3 className="font-bold">{cat}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
