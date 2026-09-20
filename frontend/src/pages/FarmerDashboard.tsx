import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Plus,
  Sprout,
  TrendingUp,
  ShieldCheck,
  Package,
  X,
  MapPin,
  CalendarDays,
  RefreshCw,
  ImagePlus,
  BarChart3,
  CloudSun,
  Activity,
  Leaf,
  Upload,
  ArrowRight,
} from 'lucide-react';

import { useAuthStore } from '../stores/authStore';

interface CropListing {
  id: string;
  quantity: number;
  availableQty: number;
  unit: string;
  grade: string;
  expectedPrice: number;
  minPrice: number;
  harvestDate: string;
  availabilityStart?: string;
  availabilityEnd: string;
  location: string;
  district: string;
  state: string;
  latitude?: number | null;
  longitude?: number | null;
  description?: string | null;
  status: string;
  createdAt?: string;

  crop?: {
    id: string;
    name: string;
    variety?: string | null;
    category?: string;
  };

  images?: {
    id: string;
    imageUrl: string;
    isPrimary: boolean;
  }[];

  healthAnalysis?: unknown[];
  qualityAssessments?: unknown[];
}

export const FarmerDashboard: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  const [showAddModal, setShowAddModal] = useState(false);

  const [listings, setListings] = useState<CropListing[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);
  const [listingError, setListingError] = useState('');

  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  // =========================================================
  // FORM STATE
  // =========================================================

  const [cropName, setCropName] = useState('');
  const [variety, setVariety] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [harvestDate, setHarvestDate] = useState('');
  const [availabilityEnd, setAvailabilityEnd] = useState('');
  const [grade, setGrade] = useState('A');
  const [description, setDescription] = useState('');

  // =========================================================
  // IMAGE STATE
  // =========================================================

  const [cropImages, setCropImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const aiImageInputRef = useRef<HTMLInputElement>(null);
  const [aiImagePreview, setAiImagePreview] = useState('');
  const [aiImageName, setAiImageName] = useState('');
  const [aiMessage, setAiMessage] = useState('');

  // Temporary demo AI health score until the real crop-health API is connected.
  const [aiHealthScore, setAiHealthScore] = useState<number | null>(null);

  // Current weather for the farmer's listing location.
  const [weather, setWeather] = useState<{
    temperature: number;
    humidity: number;
    apparentTemperature: number;
    weatherCode: number;
  } | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const handleAiImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setAiMessage('Please choose a JPG, PNG or WEBP image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAiMessage('The crop image must be smaller than 5 MB.');
      return;
    }

    if (aiImagePreview) URL.revokeObjectURL(aiImagePreview);
    setAiImagePreview(URL.createObjectURL(file));
    setAiImageName(file.name);
    setAiMessage('Image selected. Connect the crop-health API here to receive the AI diagnosis.');
  };

  // =========================================================
  // FETCH MY LISTINGS
  // =========================================================

  const fetchMyListings = useCallback(async () => {
    setIsLoadingListings(true);
    setListingError('');

    try {
      const response = await fetch('/api/listings/my', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error?.message ||
            data?.data?.message ||
            'Failed to load your listings'
        );
      }

      const fetchedListings =
        data?.data?.listings ||
        data?.listings ||
        [];

      setListings(
        Array.isArray(fetchedListings)
          ? fetchedListings
          : []
      );
    } catch (error) {
      console.error(
        'Failed to fetch farmer listings:',
        error
      );

      setListingError(
        error instanceof Error
          ? error.message
          : 'Failed to load your listings'
      );
    } finally {
      setIsLoadingListings(false);
    }
  }, []);

  // =========================================================
  // FETCH CURRENT WEATHER
  // =========================================================

  const fetchWeather = useCallback(async () => {
    const listingWithLocation = listings.find(
      (listing) =>
        listing.latitude != null &&
        listing.longitude != null
    );

    if (!listingWithLocation) {
      setWeather(null);
      return;
    }

    try {
      setWeatherLoading(true);

      const params = new URLSearchParams({
        latitude: String(listingWithLocation.latitude),
        longitude: String(listingWithLocation.longitude),
        current:
          'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code',
        timezone: 'auto',
      });

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch weather');
      }

      const data = await response.json();

      if (!data?.current) {
        throw new Error('Weather data is unavailable');
      }

      setWeather({
        temperature: Number(data.current.temperature_2m),
        humidity: Number(data.current.relative_humidity_2m),
        apparentTemperature: Number(data.current.apparent_temperature),
        weatherCode: Number(data.current.weather_code),
      });
    } catch (error) {
      console.error('Weather fetch error:', error);
      setWeather(null);
    } finally {
      setWeatherLoading(false);
    }
  }, [listings]);

  // =========================================================
  // LOAD LISTINGS WHEN DASHBOARD OPENS
  // =========================================================

  useEffect(() => {
    fetchMyListings();
  }, [fetchMyListings]);

  useEffect(() => {
    if (!isLoadingListings && listings.length > 0) {
      fetchWeather();
    }
  }, [isLoadingListings, listings, fetchWeather]);

  // Temporary demo score. This runs once per dashboard mount.
  useEffect(() => {
    setAiHealthScore(Math.floor(Math.random() * 21) + 70);
  }, []);

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setCropName('');
    setVariety('');
    setQuantity('');
    setUnit('kg');
    setExpectedPrice('');
    setMinPrice('');
    setHarvestDate('');
    setAvailabilityEnd('');
    setGrade('A');
    setDescription('');

    setCropImages([]);
    setImagePreviews([]);

    setCreateError('');

    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  // =========================================================
  // IMAGE SELECTION
  // =========================================================

  const handleImageSelection = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) {
      return;
    }

    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];

    const invalidFiles = files.filter(
      (file) => !allowedTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      setCreateError(
        'Only JPG, JPEG, PNG and WEBP images are allowed.'
      );

      return;
    }

    const oversizedFiles = files.filter(
      (file) => file.size > 5 * 1024 * 1024
    );

    if (oversizedFiles.length > 0) {
      setCreateError(
        'Each image must be smaller than 5 MB.'
      );

      return;
    }

    const limitedFiles = files.slice(0, 5);

    setCreateError('');

    setCropImages(limitedFiles);

    // Revoke old preview URLs before creating new ones
    imagePreviews.forEach((preview) => {
      URL.revokeObjectURL(preview);
    });

    const previews = limitedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setImagePreviews(previews);
  };

  // =========================================================
  // REMOVE IMAGE
  // =========================================================

  const removeImage = (index: number) => {
    const updatedImages = cropImages.filter(
      (_, imageIndex) => imageIndex !== index
    );

    const updatedPreviews = imagePreviews.filter(
      (_, imageIndex) => imageIndex !== index
    );

    if (imagePreviews[index]) {
      URL.revokeObjectURL(imagePreviews[index]);
    }

    setCropImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  // =========================================================
  // CREATE LISTING
  // =========================================================

  const handleCreateListing = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setCreateError('');
    setIsCreating(true);

    try {
      // -----------------------------------------------------
      // VALIDATION
      // -----------------------------------------------------

      if (!cropName.trim()) {
        throw new Error('Crop name is required');
      }

      if (!quantity || Number(quantity) <= 0) {
        throw new Error(
          'Quantity must be greater than 0'
        );
      }

      if (
        !expectedPrice ||
        Number(expectedPrice) <= 0
      ) {
        throw new Error(
          'Expected price must be greater than 0'
        );
      }

      if (!minPrice || Number(minPrice) <= 0) {
        throw new Error(
          'Minimum price must be greater than 0'
        );
      }

      if (!harvestDate) {
        throw new Error(
          'Harvest date is required'
        );
      }

      if (!availabilityEnd) {
        throw new Error(
          'Availability end date is required'
        );
      }

      if (
        new Date(availabilityEnd) <
        new Date(harvestDate)
      ) {
        throw new Error(
          'Availability end date cannot be before harvest date'
        );
      }

      // -----------------------------------------------------
      // UPLOAD IMAGES
      // -----------------------------------------------------

      const uploadedImageUrls: string[] = [];

      for (const image of cropImages) {
        const formData = new FormData();

        formData.append('image', image);

        const uploadResponse = await fetch(
          '/api/uploads/image',
          {
            method: 'POST',
            credentials: 'include',
            body: formData,
          }
        );

        const uploadData =
          await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(
            uploadData?.message ||
              uploadData?.error?.message ||
              'Failed to upload crop image'
          );
        }

        const imageUrl =
          uploadData?.data?.imageUrl ||
          uploadData?.imageUrl;

        if (!imageUrl) {
          throw new Error(
            'Image uploaded but no image URL was returned'
          );
        }

        uploadedImageUrls.push(imageUrl);
      }

      // -----------------------------------------------------
      // CREATE LISTING
      // -----------------------------------------------------

      const response = await fetch(
        '/api/listings',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          credentials: 'include',

          body: JSON.stringify({
            cropName: cropName.trim(),

            variety:
              variety.trim() || undefined,

            quantity: Number(quantity),

            unit,

            grade,

            expectedPrice:
              Number(expectedPrice),

            minPrice:
              Number(minPrice),

            harvestDate: new Date(
              `${harvestDate}T00:00:00.000Z`
            ).toISOString(),

            availabilityEnd: new Date(
              `${availabilityEnd}T23:59:59.000Z`
            ).toISOString(),

            description:
              description.trim() || undefined,

            // Uploaded Cloudinary URLs
            images: uploadedImageUrls,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error?.message ||
            data?.data?.message ||
            'Failed to create crop listing'
        );
      }

      // -----------------------------------------------------
      // CLOSE MODAL
      // -----------------------------------------------------

      setShowAddModal(false);

      // -----------------------------------------------------
      // RESET FORM
      // -----------------------------------------------------

      resetForm();

      // -----------------------------------------------------
      // RELOAD LISTINGS
      // -----------------------------------------------------

      await fetchMyListings();

      alert(
        'Crop listing created successfully!'
      );
    } catch (error) {
      console.error(
        'Create listing error:',
        error
      );

      setCreateError(
        error instanceof Error
          ? error.message
          : 'Failed to create crop listing'
      );
    } finally {
      setIsCreating(false);
    }
  };

  // =========================================================
  // ACTIVE LISTINGS
  // =========================================================

  const activeListings = listings.filter(
    (listing) =>
      listing.status === 'ACTIVE' &&
      Number(listing.availableQty) > 0
  );

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date: string) => {
    if (!date) return '--';

    return new Date(date).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    );
  };

  // =========================================================
  // FORMAT CURRENCY
  // =========================================================

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(price);
  };

  // =========================================================
  // FORMAT UNIT
  // =========================================================

  const formatUnit = (value: string) => {
    switch (value.toLowerCase()) {
      case 'kg':
        return 'kg';

      case 'quintal':
        return 'quintal';

      case 'ton':
        return 'ton';

      default:
        return value;
    }
  };

  // Resolve image URLs from the listing payload.
  // Supports the current Cloudinary shape plus common backend variants.
  const getListingImageUrl = (listing: CropListing) => {
    const images = Array.isArray(listing.images) ? listing.images : [];

    const primary = images.find((image) => image?.isPrimary);
    const candidate = primary || images[0];

    const url =
      candidate?.imageUrl ||
      (candidate as any)?.url ||
      (candidate as any)?.secure_url ||
      (listing as any)?.imageUrl ||
      (listing as any)?.image ||
      '';

    return typeof url === 'string' && url.trim() ? url.trim() : '';
  };

  const handleListingImageError = (
    event: React.SyntheticEvent<HTMLImageElement>
  ) => {
    event.currentTarget.style.display = 'none';
    const fallback = event.currentTarget.parentElement?.querySelector(
      '[data-image-fallback="true"]'
    ) as HTMLElement | null;
    if (fallback) fallback.style.display = 'flex';
  };

  const getMarketStats = () => {
    const active = activeListings.filter(
      (listing) => Number(listing.expectedPrice) > 0
    );

    if (!active.length) {
      return {
        crop: '--',
        averagePrice: null as number | null,
        lowestPrice: null as number | null,
        highestPrice: null as number | null,
        totalAvailable: 0,
        priceFlexibility: null as number | null,
      };
    }

    const prices = active.map((listing) => Number(listing.expectedPrice));
    const averagePrice =
      prices.reduce((sum, price) => sum + price, 0) / prices.length;

    const flexibilityValues = active
      .filter((listing) => Number(listing.minPrice) > 0)
      .map(
        (listing) =>
          ((Number(listing.expectedPrice) - Number(listing.minPrice)) /
            Number(listing.expectedPrice)) *
          100
      );

    const priceFlexibility = flexibilityValues.length
      ? flexibilityValues.reduce((sum, value) => sum + value, 0) /
        flexibilityValues.length
      : null;

    return {
      crop: active[0].crop?.name || 'Listed produce',
      averagePrice,
      lowestPrice: Math.min(...prices),
      highestPrice: Math.max(...prices),
      totalAvailable: active.reduce(
        (sum, listing) => sum + Number(listing.availableQty || 0),
        0
      ),
      priceFlexibility,
    };
  };

  const getWeatherDescription = (code: number) => {
    if (code === 0) return 'Clear sky';
    if ([1, 2, 3].includes(code)) return 'Partly cloudy';
    if ([45, 48].includes(code)) return 'Foggy';
    if ([51, 53, 55].includes(code)) return 'Drizzle';
    if ([61, 63, 65].includes(code)) return 'Rain';
    if ([71, 73, 75].includes(code)) return 'Snow';
    if ([80, 81, 82].includes(code)) return 'Rain showers';
    if ([95, 96, 99].includes(code)) return 'Thunderstorm';
    return 'Weather unavailable';
  };

  const getWeatherIcon = (code: number) => {
    if (code === 0) return '☀️';
    if ([1, 2, 3].includes(code)) return '⛅';
    if ([45, 48].includes(code)) return '🌫️';
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return '🌧️';
    if ([95, 96, 99].includes(code)) return '⛈️';
    return '🌤️';
  };

  const getHealthLabel = (score: number | null) => {
    if (score == null) return 'Awaiting analysis';
    if (score >= 85) return 'Excellent crop health';
    if (score >= 75) return 'Good crop health';
    return 'Needs attention';
  };

  // =========================================================
  // UI
  // =========================================================

  const inventoryValue = activeListings.reduce(
    (total, listing) =>
      total + Number(listing.expectedPrice || 0) * Number(listing.availableQty || 0),
    0
  );

  const marketStats = getMarketStats();

  const heroLocation =
    activeListings[0]
      ? `${activeListings[0].district}, ${activeListings[0].state}`
      : '--';

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <div className="min-h-screen bg-[#f6f8f2] text-slate-900">
      <div className="border-b border-[#dfe7d8] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 leading-none">Agri Mitra</p>
              <p className="text-[11px] text-slate-500 mt-1">Farmer Dashboard</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4 text-emerald-600" />{heroLocation}</span>
            <button onClick={fetchMyListings} disabled={isLoadingListings} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-60">
              <RefreshCw className={`w-4 h-4 ${isLoadingListings ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6">
        <section className="relative overflow-hidden rounded-3xl bg-emerald-800 min-h-[300px] flex items-end">
          <img
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1800&q=85"
            alt="Agricultural field"
            className="absolute inset-0 w-full h-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/65 to-emerald-800/20" />
          <div className="relative w-full p-6 sm:p-8 lg:p-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white text-xs font-bold border border-white/20">
                <Leaf className="w-3.5 h-3.5" /> Farmer Command Center
              </div>
              <div className="flex items-center gap-4 mt-5">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-xl font-black text-emerald-800 shadow-lg">
                  {(user?.name || 'F').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Good morning, {user?.name || 'Farmer'} 👋</h1>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-white/80">
                    <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4" />{heroLocation}</span>
                    <span className="inline-flex items-center gap-1.5"><Sprout className="w-4 h-4" />{activeListings.length ? 'Crops actively listed' : 'Ready to start selling'}</span>
                  </div>
                </div>
              </div>
              <p className="mt-5 max-w-2xl text-sm sm:text-base leading-relaxed text-white/80">Manage your produce, track your inventory and access agricultural tools from one simple workspace.</p>
              <div className="flex flex-wrap gap-3 mt-6">
                <button onClick={() => { resetForm(); setShowAddModal(true); }} className="inline-flex items-center gap-2 px-5 py-3 bg-white text-emerald-800 rounded-xl font-extrabold hover:bg-emerald-50 transition shadow-lg">
                  <Plus className="w-5 h-5" /> Create Listing
                </button>
                <button onClick={() => scrollToSection('crop-health')} className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 border border-white/30 text-white rounded-xl font-bold hover:bg-white/20 transition">
                  <ShieldCheck className="w-5 h-5" /> Crop Health
                </button>
              </div>
            </div>
            <div className="absolute right-6 top-6 hidden md:block rounded-2xl bg-white/95 px-4 py-3 shadow-lg min-w-[190px]">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <CloudSun className="w-4 h-4 text-emerald-600" />
                Current Weather
              </div>

              {weatherLoading ? (
                <div className="mt-2">
                  <p className="text-sm font-bold text-slate-700">Loading weather...</p>
                  <p className="text-[11px] text-slate-500">Checking farm location</p>
                </div>
              ) : weather ? (
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-3xl leading-none">{getWeatherIcon(weather.weatherCode)}</span>
                  <div>
                    <p className="text-2xl font-black text-slate-900 leading-none">
                      {Math.round(weather.temperature)}°C
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {getWeatherDescription(weather.weatherCode)} · {weather.humidity}% humidity
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-2">
                  <p className="text-sm font-bold text-slate-700">Weather unavailable</p>
                  <p className="text-[11px] text-slate-500">No farm coordinates available</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: 'Active Crops', value: isLoadingListings ? '...' : String(activeListings.length), note: activeListings.length === 1 ? 'active listing' : 'active listings', icon: Sprout, tone: 'emerald' },
            { label: 'Inventory Value', value: isLoadingListings ? '...' : inventoryValue > 0 ? formatPrice(inventoryValue) : '₹--', note: 'available quantity × expected price', icon: Package, tone: 'amber' },
            {
              label: 'Price Trend',
              value:
                marketStats.priceFlexibility != null
                  ? `${marketStats.priceFlexibility >= 0 ? '+' : ''}${marketStats.priceFlexibility.toFixed(1)}%`
                  : '--',
              note:
                marketStats.priceFlexibility != null
                  ? 'Expected price above minimum'
                  : 'Add priced listings to see trend',
              icon: TrendingUp,
              tone: 'blue',
            },
            {
              label: 'AI Crop Health',
              value: aiHealthScore != null ? String(aiHealthScore) : '--',
              note: aiHealthScore != null ? getHealthLabel(aiHealthScore) : 'Awaiting analysis',
              icon: ShieldCheck,
              tone: 'violet',
            },
          ].map((item) => {
            const Icon = item.icon;
            const tones: Record<string, string> = { emerald: 'bg-emerald-50 text-emerald-700', amber: 'bg-amber-50 text-amber-700', blue: 'bg-blue-50 text-blue-700', violet: 'bg-violet-50 text-violet-700' };
            return (
              <div key={item.label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wider text-slate-500">{item.label}</span><div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tones[item.tone]}`}><Icon className="w-5 h-5" /></div></div>
                <p className="text-2xl font-black text-slate-900 mt-4">{item.value}</p>
                <p className="text-xs text-slate-500 mt-1">{item.note}</p>
              </div>
            );
          })}
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="mb-4"><p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Shortcuts</p><h2 className="text-xl font-extrabold mt-1">Quick Actions</h2></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button onClick={() => { resetForm(); setShowAddModal(true); }} className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-left transition"><span className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center"><Plus className="w-5 h-5 text-emerald-700" /></span><span><b className="block text-sm">Create Listing</b><small className="text-xs text-slate-500">Add produce for buyers</small></span></button>
            <button onClick={() => scrollToSection('crop-health')} className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-left transition"><span className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-emerald-700" /></span><span><b className="block text-sm">Analyze Crop</b><small className="text-xs text-slate-500">Upload a crop image</small></span></button>
            <button onClick={() => scrollToSection('market-pulse')} className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-left transition"><span className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center"><BarChart3 className="w-5 h-5 text-emerald-700" /></span><span><b className="block text-sm">Market Intelligence</b><small className="text-xs text-slate-500">View available data</small></span></button>
            <button onClick={() => alert('AI Assistant is not connected yet. This button is ready for your assistant route.')} className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-left transition"><span className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-lg">🤖</span><span><b className="block text-sm">Ask AI Assistant</b><small className="text-xs text-slate-500">Open assistant</small></span></button>
          </div>
        </section>

        <section id="crop-portfolio" className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 scroll-mt-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-5"><div><p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Inventory</p><h2 className="text-xl font-extrabold mt-1">Your Crop Portfolio</h2></div><button onClick={fetchMyListings} disabled={isLoadingListings} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold hover:bg-slate-50 disabled:opacity-60"><RefreshCw className={`w-3.5 h-3.5 ${isLoadingListings ? 'animate-spin' : ''}`} /> Refresh</button></div>
            {isLoadingListings && <div className="py-14 text-center text-sm text-slate-500"><RefreshCw className="w-7 h-7 mx-auto mb-3 animate-spin text-emerald-600" />Loading your crops...</div>}
            {!isLoadingListings && listingError && <div className="p-5 rounded-xl border border-red-200 bg-red-50"><p className="text-sm font-semibold text-red-700">{listingError}</p><button onClick={fetchMyListings} className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold">Try Again</button></div>}
            {!isLoadingListings && !listingError && listings.length === 0 && <div className="border border-dashed border-slate-300 rounded-xl py-14 text-center"><Sprout className="w-9 h-9 text-slate-300 mx-auto mb-3" /><p className="font-bold text-slate-700">No crop listings yet</p><p className="text-xs text-slate-500 mt-1">Create your first listing to start selling.</p><button onClick={() => { resetForm(); setShowAddModal(true); }} className="mt-4 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-xs font-bold">Create Listing</button></div>}
            {!isLoadingListings && !listingError && listings.length > 0 && <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {listings.map((listing) => {
                const primaryImage = getListingImageUrl(listing);
                const available = Number(listing.availableQty || 0);
                const total = Number(listing.quantity || 0);
                const progress = total > 0 ? Math.max(0, Math.min(100, (available / total) * 100)) : 0;
                return <article key={listing.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white hover:shadow-md transition">
                  <div className="h-48 bg-slate-100 relative overflow-hidden">
                    {primaryImage ? (
                      <>
                        <img
                          src={primaryImage}
                          alt={listing.crop?.name || 'Crop'}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={handleListingImageError}
                        />
                        <div
                          data-image-fallback="true"
                          className="absolute inset-0 hidden items-center justify-center bg-emerald-50"
                        >
                          <div className="text-center">
                            <Sprout className="w-12 h-12 text-emerald-300 mx-auto" />
                            <p className="text-xs font-semibold text-emerald-700 mt-2">Crop image unavailable</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-emerald-50">
                        <div className="text-center">
                          <Sprout className="w-12 h-12 text-emerald-300 mx-auto" />
                          <p className="text-xs font-semibold text-emerald-700 mt-2">No crop image</p>
                        </div>
                      </div>
                    )}
                    <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${listing.status === 'ACTIVE' ? 'bg-white text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{listing.status}</span>
                  </div>
                  <div className="p-5"><div className="flex justify-between gap-3"><div><h3 className="text-lg font-extrabold">{listing.crop?.name || 'Unknown Crop'}</h3><p className="text-xs text-slate-500 mt-1">{listing.crop?.variety || 'Variety not specified'}</p></div><span className="text-xs font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg h-fit">Grade {listing.grade}</span></div>
                    <div className="flex items-end justify-between mt-5"><div><p className="text-xs text-slate-500">Expected price</p><p className="text-lg font-black text-emerald-700">{formatPrice(listing.expectedPrice)}</p></div><div className="text-right"><p className="text-xs text-slate-500">Available</p><p className="text-sm font-extrabold">{available} {formatUnit(listing.unit)}</p></div></div>
                    <div className="mt-4"><div className="flex justify-between text-[11px] text-slate-500 mb-1"><span>Availability</span><span>{Math.round(progress)}%</span></div><div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progress}%` }} /></div></div>
                    <div className="grid grid-cols-2 gap-3 mt-4"><div className="p-3 bg-slate-50 rounded-xl"><p className="text-[10px] uppercase font-bold text-slate-400">Harvest</p><p className="text-xs font-bold mt-1">{formatDate(listing.harvestDate)}</p></div><div className="p-3 bg-slate-50 rounded-xl"><p className="text-[10px] uppercase font-bold text-slate-400">Available until</p><p className="text-xs font-bold mt-1">{formatDate(listing.availabilityEnd)}</p></div></div>
                    <div className="flex items-start gap-2 mt-4 text-xs text-slate-600"><MapPin className="w-4 h-4 text-emerald-600 shrink-0" /><span>{listing.location} · {listing.district}, {listing.state}</span></div>
                  </div>
                </article>;
              })}
            </div>}
          </div>

          <aside id="market-pulse" className="scroll-mt-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit">
            <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Market</p><h2 className="text-xl font-extrabold mt-1">Market Pulse</h2></div><BarChart3 className="w-6 h-6 text-emerald-600" /></div>
            <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50/60 p-5">
              <p className="text-xs font-bold uppercase text-emerald-700">Your listing prices</p>
              <p className="text-xs text-slate-500 mt-1">Based on your active crop listings</p>
              <p className="text-3xl font-black mt-3 text-slate-900">
                {marketStats.averagePrice != null ? formatPrice(marketStats.averagePrice) : '₹--'}
              </p>
              <p className="text-xs text-slate-500 mt-1">Average expected price</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="border border-slate-200 rounded-xl p-4">
                <p className="text-[10px] uppercase font-bold text-slate-400">Price range</p>
                <p className="font-black mt-2 text-sm">
                  {marketStats.lowestPrice != null && marketStats.highestPrice != null
                    ? `${formatPrice(marketStats.lowestPrice)} – ${formatPrice(marketStats.highestPrice)}`
                    : '--'}
                </p>
              </div>
              <div className="border border-slate-200 rounded-xl p-4">
                <p className="text-[10px] uppercase font-bold text-slate-400">Available</p>
                <p className="font-black mt-2">{marketStats.totalAvailable || '--'}</p>
              </div>
            </div>
            <div className="mt-3 rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Price flexibility</p>
                  <p className="text-lg font-black mt-1">
                    {marketStats.priceFlexibility != null
                      ? `${marketStats.priceFlexibility.toFixed(1)}%`
                      : '--'}
                  </p>
                </div>
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Average gap between expected and minimum price</p>
            </div>
            <button onClick={() => { fetchMyListings(); document.getElementById('market-pulse')?.scrollIntoView({ behavior: 'smooth' }); }} className="w-full mt-5 py-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm font-bold hover:bg-emerald-100 transition">Refresh Market Data</button>
            <p className="text-xs text-slate-500 leading-relaxed mt-4">This section uses your real active listings for now. Live mandi/market prices will replace these values once the market-data API is connected.</p>
          </aside>
        </section>

        <section id="crop-health" className="scroll-mt-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-7 lg:items-center">
            <div className="flex-1"><p className="text-xs font-bold uppercase tracking-wider text-emerald-700">AI Crop Health</p><h2 className="text-2xl sm:text-3xl font-extrabold mt-2">Check a crop image before problems grow.</h2><p className="text-sm text-slate-500 max-w-2xl mt-3 leading-relaxed">Upload a crop image for analysis. The current score is a temporary demo value and will be replaced by the real crop-health API when connected.</p>
              <input ref={aiImageInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleAiImageSelection} className="hidden" />
              <div className="flex flex-wrap gap-3 mt-6"><button onClick={() => aiImageInputRef.current?.click()} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition"><Upload className="w-4 h-4" /> Upload Crop Image</button>{aiImagePreview && <button onClick={() => { setAiImagePreview(''); setAiImageName(''); setAiMessage(''); if (aiImageInputRef.current) aiImageInputRef.current.value = ''; }} className="px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold hover:bg-slate-50">Remove</button>}</div>
              {aiMessage && <p className="mt-3 text-xs text-slate-500">{aiMessage}</p>}
            </div>
            <div className="w-full lg:w-[310px]">{aiImagePreview ? <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50"><img src={aiImagePreview} alt="Selected crop" className="w-full h-52 object-cover" /><div className="p-4"><p className="text-sm font-bold truncate">{aiImageName}</p><p className="text-xs text-amber-700 mt-1">Demo score: {aiHealthScore ?? '--'} / 100 · Real analysis API pending</p></div></div> : <div className="h-52 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-center p-5"><ImagePlus className="w-9 h-9 text-emerald-600 mb-3" /><p className="text-sm font-bold text-slate-700">No crop image selected</p><p className="text-xs text-slate-500 mt-1">JPG, PNG or WEBP · max 5 MB</p>
                    <div className="mt-4 pt-4 border-t border-slate-200 w-full">
                      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Demo health score</p>
                      <p className="text-2xl font-black text-emerald-700 mt-1">{aiHealthScore ?? '--'}<span className="text-sm text-slate-400"> / 100</span></p>
                      <p className="text-[11px] text-slate-500 mt-1">{getHealthLabel(aiHealthScore)}</p>
                    </div>
                  </div>}</div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><Activity className="w-5 h-5 text-emerald-600" /></div><div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Timeline</p><h2 className="text-xl font-extrabold">Recent Activity</h2></div></div><div className="mt-5 space-y-4">{listings.length ? listings.slice(0, 4).map((listing) => <div key={listing.id} className="flex gap-3"><span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" /><div><p className="text-sm font-bold">{listing.crop?.name || 'Crop'} listing created</p><p className="text-xs text-slate-500 mt-1">{formatDate(listing.createdAt || '')} · {listing.status}</p></div></div>) : <p className="text-sm text-slate-500 py-5">No activity available yet.</p>}</div></div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><CalendarDays className="w-5 h-5 text-amber-600" /></div><div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Planning</p><h2 className="text-xl font-extrabold">Upcoming</h2></div></div><div className="mt-5 space-y-3">{listings.length ? [...listings].sort((a,b) => new Date(a.harvestDate).getTime() - new Date(b.harvestDate).getTime()).slice(0,3).map((listing) => <div key={listing.id} className="rounded-xl bg-slate-50 border border-slate-100 p-4 flex items-center justify-between gap-4"><div><p className="text-sm font-bold">{listing.crop?.name || 'Crop'} harvest</p><p className="text-xs text-slate-500 mt-1">Availability ends {formatDate(listing.availabilityEnd)}</p></div><span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg">{formatDate(listing.harvestDate)}</span></div>) : <p className="text-sm text-slate-500 py-5">No upcoming items available.</p>}</div></div>
        </section>
      </main>
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => {
            if (!isCreating) {
              setShowAddModal(false);
            }
          }}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Create Crop Listing
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Add details about the produce you want to sell.
                </p>
              </div>

              <button
                type="button"
                disabled={isCreating}
                onClick={() =>
                  setShowAddModal(false)
                }
                className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Create Error */}
            {createError && (
              <div className="mb-4 p-3 rounded-xl border border-red-200 bg-red-50">
                <p className="text-xs font-semibold text-red-700">
                  {createError}
                </p>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleCreateListing}
              className="space-y-4"
            >

              {/* Crop Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Crop Name
                </label>

                <input
                  type="text"
                  required
                  value={cropName}
                  onChange={(e) =>
                    setCropName(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Wheat"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Variety */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Variety
                </label>

                <input
                  type="text"
                  value={variety}
                  onChange={(e) =>
                    setVariety(
                      e.target.value
                    )
                  }
                  placeholder="e.g. HD-2967"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* =================================================
                  CROP IMAGES
              ================================================== */}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Crop Images
                </label>

                <div
                  onClick={() =>
                    imageInputRef.current?.click()
                  }
                  className="border-2 border-dashed border-slate-300 rounded-xl p-5 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/30 transition"
                >
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    onChange={
                      handleImageSelection
                    }
                    className="hidden"
                  />

                  <ImagePlus className="w-8 h-8 text-emerald-600 mx-auto mb-2" />

                  <div className="text-sm font-semibold text-slate-700">
                    Click to upload crop images
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1">
                    JPG, PNG or WEBP • Maximum 5 images • 5 MB each
                  </p>
                </div>

                {/* Image Previews */}
                {imagePreviews.length >
                  0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3">

                    {imagePreviews.map(
                      (
                        preview,
                        index
                      ) => (
                        <div
                          key={preview}
                          className="relative aspect-square rounded-lg overflow-hidden border border-slate-200"
                        >

                          <img
                            src={preview}
                            alt={`Crop preview ${
                              index + 1
                            }`}
                            className="w-full h-full object-cover"
                          />

                          {index ===
                            0 && (
                            <span className="absolute bottom-1 left-1 right-1 text-[9px] font-bold text-white bg-emerald-600/90 rounded px-1 py-0.5 text-center">
                              Primary
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              removeImage(
                                index
                              )
                            }
                            className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Quantity + Unit */}
              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quantity
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        e.target.value
                      )
                    }
                    placeholder="e.g. 500"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Unit
                  </label>

                  <select
                    value={unit}
                    onChange={(e) =>
                      setUnit(
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                  >
                    <option value="kg">
                      Kilograms
                    </option>

                    <option value="quintal">
                      Quintal
                    </option>

                    <option value="ton">
                      Ton
                    </option>
                  </select>
                </div>
              </div>

              {/* Expected + Minimum Price */}
              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Expected Price
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={expectedPrice}
                    onChange={(e) =>
                      setExpectedPrice(
                        e.target.value
                      )
                    }
                    placeholder="₹ per unit"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Minimum Price
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={minPrice}
                    onChange={(e) =>
                      setMinPrice(
                        e.target.value
                      )
                    }
                    placeholder="₹ minimum"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Grade */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quality Grade
                </label>

                <select
                  value={grade}
                  onChange={(e) =>
                    setGrade(
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                >
                  <option value="A+">
                    A+
                  </option>

                  <option value="A">
                    A
                  </option>

                  <option value="B">
                    B
                  </option>

                  <option value="C">
                    C
                  </option>
                </select>
              </div>

              {/* Harvest Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Expected Harvest Date
                </label>

                <input
                  type="date"
                  required
                  value={harvestDate}
                  onChange={(e) =>
                    setHarvestDate(
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Availability End */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Available Until
                </label>

                <input
                  type="date"
                  required
                  value={availabilityEnd}
                  onChange={(e) =>
                    setAvailabilityEnd(
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  rows={3}
                  placeholder="Add additional information about your crop..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  disabled={isCreating}
                  onClick={() =>
                    setShowAddModal(false)
                  }
                  className="flex-1 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >

                  {isCreating && (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  )}

                  {isCreating
                    ? 'Uploading & Creating...'
                    : 'Create Listing'}
                </button>

              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};