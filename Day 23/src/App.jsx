import { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Calendar, CreditCard, Loader2, Package } from 'lucide-react';
import { supabase } from './lib/supabase';
import './index.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounce search term to avoid hitting the database on every keystroke
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
        // Use the RPC (Remote Procedure Call) we defined in Supabase
        // This handles the JOIN and the Full-Text Search in a single query
        const { data, error } = await supabase.rpc('search_orders_and_customers', {
          search_term: debouncedSearch
        });

        if (error) {
          console.error("Error fetching data:", error);
          // Fallback if RPC is not created yet - standard join without full text search
          if (error.code === '42883') {
             setError("RPC 'search_orders_and_customers' not found. Please run the provided SQL script in your Supabase SQL editor.");
          } else {
             setError(error.message);
          }
          setOrders([]);
        } else {
          setOrders(data || []);
        }
      } catch (err) {
        console.error("Exception fetching data:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [debouncedSearch]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'shipped':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'processing':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'delivered':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default:
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 p-6 md:p-12 font-sans selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Orders Dashboard
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              Advanced Full-Text Search across <span className="text-indigo-400 font-medium">Orders</span> and <span className="text-purple-400 font-medium">Customers</span>.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-96 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search by product, name, email, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#121212] border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all shadow-xl shadow-black/20"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </header>

        {/* Content Section */}
        <main className="bg-[#121212] border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative">
          
          {error ? (
            <div className="p-12 text-center space-y-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500 mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-200">Database Connection Issue</h3>
              <p className="text-slate-400 max-w-lg mx-auto">{error}</p>
              <div className="mt-6 p-4 bg-black/50 border border-white/10 rounded-xl text-left font-mono text-sm overflow-x-auto text-emerald-400">
                <p>1. Check your .env file credentials.</p>
                <p>2. Ensure you have run the provided supabase_setup.sql script in your Supabase project.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="py-5 px-6 font-medium text-slate-400 text-sm tracking-wider uppercase">Order Info</th>
                    <th className="py-5 px-6 font-medium text-slate-400 text-sm tracking-wider uppercase">Customer</th>
                    <th className="py-5 px-6 font-medium text-slate-400 text-sm tracking-wider uppercase">Status</th>
                    <th className="py-5 px-6 font-medium text-slate-400 text-sm tracking-wider uppercase text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 relative">
                  
                  {loading && (
                    <tr>
                      <td colSpan="4" className="py-24">
                        <div className="flex flex-col items-center justify-center text-slate-500 space-y-3">
                          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                          <p>Searching database...</p>
                        </div>
                      </td>
                    </tr>
                  )}

                  {!loading && orders.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-24">
                        <div className="flex flex-col items-center justify-center text-slate-500 space-y-3">
                          <Package className="w-12 h-12 text-slate-600 mb-2" />
                          <p className="text-lg">No orders found matching "{searchTerm}"</p>
                          <p className="text-sm">Try adjusting your search terms.</p>
                        </div>
                      </td>
                    </tr>
                  )}

                  {!loading && orders.map((order) => (
                    <tr 
                      key={order.order_id} 
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Order Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors mt-1">
                            <ShoppingCart size={18} />
                          </div>
                          <div>
                            <p className="font-medium text-slate-200 text-base">{order.product_name}</p>
                            <div className="flex items-center text-xs text-slate-500 mt-1 space-x-2">
                              <Calendar size={12} />
                              <span>{formatDate(order.order_date)}</span>
                              <span>•</span>
                              <span className="font-mono opacity-60 text-[10px] uppercase truncate w-24 block">ID: {order.order_id?.substring(0,8)}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                            {order.first_name?.[0]}{order.last_name?.[0]}
                          </div>
                          <div>
                            <p className="font-medium text-slate-300">{order.first_name} {order.last_name}</p>
                            <p className="text-sm text-slate-500">{order.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <span className="font-semibold text-slate-200 text-lg">
                            {formatCurrency(order.total_amount)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
