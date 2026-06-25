import React from 'react';

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: '#0a0f1e', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white tracking-tight">EasyInstall</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full" style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8' }}>FINTECH</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>
              Pakistan's leading digital consumer financing platform. Zero hidden fees, instant approvals, and paperless documentation.
            </p>
            <div className="flex gap-3 pt-2">
              {['f', 'in', 'tw', 'ig'].map(s => (
                <a key={s} href="#" className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all hover:scale-110" style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#475569' }}>Products</h4>
            <ul className="space-y-2.5">
              {['Smartphones', 'Laptops & Tablets', 'Home Appliances', 'Gaming Consoles'].map(l => (
                <li key={l}><a href="#" className="text-sm transition-colors hover:text-indigo-400" style={{ color: '#64748b' }}>{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#475569' }}>Legal</h4>
            <ul className="space-y-2.5">
              {['Privacy Policy', 'Terms of Service', 'Installment Agreement', 'Fraud Prevention'].map(l => (
                <li key={l}><a href="#" className="text-sm transition-colors hover:text-indigo-400" style={{ color: '#64748b' }}>{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#475569' }}>Contact</h4>
            <ul className="space-y-3">
              {[
                { icon: '📍', text: 'DHA Phase 6, Karachi, Pakistan' },
                { icon: '✉️', text: 'support@easyinstall.com' },
                { icon: '📞', text: '+92 334 4548470' },
              ].map(({ icon, text }) => (
                <li key={text} className="flex items-start gap-2.5 text-sm" style={{ color: '#64748b' }}>
                  <span className="text-base flex-shrink-0">{icon}</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: '#334155' }}>
          <p>© {year} EasyInstall Ltd. All rights reserved.</p>
          <p>Built with ❤️ for Pakistan 🇵🇰</p>
        </div>
      </div>
    </footer>
  );
};
