import React from 'react';
import { Zap, AlertTriangle, Play, BookOpen, RefreshCw, Sparkles, Layers } from 'lucide-react';

export default function Header({
  isOptimized,
  setIsOptimized,
  itemCount,
  setItemCount,
  parentCounter,
  setParentCounter,
  onOpenBenchmark,
  onOpenGuide,
  renderTime,
  isThemeDark,
  setIsThemeDark
}) {
  return (
    <header className="glass-panel" style={{ margin: '1rem', padding: '1.25rem 1.5rem', position: 'sticky', top: '1rem', zIndex: 50 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        
        {/* Title & Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '46px', 
            height: '46px', 
            borderRadius: '12px', 
            background: isOptimized ? 'var(--gradient-optimized)' : 'var(--gradient-unoptimized)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)'
          }}>
            {isOptimized ? <Zap size={26} color="#ffffff" /> : <AlertTriangle size={26} color="#ffffff" />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }} className="gradient-text">
                React Performance Lab
              </h1>
              <span className={`badge ${isOptimized ? 'badge-green' : 'badge-red'}`}>
                {isOptimized ? '⚡ OPTIMIZED (useMemo + useCallback)' : '⚠️ UNOPTIMIZED (No Memoization)'}
              </span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
              Day 22 Task • Jack Herrington & CodeWithHarry Performance Optimization Guide
            </p>
          </div>
        </div>

        {/* Global Controls & Mode Switcher */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
          
          {/* Item Count Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(0,0,0,0.25)', padding: '0.25rem 0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <Layers size={14} color="var(--text-muted)" />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Items:</span>
            {[1000, 2500, 5000].map(count => (
              <button
                key={count}
                onClick={() => setItemCount(count)}
                style={{
                  padding: '0.2rem 0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  background: itemCount === count ? 'var(--accent-primary)' : 'transparent',
                  color: itemCount === count ? '#ffffff' : 'var(--text-muted)',
                  transition: 'all 0.2s ease'
                }}
              >
                {count.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Mode Switcher Toggle */}
          <div 
            onClick={() => setIsOptimized(!isOptimized)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: isOptimized ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              border: `1px solid ${isOptimized ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
              padding: '0.4rem 0.8rem',
              borderRadius: '30px',
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <label className="toggle-switch" style={{ pointerEvents: 'none' }}>
              <input type="checkbox" checked={isOptimized} readOnly />
              <span className="slider"></span>
            </label>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isOptimized ? '#34d399' : '#f87171' }}>
              {isOptimized ? 'Optimized Mode' : 'Unoptimized Mode'}
            </span>
          </div>

          {/* Trigger Unrelated Parent State Update */}
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setParentCounter(prev => prev + 1)}
            title="Clicking this updates parent state. In Unoptimized mode, ALL 1,000+ cards re-render! In Optimized mode, 0 cards re-render!"
            style={{ borderColor: 'rgba(99, 102, 241, 0.4)' }}
          >
            <RefreshCw size={14} className="pulse" />
            <span>Trigger Parent Re-render ({parentCounter})</span>
          </button>

          {/* Stress Benchmark Modal */}
          <button className="btn btn-primary btn-sm" onClick={onOpenBenchmark}>
            <Play size={14} />
            <span>Run Benchmark</span>
          </button>

          {/* Guide Modal */}
          <button className="btn btn-secondary btn-sm" onClick={onOpenGuide}>
            <BookOpen size={14} />
            <span>Tutorial Guide</span>
          </button>

        </div>
      </div>
    </header>
  );
}
