import React from 'react';
import { Sprout } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 text-white font-extrabold text-lg mb-3">
            <Sprout className="w-6 h-6 text-emerald-500" /> AGRI MITRA
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            Empowering farmers, FPOs, and wholesale buyers with direct digital marketplace access, AI price forecasting, disease analysis, and optimized routing.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Platform</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="/marketplace" className="hover:text-emerald-400 transition">Marketplace</a></li>
            <li><a href="/market-intelligence" className="hover:text-emerald-400 transition">Price Forecasts</a></li>
            <li><a href="/assistant" className="hover:text-emerald-400 transition">AI Farmer Assistant</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Stakeholders</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="/register?role=FARMER" className="hover:text-emerald-400 transition">For Farmers</a></li>
            <li><a href="/register?role=BUYER" className="hover:text-emerald-400 transition">For Wholesale Buyers</a></li>
            <li><a href="/register?role=FPO" className="hover:text-emerald-400 transition">For FPO Organizations</a></li>
            <li><a href="/register?role=DRIVER" className="hover:text-emerald-400 transition">For Logistics Partners</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm mb-3">System Status</h4>
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-800/40">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            All AI Engines & Node Backend Operational
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} AGRI MITRA Digital Marketplace. All rights reserved.
      </div>
    </footer>
  );
};
