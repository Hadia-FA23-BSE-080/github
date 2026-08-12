import React, { useState } from 'react';
import { X, BookOpen, Code2, Zap, AlertTriangle, Lightbulb, CheckCircle, HelpCircle } from 'lucide-react';

export default function EducationalGuide({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('useMemo');

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '850px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: '16px',
        border: '1px solid var(--border-glow)',
        padding: '1.5rem',
        position: 'relative',
        boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(255,255,255,0.08)',
            border: 'none',
            color: 'var(--text-main)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <div style={{ background: 'var(--gradient-primary)', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
            <BookOpen size={22} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>
              React Performance Masterclass: useMemo & useCallback
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Inspired by Jack Herrington & CodeWithHarry (Hindi & English Tutorials)
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
          {[
            { id: 'useMemo', label: '1. useMemo (Heavy Calculations)' },
            { id: 'useCallback', label: '2. useCallback (Function Equality)' },
            { id: 'reactMemo', label: '3. React.memo Partnership' },
            { id: 'hindiGuide', label: '4. Hindi Summary (CodeWithHarry)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.825rem',
                background: activeTab === tab.id ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                color: activeTab === tab.id ? '#ffffff' : 'var(--text-muted)',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: useMemo Content */}
        {activeTab === 'useMemo' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Zap size={18} color="var(--accent-success)" />
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>What is useMemo and when should you use it?</h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
              <code>useMemo</code> is a React Hook that caches the result of a calculation between re-renders. It prevents expensive, synchronous CPU operations (like searching/filtering/sorting 1,000+ items or aggregating analytics) from running again unless one of its dependencies changes.
            </p>

            <div className="glass-card" style={{ padding: '1rem', marginBottom: '1rem', background: '#0a0d14' }}>
              <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600, marginBottom: '0.4rem' }}>
                ✅ OPTIMIZED WITH useMemo:
              </div>
              <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#e2e8f0', margin: 0, overflowX: 'auto' }}>
{`// Filter & sort 1,000+ items only when dependencies change!
const filteredProducts = useMemo(() => {
  return products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    p.price <= maxPrice
  ).sort((a, b) => b.rating - a.rating);
}, [products, searchQuery, maxPrice]); // <-- Dependencies Array`}
              </pre>
            </div>

            <div className="glass-card" style={{ padding: '1rem', background: '#1a0d0d' }}>
              <div style={{ fontSize: '0.8rem', color: '#f87171', fontWeight: 600, marginBottom: '0.4rem' }}>
                ❌ UNOPTIMIZED (Calculates on EVERY single render):
              </div>
              <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#e2e8f0', margin: 0, overflowX: 'auto' }}>
{`// Runs every time ANY state in parent updates (even a button counter or theme toggle!)
const filteredProducts = products.filter(p => 
  p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
  p.price <= maxPrice
).sort((a, b) => b.rating - a.rating);`}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 2: useCallback Content */}
        {activeTab === 'useCallback' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Code2 size={18} color="var(--accent-secondary)" />
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>What is useCallback and why does JavaScript reference equality matter?</h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
              In JavaScript, <code>{`(() => {}) !== (() => {})`}</code>. Every time a component renders, inline function declarations create a brand new function reference in memory. <code>useCallback</code> caches the function instance between renders so child components don't detect a changed prop reference!
            </p>

            <div className="glass-card" style={{ padding: '1rem', marginBottom: '1rem', background: '#0a0d14' }}>
              <div style={{ fontSize: '0.8rem', color: '#22d3ee', fontWeight: 600, marginBottom: '0.4rem' }}>
                ⚡ OPTIMIZED WITH useCallback:
              </div>
              <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#e2e8f0', margin: 0, overflowX: 'auto' }}>
{`// Function reference remains identical across parent renders
const handleToggleFavorite = useCallback((productId) => {
  setProducts(prev => prev.map(item => 
    item.id === productId ? { ...item, isFavorite: !item.isFavorite } : item
  ));
}, []); // Empty deps = stable reference forever!`}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 3: React.memo Partnership */}
        {activeTab === 'reactMemo' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <CheckCircle size={18} color="var(--accent-purple)" />
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Why useCallback ONLY works when paired with React.memo!</h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
              As <strong>Jack Herrington</strong> emphasizes in his performance masterclass: <i>"useCallback does nothing on its own if the child component isn't memoized with React.memo!"</i>
            </p>
            <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--accent-primary)', padding: '1rem', borderRadius: '10px', marginBottom: '1rem' }}>
              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.7 }}>
                <li><strong>Step 1:</strong> Wrap child card component in <code>React.memo(ProductCard)</code> so React checks if props changed.</li>
                <li><strong>Step 2:</strong> Wrap callback functions in <code>useCallback</code> so function props retain reference equality.</li>
                <li><strong>Result:</strong> When parent state updates, React compares props, sees <code>prevProps === nextProps</code>, and skips re-rendering 1,000+ cards!</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 4: Hindi Guide (CodeWithHarry Inspired) */}
        {activeTab === 'hindiGuide' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Lightbulb size={18} color="#fbbf24" />
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>React Performance in Hindi (CodeWithHarry Explained)</h3>
            </div>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div className="glass-card" style={{ padding: '1rem' }}>
                <h4 style={{ color: '#fbbf24', fontSize: '0.95rem', marginBottom: '0.4rem' }}>
                  1. useMemo Kyun Use Karte Hain?
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Jab aapke paas 1000+ items ki list ho aur us par filtering ya heavy calculations run ho rahi ho, to har chote se parent render (jaise Theme change ya state update) par poori loop fir se chalti hai. <code>useMemo</code> us value ko cache (memoize) kar leta hai taaki unnecessary recalculations se browser hang na ho.
                </p>
              </div>

              <div className="glass-card" style={{ padding: '1rem' }}>
                <h4 style={{ color: '#22d3ee', fontSize: '0.95rem', marginBottom: '0.4rem' }}>
                  2. useCallback Ka Asli Kaam Kya Hai?
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  JavaScript me har render par naya function create hota hai. Agar aap 1000 child components ko arrow function <code>{`() => handleClick(id)`}</code> bhejenge, to React samjhega ki props change ho gaye hain aur saare 1000 components render ho jayenge. <code>useCallback</code> function ke reference ko freeze (stable) kar deta hai.
                </p>
              </div>

              <div className="glass-card" style={{ padding: '1rem' }}>
                <h4 style={{ color: '#34d399', fontSize: '0.95rem', marginBottom: '0.4rem' }}>
                  3. Performance Formula Summary
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontFamily: 'var(--font-mono)', margin: 0 }}>
                  High Performance = useMemo (Data) + useCallback (Functions) + React.memo (Child Components)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', textAlign: 'right' }}>
          <button className="btn btn-primary" onClick={onClose}>
            Got It! Close Guide
          </button>
        </div>

      </div>
    </div>
  );
}
