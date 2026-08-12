import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { generateProducts } from './data/mockData';
import Header from './components/Header';
import PerformanceDashboard from './components/PerformanceDashboard';
import FilterControls from './components/FilterControls';
import AnalyticsPanel, { computeHeavyAnalytics } from './components/AnalyticsPanel';
import ProductList from './components/ProductList';
import EducationalGuide from './components/EducationalGuide';
import BenchmarkModal from './components/BenchmarkModal';
import { Footer } from './components/Footer';

export default function App() {
  // Config & Optimization state
  const [isOptimized, setIsOptimized] = useState(true);
  const [itemCount, setItemCount] = useState(1000);
  const [parentCounter, setParentCounter] = useState(0);

  // Modals state
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isBenchmarkOpen, setIsBenchmarkOpen] = useState(false);

  // Products Dataset
  const [products, setProducts] = useState(() => generateProducts(1000));

  // Regenerate dataset when itemCount changes
  useEffect(() => {
    setProducts(generateProducts(itemCount));
  }, [itemCount]);

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [maxPrice, setMaxPrice] = useState(2500);
  const [minRating, setMinRating] = useState(0);
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  // Performance metrics tracking
  const [renderTime, setRenderTime] = useState(0.8);
  const [heavyComputeTime, setHeavyComputeTime] = useState(0);
  const [childRenderCount, setChildRenderCount] = useState(0);
  const renderStartTimeRef = useRef(performance.now());

  // Reset counters when toggling mode
  useEffect(() => {
    setChildRenderCount(0);
  }, [isOptimized, parentCounter]);

  // Record render end time
  useEffect(() => {
    const duration = performance.now() - renderStartTimeRef.current;
    setRenderTime(duration);
  });

  renderStartTimeRef.current = performance.now();

  // Child card render tracker callback
  const handleCardRender = useCallback(() => {
    setChildRenderCount(prev => prev + 1);
  }, []);

  // Filter & Sort Logic:
  // In OPTIMIZED MODE -> useMemo caches the filtered list
  // In UNOPTIMIZED MODE -> filtering runs fresh on EVERY single parent state change
  const computeFilteredProducts = () => {
    const startTime = performance.now();
    const q = searchQuery.trim().toLowerCase();

    let result = products.filter((p) => {
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      const matchesCat = selectedCategory === 'All Categories' || p.category === selectedCategory;
      const matchesPrice = p.price <= maxPrice;
      const matchesRating = p.rating >= minRating;
      const matchesTag = selectedTag === 'All' || p.tags.includes(selectedTag);
      return matchesSearch && matchesCat && matchesPrice && matchesRating && matchesTag;
    });

    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating-desc') result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'sales-desc') result.sort((a, b) => b.salesCount - a.salesCount);
    else if (sortBy === 'name-asc') result.sort((a, b) => a.name.localeCompare(b.name));

    const duration = performance.now() - startTime;
    return { result, duration };
  };

  // 1. Memoized Filtered List (Optimized) vs Unmemoized Filtered List (Unoptimized)
  const memoizedFilteredResult = useMemo(() => {
    const { result, duration } = computeFilteredProducts();
    setHeavyComputeTime(duration);
    return result;
  }, [products, searchQuery, selectedCategory, maxPrice, minRating, selectedTag, sortBy]);

  let filteredProducts;
  if (isOptimized) {
    filteredProducts = memoizedFilteredResult;
  } else {
    const { result, duration } = computeFilteredProducts();
    filteredProducts = result;
  }

  // 2. Memoized Heavy Analytics (Optimized) vs Unmemoized (Unoptimized)
  const memoizedAnalytics = useMemo(() => {
    return computeHeavyAnalytics(filteredProducts, true);
  }, [filteredProducts]);

  const analytics = isOptimized
    ? memoizedAnalytics
    : computeHeavyAnalytics(filteredProducts, false);

  // 3. Callback functions for Card actions
  // In OPTIMIZED MODE -> Wrapped in useCallback so reference is preserved across parent re-renders
  const memoizedToggleFavorite = useCallback((productId) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  }, []);

  const memoizedUpdateCart = useCallback((productId, delta) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, cartQuantity: Math.max(0, item.cartQuantity + delta) }
          : item
      )
    );
  }, []);

  // Unmemoized inline callbacks created fresh on every render
  const unmemoizedToggleFavorite = (productId) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  };

  const unmemoizedUpdateCart = (productId, delta) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, cartQuantity: Math.max(0, item.cartQuantity + delta) }
          : item
      )
    );
  };

  const handleToggleFavorite = isOptimized ? memoizedToggleFavorite : unmemoizedToggleFavorite;
  const handleUpdateCart = isOptimized ? memoizedUpdateCart : unmemoizedUpdateCart;

  // Reset Filters Handler
  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setMaxPrice(2500);
    setMinRating(0);
    setSelectedTag('All');
    setSortBy('featured');
  }, []);

  return (
    <div className="app-container">
      {/* Navigation & Control Header */}
      <Header
        isOptimized={isOptimized}
        setIsOptimized={setIsOptimized}
        itemCount={itemCount}
        setItemCount={setItemCount}
        parentCounter={parentCounter}
        setParentCounter={setParentCounter}
        onOpenBenchmark={() => setIsBenchmarkOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        renderTime={renderTime}
      />

      {/* Real-time Performance Metrics HUD */}
      <PerformanceDashboard
        renderTime={renderTime}
        isOptimized={isOptimized}
        totalItems={products.length}
        filteredItemsCount={filteredProducts.length}
        totalChildRenders={childRenderCount}
        heavyComputeTime={heavyComputeTime}
      />

      {/* Multi-facet Filter & Sort Controls */}
      <FilterControls
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        minRating={minRating}
        setMinRating={setMinRating}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onResetFilters={handleResetFilters}
        filteredCount={filteredProducts.length}
        totalCount={products.length}
      />

      {/* Calculated Real-Time Analytics Panel */}
      <AnalyticsPanel analytics={analytics} isOptimized={isOptimized} />

      {/* Product List Grid */}
      <ProductList
        products={filteredProducts}
        onToggleFavorite={handleToggleFavorite}
        onUpdateCart={handleUpdateCart}
        isOptimized={isOptimized}
        onCardRender={handleCardRender}
      />

      {/* Educational Guide Modal (Jack Herrington & CodeWithHarry) */}
      <EducationalGuide
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Performance Stress Benchmark Modal */}
      <BenchmarkModal
        isOpen={isBenchmarkOpen}
        onClose={() => setIsBenchmarkOpen(false)}
        products={products}
        isOptimized={isOptimized}
        setIsOptimized={setIsOptimized}
        setParentCounter={setParentCounter}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
