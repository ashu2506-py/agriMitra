import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Filter,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Tag,
  X,
  Minus,
  Plus,
  ShoppingCart,
  CalendarDays,
  Package,
  TrendingUp,
  ArrowUpRight,
  Sprout,
} from 'lucide-react';

import { useAuthStore } from '../stores/authStore';

interface Crop {
  id: string;
  name: string;
  variety?: string | null;
  category: string;
}

interface Farmer {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
}

interface ListingImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
}

interface CropListing {
  id: string;
  quantity: number;
  availableQty: number;
  unit: string;
  grade: string;
  expectedPrice: number;
  minPrice: number;
  harvestDate: string;
  availabilityStart: string;
  availabilityEnd: string;
  location: string;
  district: string;
  state: string;
  description?: string | null;
  status: string;
  crop: Crop;
  farmer: Farmer;
  images: ListingImage[];
}

interface ListingsResponse {
  success: boolean;
  data?: {
    listings: CropListing[];
    pagination: {
      totalCount: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  message?: string;
}

export const BuyerMarketplace: React.FC = () => {
  const { user } = useAuthStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [listings, setListings] = useState<CropListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Selected listing for View & Buy modal
  const [selectedListing, setSelectedListing] =
    useState<CropListing | null>(null);

  // Quantity selected in modal
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch('/api/listings', {
          credentials: 'include',
        });

        const data: ListingsResponse = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || 'Failed to fetch marketplace listings'
          );
        }

        setListings(data.data?.listings || []);
      } catch (err) {
        console.error('Marketplace fetch error:', err);

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load marketplace listings'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const filteredListings = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return listings;
    }

    return listings.filter((listing) => {
      const searchableText = [
        listing.crop?.name,
        listing.crop?.variety,
        listing.district,
        listing.state,
        listing.location,
        listing.grade,
        listing.farmer?.name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(search);
    });
  }, [listings, searchTerm]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getListingImage = (listing: CropListing) => {
    const primaryImage = listing.images?.find(
      (image) => image.isPrimary
    );

    return (
      primaryImage?.imageUrl ||
      listing.images?.[0]?.imageUrl ||
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1000&q=85'
    );
  };

  const openBuyModal = (listing: CropListing) => {
    setSelectedListing(listing);
    setPurchaseQuantity(1);
  };

  const closeBuyModal = () => {
    setSelectedListing(null);
    setPurchaseQuantity(1);
  };

  const increaseQuantity = () => {
    if (!selectedListing) return;

    setPurchaseQuantity((current) =>
      Math.min(
        current + 1,
        Math.floor(selectedListing.availableQty)
      )
    );
  };

  const decreaseQuantity = () => {
    setPurchaseQuantity((current) => Math.max(1, current - 1));
  };

  const totalPrice = selectedListing
    ? purchaseQuantity * selectedListing.expectedPrice
    : 0;

  return (
    <>
      {/* ============================================================
          BUYER MARKETPLACE BACKGROUND
      ============================================================ */}

      <div className="relative min-h-screen overflow-hidden bg-[#f3f6f1]">

        <div
          className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=2400&q=90')",
          }}
        />

        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#102c20]/45 via-[#f3f6f1]/88 to-[#f3f6f1]" />

        {/* ============================================================
            MARKETPLACE CONTENT
        ============================================================ */}

        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

          {/* ============================================================
              BUYER COMMAND CENTER
          ============================================================ */}

          <section className="relative overflow-hidden rounded-[32px] bg-[#102b1f] text-white shadow-2xl shadow-emerald-950/20">

            <div
              className="absolute inset-0 bg-cover bg-center opacity-35"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=2200&q=90')",
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#071b12] via-[#102b1f]/90 to-[#102b1f]/40" />

            <div className="relative p-7 sm:p-9 lg:p-10">

              <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">

                {/* HERO CONTENT */}

                <div className="max-w-3xl">

                  <div className="flex flex-wrap items-center gap-2">

                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-200">
                      <Package className="w-3.5 h-3.5" />
                      Buyer Command Center
                    </span>

                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-bold text-white/70">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                      Marketplace Live
                    </span>

                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mt-5">
                    Source fresh produce
                    <br className="hidden sm:block" />
                    directly from farmers.
                  </h1>

                  <p className="text-sm sm:text-base text-white/55 leading-relaxed max-w-2xl mt-4">
                    Discover verified crops, compare available quantities and
                    source directly from producers across the marketplace.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-white/55">

                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-300" />
                      Direct farm sourcing
                    </span>

                    <span className="w-1 h-1 rounded-full bg-white/25" />

                    <span>
                      {loading
                        ? 'Loading marketplace...'
                        : `${filteredListings.length} listings available`}
                    </span>

                  </div>
                </div>

                {/* PROCUREMENT SNAPSHOT */}

                <div className="w-full xl:w-[310px] rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl p-5">

                  <div className="flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-[0.18em] font-extrabold text-emerald-200/60">
                      Procurement Snapshot
                    </p>

                    <TrendingUp className="w-4 h-4 text-emerald-300" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">

                    <div className="rounded-xl bg-white/10 p-3">
                      <p className="text-[10px] text-white/45">
                        Listings
                      </p>

                      <p className="text-xl font-black mt-1">
                        {loading ? '...' : listings.length}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/10 p-3">
                      <p className="text-[10px] text-white/45">
                        Search
                      </p>

                      <p className="text-xl font-black mt-1">
                        {searchTerm ? 'Active' : 'All'}
                      </p>
                    </div>

                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-[10px] text-white/40">
                      Source directly
                    </p>

                    <p className="text-xs font-bold text-white/75 mt-1">
                      Verified farmer listings
                    </p>
                  </div>
                </div>

              </div>

              {/* MARKETPLACE SEARCH */}

              <div className="mt-8 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl p-2">

                <div className="flex flex-col lg:flex-row gap-2">

                  <div className="relative flex-1">

                    <Search className="w-5 h-5 text-white/40 absolute left-4 top-3.5" />

                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search crops, farmers, districts, states or grades..."
                      className="w-full pl-12 pr-4 py-3 bg-white/95 text-slate-900 placeholder:text-slate-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    />

                  </div>

                  <button
                    type="button"
                    className="px-5 py-3 bg-emerald-400 hover:bg-emerald-300 text-[#092116] font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 transition"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                  </button>

                </div>

              </div>

            </div>
          </section>

          {/* ============================================================
              MARKETPLACE INTRO
          ============================================================ */}

          {!loading && !error && filteredListings.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-1">

              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />

                  <p className="text-[10px] uppercase tracking-[0.18em] font-extrabold text-emerald-700">
                    Fresh Marketplace
                  </p>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
                  Produce available now
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Source directly from farmers and compare listings.
                </p>
              </div>

              <div className="text-xs font-semibold text-slate-400">
                {filteredListings.length} result
                {filteredListings.length === 1 ? '' : 's'}
              </div>

            </div>
          )}

          {/* ============================================================
              LOADING
          ============================================================ */}

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-white/90 rounded-3xl border border-white/80 overflow-hidden animate-pulse"
                >
                  <div className="h-52 bg-slate-200" />

                  <div className="p-5 space-y-4">

                    <div className="h-4 bg-slate-200 rounded w-1/3" />

                    <div className="h-6 bg-slate-200 rounded w-2/3" />

                    <div className="h-4 bg-slate-200 rounded w-1/2" />

                    <div className="h-16 bg-slate-100 rounded-xl" />

                    <div className="h-10 bg-slate-200 rounded-xl" />

                  </div>
                </div>
              ))}

            </div>
          )}

          {/* ============================================================
              ERROR
          ============================================================ */}

          {!loading && error && (
            <div className="rounded-3xl bg-red-50/95 border border-red-200 p-8 text-center">

              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <X className="w-5 h-5" />
              </div>

              <p className="text-lg font-black text-red-800 mt-4">
                Unable to load marketplace
              </p>

              <p className="text-sm text-red-600 mt-1">
                {error}
              </p>

            </div>
          )}

          {/* ============================================================
              NO LISTINGS
          ============================================================ */}

          {!loading &&
            !error &&
            filteredListings.length === 0 && (
              <div className="bg-white/90 backdrop-blur rounded-3xl border border-white/80 p-14 text-center shadow-xl shadow-slate-900/5">

                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <Sprout className="w-7 h-7" />
                </div>

                <h3 className="font-black text-xl text-slate-900 mt-5">
                  No crops found
                </h3>

                <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                  {searchTerm
                    ? 'Try searching with another crop, district, farmer or grade.'
                    : 'There are currently no active crop listings.'}
                </p>

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="mt-5 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
                  >
                    Clear Search
                  </button>
                )}

              </div>
            )}

          {/* ============================================================
              LISTING CARDS
          ============================================================ */}

          {!loading &&
            !error &&
            filteredListings.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {filteredListings.map((listing) => {

                  const isOwnListing =
                    listing.farmer?.id === user?.id;

                  const availabilityPercentage =
                    Math.min(
                      100,
                      Math.max(
                        0,
                        (Number(listing.availableQty) /
                          Math.max(Number(listing.quantity), 1)) *
                          100
                      )
                    );

                  return (
                    <article
                      key={listing.id}
                      className="group bg-white/95 backdrop-blur rounded-3xl border border-white/80 overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-300 flex flex-col"
                    >

                      {/* ==================================================
                          PRODUCT IMAGE
                      =================================================== */}

                      <div className="h-52 bg-slate-100 relative overflow-hidden">

                        <img
                          src={getListingImage(listing)}
                          alt={listing.crop?.name || 'Crop'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                        {/* Grade */}

                        <span className="absolute top-3 left-3 bg-emerald-500 text-[#082016] text-[10px] font-extrabold px-2.5 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                          AI Grade {listing.grade}
                        </span>

                        {/* Own Listing */}

                        {isOwnListing && (
                          <span className="absolute top-3 right-3 bg-white/95 text-emerald-700 text-[10px] font-extrabold px-2.5 py-1.5 rounded-full shadow-lg border border-emerald-100">
                            Your Crop
                          </span>
                        )}

                        {/* Crop title over image */}

                        <div className="absolute bottom-4 left-4 right-4 text-white">

                          <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-white/60">
                            Fresh Produce
                          </p>

                          <h3 className="text-2xl font-black capitalize leading-tight mt-1">
                            {listing.crop?.name}
                          </h3>

                          {listing.crop?.variety && (
                            <p className="text-xs text-white/70 mt-0.5">
                              {listing.crop.variety}
                            </p>
                          )}

                        </div>
                      </div>

                      {/* ==================================================
                          PRODUCT CONTENT
                      =================================================== */}

                      <div className="p-5 flex-1 flex flex-col">

                        {/* Location */}

                        <div className="flex items-center justify-between gap-3 text-xs text-slate-500">

                          <span className="flex items-center gap-1.5 min-w-0">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />

                            <span className="truncate">
                              {listing.district}, {listing.state}
                            </span>
                          </span>

                          <span className="flex items-center gap-1 whitespace-nowrap">
                            <CalendarDays className="w-3.5 h-3.5" />
                            {formatDate(listing.harvestDate)}
                          </span>

                        </div>

                        {/* Farmer */}

                        <div className="mt-4 flex items-center gap-3">

                          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm">
                            {(listing.farmer?.name || 'F')
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                              Farmer
                            </p>

                            <p className="text-sm font-bold text-slate-800 truncate">
                              {listing.farmer?.name || 'Farmer'}
                            </p>
                          </div>

                          <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />

                        </div>

                        {/* Description */}

                        {listing.description && (
                          <p className="text-xs text-slate-500 mt-4 line-clamp-2 leading-relaxed">
                            {listing.description}
                          </p>
                        )}

                        {/* Quantity */}

                        <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-100 p-4">

                          <div className="flex items-center justify-between">

                            <div>
                              <p className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                                Available
                              </p>

                              <p className="text-lg font-black text-slate-900 mt-1">
                                {listing.availableQty}{' '}
                                <span className="text-xs font-bold text-slate-500">
                                  {listing.unit}
                                </span>
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                                Grade
                              </p>

                              <p className="text-sm font-black text-slate-900 mt-1">
                                {listing.grade}
                              </p>
                            </div>

                          </div>

                          {/* Availability bar */}

                          <div className="mt-3 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-emerald-500 transition-all"
                              style={{
                                width: `${availabilityPercentage}%`,
                              }}
                            />
                          </div>

                          <p className="text-[10px] text-slate-400 mt-1.5">
                            {Math.round(availabilityPercentage)}% of listed quantity available
                          </p>

                        </div>

                        {/* ==================================================
                            PRICE + VIEW & BUY
                        =================================================== */}

                        <div className="mt-auto pt-5">

                          <div className="flex items-end justify-between gap-4">

                            <div>
                              <p className="text-[9px] uppercase tracking-[0.14em] font-extrabold text-slate-400">
                                Target Price
                              </p>

                              <div className="flex items-baseline gap-1 mt-1">

                                <span className="text-2xl font-black text-emerald-700">
                                  ₹{listing.expectedPrice.toLocaleString('en-IN')}
                                </span>

                                <span className="text-xs font-semibold text-slate-400">
                                  / {listing.unit}
                                </span>

                              </div>
                            </div>

                            {/* VIEW & BUY ONLY FOR OTHER FARMERS */}

                            {!isOwnListing ? (
                              <button
                                type="button"
                                onClick={() => openBuyModal(listing)}
                                className="group/buy inline-flex items-center gap-2 px-4 py-3 bg-[#102b1f] hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition shadow-lg shadow-emerald-950/10"
                              >
                                View & Buy

                                <ArrowUpRight className="w-4 h-4 group-hover/buy:translate-x-0.5 group-hover/buy:-translate-y-0.5 transition-transform" />
                              </button>
                            ) : (
                              <span className="px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-100">
                                Your Listing
                              </span>
                            )}

                          </div>

                          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">

                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Verified Listing
                            </span>

                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Direct Farmer
                            </span>

                          </div>

                        </div>

                      </div>
                    </article>
                  );
                })}

              </div>
            )}

        </div>
      </div>

      {/* ============================================================
          VIEW & BUY MODAL
      ============================================================ */}

      {selectedListing && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-md flex items-center justify-center p-4"
          onClick={closeBuyModal}
        >

          <div
            className="bg-white w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-[30px] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >

            {/* ========================================================
                MODAL HEADER
            ========================================================= */}

            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-100 px-6 py-4 flex items-center justify-between">

              <div>

                <p className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-[0.18em]">
                  Direct Farm Purchase
                </p>

                <h2 className="text-xl font-black text-slate-900 mt-1">
                  Review Produce
                </h2>

              </div>

              <button
                type="button"
                onClick={closeBuyModal}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>

            </div>

            {/* ========================================================
                MODAL CONTENT
            ========================================================= */}

            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">

              {/* ======================================================
                  PRODUCT IMAGE
              ======================================================= */}

              <div className="relative min-h-[350px] lg:min-h-[650px] bg-slate-100">

                <img
                  src={getListingImage(selectedListing)}
                  alt={selectedListing.crop?.name || 'Crop'}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/10" />

                <div className="absolute top-5 left-5 flex flex-wrap gap-2">

                  <span className="bg-emerald-400 text-[#082016] text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
                    AI Grade {selectedListing.grade}
                  </span>

                  <span className="bg-white/90 text-emerald-700 text-[10px] font-extrabold px-3 py-1.5 rounded-full">
                    Verified
                  </span>

                </div>

                <div className="absolute bottom-6 left-6 right-6 text-white">

                  <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-white/60">
                    Fresh Produce
                  </p>

                  <h2 className="text-4xl font-black mt-1">
                    {selectedListing.crop?.name}
                  </h2>

                  {selectedListing.crop?.variety && (
                    <p className="text-sm text-white/75 mt-1">
                      {selectedListing.crop.variety}
                    </p>
                  )}

                </div>

              </div>

              {/* ======================================================
                  PRODUCT DETAILS
              ======================================================= */}

              <div className="p-6 md:p-8 space-y-6">

                {/* Product heading */}

                <div>

                  <div className="flex items-center gap-2 mb-3">

                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-3 py-1.5 rounded-full">
                      AI Grade {selectedListing.grade}
                    </span>

                    <span className="bg-blue-50 text-blue-700 text-[10px] font-extrabold px-3 py-1.5 rounded-full">
                      Verified Listing
                    </span>

                  </div>

                  <h2 className="text-3xl font-black text-slate-950">
                    {selectedListing.crop?.name}
                  </h2>

                  {selectedListing.crop?.variety && (
                    <p className="text-sm text-slate-500 mt-1">
                      Variety: {selectedListing.crop.variety}
                    </p>
                  )}

                </div>

                {/* ====================================================
                    FARMER
                ===================================================== */}

                <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4">

                  <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                      {(selectedListing.farmer?.name || 'F')
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>

                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
                        Seller
                      </p>

                      <p className="text-sm font-black text-slate-900 mt-0.5">
                        {selectedListing.farmer?.name || 'Farmer'}
                      </p>

                      <p className="text-xs text-slate-500 mt-0.5">
                        Direct Farmer
                      </p>

                    </div>

                    <CheckCircle2 className="w-5 h-5 text-emerald-600 ml-auto" />

                  </div>

                </div>

                {/* ====================================================
                    INFORMATION GRID
                ===================================================== */}

                <div className="grid grid-cols-2 gap-3">

                  <div className="border border-slate-200 rounded-2xl p-4">

                    <div className="flex items-center gap-2 text-slate-400 mb-2">

                      <Package className="w-4 h-4" />

                      <span className="text-[10px] font-extrabold uppercase tracking-wider">
                        Available
                      </span>

                    </div>

                    <p className="font-black text-slate-900">
                      {selectedListing.availableQty}{' '}
                      <span className="text-xs font-bold text-slate-500">
                        {selectedListing.unit}
                      </span>
                    </p>

                  </div>

                  <div className="border border-slate-200 rounded-2xl p-4">

                    <div className="flex items-center gap-2 text-slate-400 mb-2">

                      <MapPin className="w-4 h-4" />

                      <span className="text-[10px] font-extrabold uppercase tracking-wider">
                        Location
                      </span>

                    </div>

                    <p className="font-black text-slate-900 text-sm">
                      {selectedListing.district},{' '}
                      {selectedListing.state}
                    </p>

                  </div>

                  <div className="border border-slate-200 rounded-2xl p-4">

                    <div className="flex items-center gap-2 text-slate-400 mb-2">

                      <CalendarDays className="w-4 h-4" />

                      <span className="text-[10px] font-extrabold uppercase tracking-wider">
                        Harvest
                      </span>

                    </div>

                    <p className="font-black text-slate-900 text-sm">
                      {formatDate(selectedListing.harvestDate)}
                    </p>

                  </div>

                  <div className="border border-slate-200 rounded-2xl p-4">

                    <div className="flex items-center gap-2 text-slate-400 mb-2">

                      <Tag className="w-4 h-4" />

                      <span className="text-[10px] font-extrabold uppercase tracking-wider">
                        Grade
                      </span>

                    </div>

                    <p className="font-black text-slate-900">
                      {selectedListing.grade}
                    </p>

                  </div>

                </div>

                {/* ====================================================
                    DESCRIPTION
                ===================================================== */}

                {selectedListing.description && (
                  <div>

                    <h3 className="text-sm font-black text-slate-900 mb-2">
                      About this produce
                    </h3>

                    <p className="text-sm text-slate-500 leading-relaxed">
                      {selectedListing.description}
                    </p>

                  </div>
                )}

                {/* ====================================================
                    PRICE
                ===================================================== */}

                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">

                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.15em]">
                    Target Price
                  </p>

                  <div className="flex items-baseline gap-2 mt-1">

                    <span className="text-3xl font-black text-emerald-700">
                      ₹{selectedListing.expectedPrice.toLocaleString('en-IN')}
                    </span>

                    <span className="text-sm font-bold text-slate-500">
                      / {selectedListing.unit}
                    </span>

                  </div>

                  {selectedListing.minPrice > 0 && (
                    <p className="text-[11px] text-slate-400 mt-1">
                      Minimum listed price: ₹
                      {selectedListing.minPrice.toLocaleString('en-IN')}
                    </p>
                  )}

                </div>

                {/* ====================================================
                    QUANTITY SELECTOR
                ===================================================== */}

                <div>

                  <div className="flex items-center justify-between mb-2">

                    <label className="text-sm font-black text-slate-900">
                      Purchase Quantity
                    </label>

                    <span className="text-xs font-semibold text-slate-500">
                      Max {selectedListing.availableQty}{' '}
                      {selectedListing.unit}
                    </span>

                  </div>

                  <div className="flex items-center justify-between border border-slate-200 rounded-2xl p-2 bg-white">

                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={purchaseQuantity <= 1}
                      className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 flex items-center justify-center transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <div className="text-center">

                      <span className="text-xl font-black text-slate-900">
                        {purchaseQuantity}
                      </span>

                      <span className="text-xs font-semibold text-slate-500 ml-1">
                        {selectedListing.unit}
                      </span>

                    </div>

                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={
                        purchaseQuantity >=
                        Math.floor(selectedListing.availableQty)
                      }
                      className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 flex items-center justify-center transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                  </div>

                </div>

                {/* ====================================================
                    ESTIMATED TOTAL
                ===================================================== */}

                <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-5">

                  <div className="flex items-center justify-between gap-4">

                    <div>

                      <p className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-700">
                        Estimated Total
                      </p>

                      <p className="text-xs text-emerald-600 mt-1">
                        {purchaseQuantity}{' '}
                        {selectedListing.unit} × ₹
                        {selectedListing.expectedPrice.toLocaleString(
                          'en-IN'
                        )}
                      </p>

                    </div>

                    <p className="text-2xl font-black text-emerald-700">
                      ₹{totalPrice.toLocaleString('en-IN')}
                    </p>

                  </div>

                </div>

                {/* ====================================================
                    BUY BUTTON
                ===================================================== */}

                <button
                  type="button"
                  onClick={() => {
                    alert(
                      'Order placement and payment will be connected in the next step.'
                    );
                  }}
                  className="w-full py-4 bg-[#102b1f] hover:bg-emerald-700 text-white font-black rounded-2xl transition flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/10"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Buy Now
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-slate-400 text-center">
                  Order placement and payment will be connected in the next step.
                </p>

              </div>

            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default BuyerMarketplace;