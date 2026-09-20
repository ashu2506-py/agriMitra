import React from 'react';
import {
  TrendingUp,
  BarChart2,
  CloudSun,
  MapPin,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

export const MarketIntelligencePage: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f6f1]">
      {/* Agricultural background */}
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2400&q=90')",
        }}
      />

      {/* Readability overlay */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#102c20]/55 via-[#f3f6f1]/90 to-[#f3f6f1]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* =====================================================
            MARKET INTELLIGENCE HERO
        ====================================================== */}
        <section className="relative overflow-hidden rounded-[32px] bg-[#102b1f] text-white shadow-2xl shadow-emerald-950/20">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-35"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=2200&q=85')",
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#071b12] via-[#102b1f]/90 to-[#102b1f]/45" />

          <div className="relative p-7 sm:p-9 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">

              <div className="max-w-3xl">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-200">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Market Analytics
                </div>

                {/* Heading */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mt-5">
                  Market Intelligence
                </h1>

                <p className="text-lg sm:text-xl text-white/75 font-semibold mt-2">
                  Understand the market before you sell.
                </p>

                <p className="text-sm text-white/50 leading-relaxed max-w-2xl mt-4">
                  Explore agricultural price forecasts, demand trends and
                  weather risk signals to make better selling decisions.
                </p>

                {/* Location */}
                <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-white/60">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-300" />
                    Prayagraj, Uttar Pradesh
                  </span>

                  <span className="w-1 h-1 rounded-full bg-white/30" />

                  <span>
                    Regional mandi intelligence
                  </span>
                </div>
              </div>

              {/* Header status panel */}
              <div className="w-full lg:w-[280px] rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white/55">
                    Intelligence Status
                  </span>

                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    ACTIVE
                  </span>
                </div>

                <p className="text-2xl font-black mt-4">
                  Market Watch
                </p>

                <p className="text-xs text-white/45 mt-1">
                  Forecast and demand signals are available below.
                </p>

                <button
                  className="w-full mt-5 flex items-center justify-between rounded-xl bg-emerald-400 text-[#092116] px-4 py-3 text-xs font-extrabold hover:bg-emerald-300 transition"
                >
                  Explore Intelligence
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            MARKET SIGNALS
        ====================================================== */}
        <section>
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] font-extrabold text-emerald-700">
                Market Signals
              </p>

              <h2 className="text-2xl font-black text-slate-950 mt-1">
                What the market is saying
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Key intelligence indicators for your selected region.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* PRICE FORECAST */}
            <div className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur border border-white/80 p-6 shadow-xl shadow-slate-900/5">
              <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-emerald-100 blur-3xl" />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.15em] font-extrabold text-slate-400">
                      Price Forecast
                    </p>

                    <h3 className="text-sm font-black text-slate-900 mt-1">
                      XGBoost Price Forecast
                    </h3>
                  </div>

                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>

                <div className="mt-7">
                  <p className="text-3xl font-black text-slate-950">
                    ₹2,400 - ₹2,650
                  </p>

                  <p className="text-xs text-slate-500 mt-2">
                    Predicted range per quintal
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Wheat in Prayagraj district
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                      Confidence
                    </span>

                    <span className="text-xs font-black text-emerald-700">
                      84%
                    </span>
                  </div>

                  <div className="h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: '84%' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* DEMAND */}
            <div className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur border border-white/80 p-6 shadow-xl shadow-slate-900/5">
              <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-blue-100 blur-3xl" />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.15em] font-extrabold text-slate-400">
                      Demand
                    </p>

                    <h3 className="text-sm font-black text-slate-900 mt-1">
                      7-Day Demand Trend
                    </h3>
                  </div>

                  <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    <BarChart2 className="w-5 h-5" />
                  </div>
                </div>

                <div className="mt-7">
                  <div className="flex items-center gap-2">
                    <p className="text-3xl font-black text-emerald-600">
                      INCREASING
                    </p>

                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>

                  <p className="text-xs text-slate-500 mt-2">
                    Estimated regional demand
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-black text-slate-950">
                        +12.4%
                      </p>

                      <p className="text-[10px] text-slate-400 mt-1">
                        Expected change over next 7 days
                      </p>
                    </div>

                    <div className="flex items-end gap-1 h-10">
                      {[35, 45, 40, 55, 62, 70, 82].map((height, index) => (
                        <div
                          key={index}
                          className="w-2 rounded-t bg-emerald-400"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* WEATHER */}
            <div className="relative overflow-hidden rounded-3xl bg-[#102b1f] text-white p-6 shadow-xl shadow-emerald-950/15">
              <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-emerald-400/15 blur-3xl" />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.15em] font-extrabold text-emerald-200/55">
                      Risk Context
                    </p>

                    <h3 className="text-sm font-black mt-1">
                      Weather & Harvest
                    </h3>
                  </div>

                  <div className="w-11 h-11 rounded-2xl bg-white/10 text-emerald-300 flex items-center justify-center">
                    <CloudSun className="w-5 h-5" />
                  </div>
                </div>

                <div className="mt-7">
                  <p className="text-3xl font-black">
                    28°C
                  </p>

                  <p className="text-xs text-white/50 mt-1">
                    65% humidity
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />

                    <span className="text-xs font-bold text-emerald-300">
                      Favorable window
                    </span>
                  </div>

                  <p className="text-xs text-white/50 leading-relaxed mt-2">
                    Optimal harvesting weather window for the next 48 hours in
                    Eastern UP.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
};