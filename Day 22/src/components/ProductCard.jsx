import React, { useRef, useEffect } from 'react';
import { Heart, ShoppingCart, Star, ShieldCheck, Tag, Plus, Minus } from 'lucide-react';

function ProductCardComponent({
  product,
  onToggleFavorite,
  onUpdateCart,
  isOptimized,
  onCardRender
}) {
  // Track render counts for this specific card
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  // Signal parent of child render
  useEffect(() => {
    if (onCardRender) {
      onCardRender();
    }
  });

  const flashClass = isOptimized ? 'card-flash-optimized' : 'card-flash-unoptimized';

  return (
    <div 
      className={`glass-card ${flashClass}`} 
      style={{ 
        padding: '1rem', 
        display: 'flex', 
        flexDirection: 'column', 
        justify: 'space-between', 
        position: 'relative',
        height: '100%'
      }}
    >
      {/* Re-render Badge Counter (Visual proof for user!) */}
      <div 
        title="Number of times this individual card component has rendered in DOM"
        style={{ 
          position: 'absolute', 
          top: '0.6rem', 
          right: '0.6rem', 
          fontSize: '0.675rem', 
          fontFamily: 'var(--font-mono)', 
          padding: '0.15rem 0.45rem', 
          borderRadius: '4px', 
          background: isOptimized ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.25)', 
          color: isOptimized ? '#34d399' : '#f87171', 
          border: `1px solid ${isOptimized ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
          fontWeight: 700
        }}
      >
        Renders: #{renderCountRef.current}
      </div>

      {/* Product Top Metadata */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
          <span className="badge badge-indigo" style={{ fontSize: '0.675rem' }}>
            {product.category}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            {product.sku}
          </span>
        </div>

        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 0.4rem 0', lineHeight: 1.3 }}>
          {product.name}
        </h4>

        {/* Rating & Stock */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#fbbf24', fontSize: '0.8rem', fontWeight: 600 }}>
            <Star size={14} fill="#fbbf24" color="#fbbf24" />
            <span>{product.rating}</span>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>({product.salesCount.toLocaleString()} sold)</span>
          </div>

          <span style={{ fontSize: '0.725rem', color: product.stock > 0 ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.8rem' }}>
          {product.tags.slice(0, 3).map(tag => (
            <span key={tag} style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: 'var(--text-muted)' }}>
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Actions & Price */}
      <div style={{ paddingTop: '0.6rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block' }}>Price</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
            ${product.price.toFixed(2)}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          
          {/* Favorite Toggle Button */}
          <button
            onClick={() => onToggleFavorite(product.id)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: product.isFavorite ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: product.isFavorite ? '#ef4444' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title={product.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          >
            <Heart size={16} fill={product.isFavorite ? '#ef4444' : 'none'} color={product.isFavorite ? '#ef4444' : 'currentColor'} />
          </button>

          {/* Cart Quantity Controls */}
          {product.cartQuantity > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '8px', padding: '0.15rem' }}>
              <button
                onClick={() => onUpdateCart(product.id, -1)}
                style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', padding: '0.2rem', display: 'flex' }}
              >
                <Minus size={13} />
              </button>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, minWidth: '18px', textAlign: 'center', color: '#ffffff' }}>
                {product.cartQuantity}
              </span>
              <button
                onClick={() => onUpdateCart(product.id, 1)}
                style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', padding: '0.2rem', display: 'flex' }}
              >
                <Plus size={13} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onUpdateCart(product.id, 1)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
            >
              <ShoppingCart size={13} /> Add
            </button>
          )}

        </div>
      </div>
    </div>
  );
}

// Memoized version for Optimized Mode
export const MemoizedProductCard = React.memo(ProductCardComponent);

// Unmemoized default version for comparison
export const UnmemoizedProductCard = ProductCardComponent;

export default ProductCardComponent;
