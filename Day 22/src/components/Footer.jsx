import React from 'react';

export function Footer() {
  return (
    <footer style={{
      marginTop: 'auto',
      borderTop: '1px solid var(--border-color)',
      padding: '1.5rem 1rem',
      textAlign: 'center',
      fontSize: '0.825rem',
      color: 'var(--text-muted)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
        <div>
          <strong>Day 22 Task</strong> • React Performance Optimization with <code>useMemo</code> & <code>useCallback</code>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          Built with React & Vite • Optimized for 1,000+ to 5,000+ items dataset
        </div>
      </div>
    </footer>
  );
}
