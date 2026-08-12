import React from 'react';
import { Gauge, Clock, Activity, Cpu, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

export default function PerformanceDashboard({
  renderTime,
  isOptimized,
  totalItems,
  filteredItemsCount,
  totalChildRenders,
  heavyComputeTime
}) {
  // Determine performance rating color and label
  const isFast = renderTime < 15;
  const isModerate = renderTime >= 15 && renderTime < 50;
  const colorClass = isFast ? '#10b981' : isModerate ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ margin: '0 1rem 1rem 1rem' }}>
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          
          {/* Card 1: Render Duration */}
          <div className="glass-card" style={{ padding: '1rem', borderLeft: `4px solid ${colorClass}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={16} color={colorClass} /> Last Render Time
              </span>
              <span className={`badge ${isFast ? 'badge-green' : isModerate ? 'badge-amber' : 'badge-red'}`}>
                {isFast ? 'EXCELLENT' : isModerate ? 'MODERATE' : 'HEAVY LAG'}
              </span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: colorClass }}>
              {renderTime.toFixed(1)} <span style={{ fontSize: '1rem', fontWeight: 500 }}>ms</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
              Measured via performance.now()
            </div>
          </div>

          {/* Card 2: Child Components Re-render Counter */}
          <div className="glass-card" style={{ padding: '1rem', borderLeft: `4px solid ${isOptimized ? '#06b6d4' : '#f59e0b'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Activity size={16} color={isOptimized ? '#06b6d4' : '#f59e0b'} /> Card Re-Renders
              </span>
              <span className={`badge ${isOptimized ? 'badge-cyan' : 'badge-amber'}`}>
                {isOptimized ? 'Skipped via memo' : 'All Cards Rendered'}
              </span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: isOptimized ? '#22d3ee' : '#fbbf24' }}>
              {totalChildRenders.toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>renders</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
              {isOptimized ? '0 re-renders on parent state change!' : '1,000+ cards re-render on ANY change'}
            </div>
          </div>

          {/* Card 3: Heavy Computation Time */}
          <div className="glass-card" style={{ padding: '1rem', borderLeft: `4px solid ${isOptimized ? '#8b5cf6' : '#ef4444'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Cpu size={16} color={isOptimized ? '#8b5cf6' : '#ef4444'} /> Filter & Calc Cost
              </span>
              <span className={`badge ${isOptimized ? 'badge-indigo' : 'badge-red'}`}>
                {isOptimized ? 'useMemo Active' : 'Recalculating...'}
              </span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: isOptimized ? '#a78bfa' : '#f87171' }}>
              {heavyComputeTime.toFixed(1)} <span style={{ fontSize: '1rem', fontWeight: 500 }}>ms</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
              {isOptimized ? 'Cached until filters actually change' : 'Recalculated on every parent render!'}
            </div>
          </div>

          {/* Card 4: Active Optimization Diagnostics */}
          <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} color="var(--accent-primary)" /> Optimization Stack
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              <div style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.2rem', color: isOptimized ? '#34d399' : '#6b7280' }}>
                {isOptimized ? <CheckCircle2 size={13} /> : <XCircle size={13} />} useMemo (List & Stats)
              </div>
              <div style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.2rem', color: isOptimized ? '#34d399' : '#6b7280' }}>
                {isOptimized ? <CheckCircle2 size={13} /> : <XCircle size={13} />} useCallback (Handlers)
              </div>
              <div style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.2rem', color: isOptimized ? '#34d399' : '#6b7280' }}>
                {isOptimized ? <CheckCircle2 size={13} /> : <XCircle size={13} />} React.memo (ProductCard)
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
