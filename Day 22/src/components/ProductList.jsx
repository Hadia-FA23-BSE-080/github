import React, { useState } from 'react';
import { MemoizedProductCard, UnmemoizedProductCard } from './ProductCard';
import { Grid, List, Layers, Sparkles, Inbox } from 'lucide-react';

export default function ProductList({
  products,
  onToggleFavorite,
  onUpdateCart,
  isOptimized,
  onCardRender
}) {
  const [displayLimit, setDisplayLimit] = useState(120); // render first 120 or load all
  const [viewMode, setViewMode] = useState('grid'); // grid vs compact list

  const visibleProducts = products.slice(0, displayLimit);

  if (!products || products.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '3rem 1rem', textAlign: 'center', margin: '0 1rem 1rem 1rem' }}>
        <Inbox size={48} color="var(--text-dim)" style={{ marginBottom: '0.75rem' }} />
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.3rem' }}>No Products Found</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Try clearing your search query or adjusting your filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div style={{ margin: '0 1rem 2rem 1rem' }}>
      
      {/* Header bar for list controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
            Product Catalog ({products.length.toLocaleString()} items found)
          </h3>
          {visibleProducts.length < products.length && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              (Showing first {visibleProducts.length} for smooth DOM rendering)
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          
          {/* Display Limit Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(0,0,0,0.2)', padding: '0.2rem 0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>DOM Limit:</span>
            {[60, 120, 300, products.length].map(limit => (
              <button
                key={limit}
                onClick={() => setDisplayLimit(limit)}
                style={{
                  padding: '0.15rem 0.4rem',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  background: displayLimit === limit ? 'var(--accent-primary)' : 'transparent',
                  color: displayLimit === limit ? '#ffffff' : 'var(--text-dim)'
                }}
              >
                {limit === products.length ? 'ALL' : limit}
              </button>
            ))}
          </div>

          {/* Grid vs List View */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', border: '1px solid var(--border-color)', padding: '2px' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '0.25rem 0.5rem',
                border: 'none',
                borderRadius: '4px',
                background: viewMode === 'grid' ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: viewMode === 'grid' ? '#ffffff' : 'var(--text-dim)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Grid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '0.25rem 0.5rem',
                border: 'none',
                borderRadius: '4px',
                background: viewMode === 'list' ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: viewMode === 'list' ? '#ffffff' : 'var(--text-dim)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <List size={15} />
            </button>
          </div>

        </div>
      </div>

      {/* Grid or List Container */}
      <div style={{ 
        display: viewMode === 'grid' ? 'grid' : 'flex',
        flexDirection: viewMode === 'list' ? 'column' : 'none',
        gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(260px, 1fr))' : 'none',
        gap: '1rem'
      }}>
        {visibleProducts.map((product) => {
          // In OPTIMIZED MODE:
          // 1. We render MemoizedProductCard (wrapped in React.memo)
          // 2. We pass the memoized callback function directly
          if (isOptimized) {
            return (
              <MemoizedProductCard
                key={product.id}
                product={product}
                onToggleFavorite={onToggleFavorite}
                onUpdateCart={onUpdateCart}
                isOptimized={true}
                onCardRender={onCardRender}
              />
            );
          } else {
            // In UNOPTIMIZED MODE:
            // 1. We render UnmemoizedProductCard
            // 2. We pass inline created arrow functions (which change on EVERY single render!)
            return (
              <UnmemoizedProductCard
                key={product.id}
                product={product}
                onToggleFavorite={(id) => onToggleFavorite(id)}
                onUpdateCart={(id, delta) => onUpdateCart(id, delta)}
                isOptimized={false}
                onCardRender={onCardRender}
              />
            );
          }
        })}
      </div>

      {/* Show more prompt if limited */}
      {visibleProducts.length < products.length && (
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => setDisplayLimit(prev => Math.min(prev + 120, products.length))}
          >
            <Sparkles size={14} /> Load More ({products.length - visibleProducts.length} remaining)
          </button>
        </div>
      )}

    </div>
  );
}
