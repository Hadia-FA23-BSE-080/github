import { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/Footer';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { ApplyInstallment } from './pages/ApplyInstallment';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { GuarantorDashboard } from './pages/GuarantorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Messages } from './pages/Messages';
import { mockDb } from './lib/supabaseClient';
import { useAuth } from './contexts/AuthContext';
import type { Product } from './types';
import { Button, Card, PageHeader } from './components/ui';
import { Search, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

function App() {
  const { profile: currentUser, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    // Fetch product listings
    const fetchProds = async () => {
      try {
        const p = await mockDb.getTable('products');
        setProducts(p);
      } catch (e) {
        toast.error("Failed to load catalog products.");
      }
    };
    fetchProds();
  }, []);

  // Redirect to correct dashboard on login
  useEffect(() => {
    if (currentUser && currentTab === 'auth') {
      if (currentUser.role === 'admin') {
        setCurrentTab('admin');
      } else if (currentUser.role === 'guarantor') {
        setCurrentTab('guarantor');
      } else {
        setCurrentTab('customer');
      }
    }
  }, [currentUser, currentTab]);

  // Route guards for security
  useEffect(() => {
    if (!loading) {
      if (currentTab === 'admin' && currentUser?.role !== 'admin') {
        setCurrentTab('landing');
      }
      if (currentTab === 'guarantor' && currentUser?.role !== 'guarantor') {
        setCurrentTab('landing');
      }
      if ((currentTab === 'customer' || currentTab === 'apply' || currentTab === 'messages') && !currentUser) {
        setCurrentTab('auth');
      }
    }
  }, [currentTab, currentUser, loading]);

  const handleApplyNow = (product: Product) => {
    if (!currentUser) {
      toast.warning('Authentication Required', {
        description: 'Please Sign In or Register to apply for installment plans.'
      });
      setCurrentTab('auth');
      return;
    }
    setSelectedProduct(product);
    setCurrentTab('apply');
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-muted-foreground">Loading EasyInstall Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground transition-colors duration-300">
      
      {/* Sticky Header */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
      />

      {/* Main Sections */}
      <main className="flex-1 flex flex-col">
        
        {currentTab === 'landing' && (
          <Landing 
            onApplyProduct={handleApplyNow} 
            user={currentUser} 
          />
        )}

        {currentTab === 'products' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-8">
            <PageHeader 
              title="Search & Browse Catalog" 
              subtitle="Select any premium consumer gadget to estimate installment schedule payments." 
            />

            {/* Filters bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-805 shadow-sm">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products, brand, specs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 p-2.5 border border-slate-200 dark:border-slate-800 bg-card rounded-xl text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                />
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((cat: any) => (
                  <Button
                    key={cat}
                    variant={categoryFilter === cat ? "default" : "secondary"}
                    onClick={() => setCategoryFilter(cat)}
                    size="sm"
                    className="text-xs font-bold"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((prod) => (
                <Card key={prod.id} className="overflow-hidden flex flex-col p-0 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                  <img src={prod.images?.[0]} alt={prod.name} className="h-48 object-cover w-full bg-slate-100 dark:bg-slate-950" />
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/45 px-2.5 py-1 rounded-full">{prod.category}</span>
                      <h3 className="text-base font-extrabold text-foreground mt-2.5 leading-tight">{prod.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed">{prod.description}</p>
                    </div>
                    <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Monthly installment from:</p>
                        <p className="text-xl font-black text-indigo-650 dark:text-indigo-400">Rs. {Math.round((prod.installment_price || prod.price) / 6).toLocaleString()}/mo</p>
                      </div>
                      <Button
                        onClick={() => handleApplyNow(prod)}
                        className="w-full justify-center"
                      >
                        Apply for installment
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {currentTab === 'auth' && (
          <Auth 
            onAuthSuccess={() => {
              // Authentication context state is updated automatically
            }} 
          />
        )}

        {currentTab === 'apply' && (
          <ApplyInstallment 
            selectedProduct={selectedProduct} 
            user={currentUser} 
            onSuccess={() => {
              setCurrentTab('customer');
            }} 
          />
        )}

        {currentTab === 'customer' && currentUser && (
          <CustomerDashboard 
            user={currentUser} 
            onApplyNew={() => {
              setSelectedProduct(null);
              setCurrentTab('apply');
            }} 
          />
        )}

        {currentTab === 'guarantor' && currentUser && (
          <GuarantorDashboard user={currentUser} />
        )}

        {currentTab === 'admin' && currentUser?.role === 'admin' && (
          <AdminDashboard />
        )}

        {currentTab === 'messages' && currentUser && (
          <Messages user={currentUser} />
        )}

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default App;
