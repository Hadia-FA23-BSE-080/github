import React from 'react';
import { Search, Filter, ArrowUpDown, Tag, DollarSign, Star, RotateCcw } from 'lucide-react';
import { CATEGORY_LIST, SORT_OPTIONS } from '../data/mockData';

const ALL_TAGS = [
  "Bestseller", "New", "Wireless", "RGB Lighting", "Noise Cancelling", 
  "4K Ultra HD", "Fast Charge", "Waterproof", "Sale", "Premium Build"
];

export default function FilterControls({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
  selectedTag,
  setSelectedTag,
  sortBy,
  setSortBy,
  onResetFilters,
  filteredCount,
  totalCount
}) {
  return (
    <div style={{ margin: '0 1rem 1rem 1rem' }}>
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Filter & Sort 1,000+ Dataset</h3>
            <span className="badge badge-indigo">
              Showing {filteredCount.toLocaleString()} / {totalCount.toLocaleString()} Items
            </span>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={onResetFilters}>
            <RotateCcw size={14} /> Reset Filters
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          
          {/* Search Input */}
          <div>
            <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>
              Search Name or SKU
            </label>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Apex Pro Laptop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>
              Category
            </label>
            <select
              className="input-field"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {CATEGORY_LIST.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Max Price Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
              <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Max Price
              </label>
              <span style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>
                ${maxPrice.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="2500"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-secondary)', cursor: 'pointer' }}
            />
          </div>

          {/* Min Rating */}
          <div>
            <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>
              Minimum Rating
            </label>
            <select
              className="input-field"
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
            >
              <option value={0}>Any Rating</option>
              <option value={3.0}>3.0+ Stars ★★★</option>
              <option value={4.0}>4.0+ Stars ★★★★</option>
              <option value={4.5}>4.5+ Stars ★★★★★</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>
              Sort By
            </label>
            <div style={{ position: 'relative' }}>
              <ArrowUpDown size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              <select
                className="input-field"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ paddingLeft: '2.4rem' }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* Tag Filters Pill List */}
        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginRight: '0.4rem' }}>
            <Tag size={13} /> Tags:
          </span>
          <button
            onClick={() => setSelectedTag('All')}
            className={`badge ${selectedTag === 'All' ? 'badge-indigo' : 'badge-amber'}`}
            style={{ cursor: 'pointer', opacity: selectedTag === 'All' ? 1 : 0.6 }}
          >
            All Tags
          </button>
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? 'All' : tag)}
              className={`badge ${selectedTag === tag ? 'badge-cyan' : 'badge-indigo'}`}
              style={{ cursor: 'pointer', opacity: selectedTag === tag ? 1 : 0.6 }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
