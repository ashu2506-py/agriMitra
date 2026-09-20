import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  ShoppingBag,
  TrendingUp,
  ShieldCheck,
  Truck,
  Bot,
  ArrowRight,
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  X,
  Leaf,
  ScanSearch,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [cropImage, setCropImage] = useState<File | null>(null);
  const [cropPreview, setCropPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleCropImage = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB.');
      return;
    }

    setCropImage(file);
    setCropPreview(URL.createObjectURL(file));
    setAnalysisResult(null);
  };

  const handleFileInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      handleCropImage(file);
    }
  };

  const removeCropImage = () => {
    if (cropPreview) {
      URL.revokeObjectURL(cropPreview);
    }

    setCropImage(null);
    setCropPreview(null);
    setAnalysisResult(null);
  };

  const handleAnalyzeCrop = async () => {
    if (!cropImage) return;

    setAnalyzing(true);
    setAnalysisResult(null);

    /*
     * The backend crop-health AI endpoint will be connected here.
     *
     * Example:
     *
     * const formData = new FormData();
     * formData.append('image', cropImage);
     *
     * const response = await fetch('/api/ai/crop-health', {
     *   method: 'POST',
     *   credentials: 'include',
     *   body: formData,
     * });
     *
     * const data = await response.json();
     * setAnalysisResult(data.data.result);
     */

    // Temporary UI state until the image-AI backend endpoint is connected.
    setTimeout(() => {
      setAnalysisResult(
        'Your crop image has been uploaded successfully. AI crop-health analysis will be connected to the Agri Mitra vision model next.'
      );
      setAnalyzing(false);
    }, 1200);
  };

  return (
    <div className="space-y-16 pb-16">

      {/* ========================================================= */}
      {/* HERO SECTION */}
      {/* ========================================================= */}

      <section className="relative overflow-hidden min-h-[620px] flex items-center">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2400&q=90')",
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/85 via-emerald-900/55 to-transparent" />

        <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold border border-white/25 mb-6">
              <Sprout className="w-4 h-4" />
              Next-Gen AI Farm-to-Market Platform
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              From Farm to Market,
              <span className="block text-emerald-300">
                Powered by AI
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-white/85 max-w-2xl leading-relaxed">
              Connect farmers, FPOs, buyers, and logistics partners through
              one intelligent agricultural marketplace.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to="/marketplace"
                className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
              >
                Explore Marketplace
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/register"
                className="w-full sm:w-auto px-6 py-3.5 bg-white/95 hover:bg-white text-slate-800 font-semibold rounded-xl shadow-lg transition text-center"
              >
                Join Agri Mitra
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 max-w-xl">
              <div>
                <p className="text-2xl font-bold text-white">
                  AI
                </p>
                <p className="text-xs text-white/70 mt-1">
                  Crop Intelligence
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-white">
                  Direct
                </p>
                <p className="text-xs text-white/70 mt-1">
                  Farmer Marketplace
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-white">
                  Live
                </p>
                <p className="text-xs text-white/70 mt-1">
                  Logistics Tracking
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================= */}
      {/* AI CROP HEALTH SCANNER */}
      {/* ========================================================= */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-800 p-8 sm:p-12 shadow-xl">

          {/* Decorative background */}
          <div
            className="absolute inset-0 opacity-20 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1800&q=80')",
            }}
          />

          <div className="absolute inset-0 bg-emerald-950/30" />

          <div className="relative grid lg:grid-cols-2 gap-10 items-center">

            {/* Left */}
            <div className="text-white">

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-emerald-200 text-xs font-semibold">
                <Bot className="w-4 h-4" />
                AI Crop Health Scanner
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold mt-5 leading-tight">
                Is your crop healthy?
              </h2>

              <p className="mt-4 text-white/80 leading-relaxed max-w-lg">
                Upload a clear photo of your crop leaf or plant. Agri Mitra
                can analyze the image for potential disease symptoms and
                provide crop-health insights.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-white/85">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  Upload crop or leaf image
                </div>

                <div className="flex items-center gap-3 text-sm text-white/85">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  AI-based visual analysis
                </div>

                <div className="flex items-center gap-3 text-sm text-white/85">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  Disease and health assessment
                </div>
              </div>
            </div>


            {/* Scanner Card */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-2xl">

              {!cropPreview ? (
                <label
                  htmlFor="crop-health-image"
                  className="group cursor-pointer border-2 border-dashed border-emerald-200 hover:border-emerald-500 rounded-2xl min-h-[300px] flex flex-col items-center justify-center text-center p-8 transition bg-emerald-50/50"
                >
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition">
                    <Upload className="w-7 h-7" />
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg">
                    Upload Crop Image
                  </h3>

                  <p className="text-sm text-slate-500 mt-2">
                    Drag your image here or click to browse
                  </p>

                  <p className="text-xs text-slate-400 mt-3">
                    JPG, PNG or WEBP • Maximum 5MB
                  </p>

                  <input
                    id="crop-health-image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </label>
              ) : (
                <div>

                  {/* Image Preview */}
                  <div className="relative rounded-2xl overflow-hidden bg-slate-100">
                    <img
                      src={cropPreview}
                      alt="Crop preview"
                      className="w-full h-72 object-cover"
                    />

                    <button
                      type="button"
                      onClick={removeCropImage}
                      className="absolute top-3 right-3 w-9 h-9 bg-black/60 hover:bg-black/75 text-white rounded-full flex items-center justify-center transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* File info */}
                  <div className="flex items-center gap-3 mt-4 p-3 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {cropImage?.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {cropImage
                          ? `${(cropImage.size / 1024 / 1024).toFixed(2)} MB`
                          : ''}
                      </p>
                    </div>
                  </div>

                  {/* Analyze */}
                  <button
                    type="button"
                    onClick={handleAnalyzeCrop}
                    disabled={analyzing}
                    className="w-full mt-4 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <ScanSearch className="w-5 h-5" />

                    {analyzing
                      ? 'Analyzing Crop...'
                      : 'Analyze Crop Health'}
                  </button>

                  {/* Result */}
                  {analysisResult && (
                    <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Leaf className="w-5 h-5 text-emerald-600 mt-0.5" />

                        <div>
                          <h4 className="font-bold text-emerald-900 text-sm">
                            AI Analysis
                          </h4>

                          <p className="text-sm text-emerald-800 mt-1 leading-relaxed">
                            {analysisResult}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>
        </div>
      </section>


      {/* ========================================================= */}
      {/* FEATURE HIGHLIGHTS */}
      {/* ========================================================= */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Intelligent Agriculture
          </span>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
            Everything You Need From Farm to Market
          </h2>

          <p className="text-slate-600 text-sm mt-2">
            AI intelligence, transparent trading, and smarter logistics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Price Prediction */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>

            <h3 className="font-bold text-lg text-slate-900 mb-2">
              AI Price Prediction
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed">
              XGBoost machine learning models analyze historical mandi prices,
              demand curves, and weather inputs to suggest optimal price
              windows.
            </p>
          </div>


          {/* Crop Health */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <h3 className="font-bold text-lg text-slate-900 mb-2">
              AI Crop Health
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed">
              Upload crop images and use computer vision to identify potential
              disease symptoms and crop-health issues.
            </p>
          </div>


          {/* Logistics */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 mb-4">
              <Truck className="w-6 h-6" />
            </div>

            <h3 className="font-bold text-lg text-slate-900 mb-2">
              Optimized Route Logistics
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed">
              Multi-stop driver dispatch, OSRM route optimization, and live
              Socket.IO position tracking for every produce delivery.
            </p>
          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* ROLE OVERVIEW */}
      {/* ========================================================= */}

      <section className="relative py-14 border-y border-slate-200 overflow-hidden">

        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=2200&q=85')",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              One Platform. Every Agricultural Stakeholder.
            </h2>

            <p className="text-slate-600 text-sm mt-2">
              Built around the complete farm-to-market ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Farmer */}
            <div className="bg-white/95 backdrop-blur-sm p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Farmer
              </span>

              <h4 className="font-bold text-slate-900 mt-1">
                Direct Market Access
              </h4>

              <ul className="mt-3 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Post crop listings
                </li>

                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  AI disease check
                </li>

                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Receive fair offers
                </li>
              </ul>
            </div>


            {/* Buyer */}
            <div className="bg-white/95 backdrop-blur-sm p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Wholesale Buyer
              </span>

              <h4 className="font-bold text-slate-900 mt-1">
                Verified Produce Sourcing
              </h4>

              <ul className="mt-3 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Requirement matching
                </li>

                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Razorpay test escrow
                </li>

                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Digital PDF invoices
                </li>
              </ul>
            </div>


            {/* FPO */}
            <div className="bg-white/95 backdrop-blur-sm p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                FPO Organization
              </span>

              <h4 className="font-bold text-slate-900 mt-1">
                Bulk Aggregation
              </h4>

              <ul className="mt-3 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Member quantity pooling
                </li>

                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Bulk contract listings
                </li>

                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Transparent sub-payouts
                </li>
              </ul>
            </div>


            {/* Logistics */}
            <div className="bg-white/95 backdrop-blur-sm p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Logistics Partner
              </span>

              <h4 className="font-bold text-slate-900 mt-1">
                Smart Freight Dispatch
              </h4>

              <ul className="mt-3 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Multi-stop pickup routes
                </li>

                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Socket.IO live location
                </li>

                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Instant delivery log
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================= */}
      {/* FINAL CTA */}
      {/* ========================================================= */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="rounded-3xl bg-emerald-600 p-8 sm:p-12 text-center text-white shadow-xl">

          <ShoppingBag className="w-10 h-10 mx-auto mb-4 text-emerald-200" />

          <h2 className="text-3xl font-extrabold">
            Ready to Build a Smarter Farm-to-Market Network?
          </h2>

          <p className="mt-3 text-emerald-100 max-w-2xl mx-auto">
            Join farmers, buyers, FPOs, and logistics partners on Agri Mitra.
          </p>

          <Link
            to="/register"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition shadow-md"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>

        </div>
      </section>

    </div>
  );
};