import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Package, Award } from 'lucide-react';

export function computeHeavyAnalytics(products, isOptimized) {
  const startTime = performance.now();

  // Artificial CPU load when unoptimized to simulate heavy data analysis / machine learning scoring
  if (!isOptimized) {
    let dummySum = 0;
    for (let i = 0; i < 300000; i++) {
      dummySum += Math.sqrt(i) * Math.sin(i);
    }
  }

  if (!products || products.length === 0) {
    return {
      avgPrice: 0,
      totalInventoryValuation: 0,
      totalStockVolume: 0,
      highestPriced: null,
      topCategory: 'N/A',
      computeDuration: performance.now() - startTime
    };
  }

  let priceSum = 0;
  let totalValuation = 0;
  let totalStock = 0;
  let maxPriceItem = products[0];
  const categoryCounts = {};

  for (let i = 0; i < products.length; i++) {
    const item = products[i];
    priceSum += item.price;
    totalValuation += item.price * item.stock;
    totalStock += item.stock;

    if (item.price > maxPriceItem.price) {
      maxPriceItem = item;
    }

    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  }

  let topCategory = 'N/A';
  let maxCatCount = 0;
  for (const [cat, count] of Object.entries(categoryCounts)) {
    if (count > maxCatCount) {
      maxCatCount = count;
      topCategory = cat;
    }
  }

  const computeDuration = performance.now() - startTime;

  return {
    avgPrice: priceSum / products.length,
    totalInventoryValuation: totalValuation,
    totalStockVolume: totalStock,
    highestPriced: maxPriceItem,
    topCategory,
    computeDuration
  };
}

export default function AnalyticsPanel({ analytics, isOptimized }) {
  const {
    avgPrice = 0,
    totalInventoryValuation = 0,
    totalStockVolume = 0,
    highestPriced,
    topCategory = 'N/A',
    computeDuration = 0
  } = analytics || {};

  return (
    <div style={{ margin: '0 1rem 1rem 1rem' }}>
      <div className="glass-panel" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={18} color="var(--accent-purple)" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Real-Time Catalog Analytics</h4>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Calc time: <strong style={{ color: isOptimized ? '#34d399' : '#f87171' }}>{computeDuration.toFixed(2)} ms</strong>
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          
          <div className="glass-card" style={{ padding: '0.75rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <DollarSign size={13} color="var(--accent-success)" /> Average Product Price
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>
              ${avgPrice.toFixed(2)}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '0.75rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <TrendingUp size={13} color="var(--accent-secondary)" /> Total Valuation
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>
              ${(totalInventoryValuation / 1000).toFixed(1)}k
            </div>
          </div>

          <div className="glass-card" style={{ padding: '0.75rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Package size={13} color="var(--accent-warning)" /> Total Units in Stock
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>
              {totalStockVolume.toLocaleString()}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '0.75rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Award size={13} color="var(--accent-purple)" /> Top Category
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {topCategory}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
