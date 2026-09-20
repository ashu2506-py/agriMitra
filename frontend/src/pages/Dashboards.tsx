
import React, { useEffect, useState } from 'react';
import {
  Users,
  Package,
  TrendingUp,
  X,
  Plus,
  Truck,
  MessageSquare,
  ShoppingCart,
  Warehouse,
  UserPlus,
  Layers,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';


type ModalType =
  | 'addFarmer'
  | 'sellingPool'
  | 'farmers'
  | 'aggregate'
  | 'buyers'
  | 'logistics'
  | 'inventory'
  | 'respond'
  | 'pool'
  | 'driver'
  | null;

interface AvailableFarmer {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  isVerified: boolean;
  farmerProfile?: {
    farmSizeAcres: number;
    district: string;
    state: string;
    pincode: string;
    cropsGrown: string;
  } | null;
}

interface FPOMember {
  id: string;
  landSizeAcres: number;
  joinedAt: string;
  farmerUser: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    isVerified: boolean;
    farmerProfile?: {
      farmSizeAcres: number;
      district: string;
      state: string;
      pincode: string;
      cropsGrown: string;
    } | null;
  };
}

export const FPODashboard: React.FC = () => {
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const user = useAuthStore((state) => state.user);
  const fpo = user?.fpoProfile;

  const [fpoMembers, setFpoMembers] = useState<FPOMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState('');
  const [availableFarmers, setAvailableFarmers] = useState<AvailableFarmer[]>([]);
  const [selectedFarmerId, setSelectedFarmerId] = useState('');
  const [landSizeAcres, setLandSizeAcres] = useState('');
  const [availableFarmersLoading, setAvailableFarmersLoading] = useState(false);
  const [addFarmerLoading, setAddFarmerLoading] = useState(false);
  const [addFarmerError, setAddFarmerError] = useState('');

  const fetchFPOMembers = async () => {
      if (!user || user.role !== 'FPO') {
        return;
      }

      try {
        setMembersLoading(true);
        setMembersError('');

        const response = await fetch('/api/fpo/members', {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || 'Failed to fetch FPO members'
          );
        }

        setFpoMembers(data?.data?.members || []);
      } catch (error) {
        console.error('FPO members fetch error:', error);

        setMembersError(
          error instanceof Error
            ? error.message
            : 'Failed to load FPO members'
        );
      } finally {
        setMembersLoading(false);
      }
  };

  const fetchAvailableFarmers = async () => {
    if (!user || user.role !== 'FPO') {
      return;
    }

    try {
      setAvailableFarmersLoading(true);

      const response = await fetch('/api/fpo/farmers', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || 'Failed to fetch available farmers'
        );
      }

      setAvailableFarmers(data?.data?.farmers || []);
    } catch (error) {
      console.error('Available farmers fetch error:', error);
    } finally {
      setAvailableFarmersLoading(false);
    }
  };

      useEffect(() => {
    fetchFPOMembers();
  }, [user]);

  const handleAddFarmer = async () => {
    if (!selectedFarmerId) {
      setAddFarmerError('Please select a farmer');
      return;
    }

    const parsedLandSize = Number(landSizeAcres);

    if (!landSizeAcres || Number.isNaN(parsedLandSize) || parsedLandSize < 0) {
      setAddFarmerError('Please enter a valid land size');
      return;
    }

    try {
      setAddFarmerLoading(true);
      setAddFarmerError('');

      const response = await fetch('/api/fpo/members', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          farmerUserId: selectedFarmerId,
          landSizeAcres: parsedLandSize,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || 'Failed to add farmer to FPO'
        );
      }

      await fetchFPOMembers();
      await fetchAvailableFarmers();

      setSelectedFarmerId('');
      setLandSizeAcres('');
      closeModal();
    } catch (error) {
      console.error('Add farmer error:', error);
      setAddFarmerError(
        error instanceof Error
          ? error.message
          : 'Failed to add farmer to FPO'
      );
    } finally {
      setAddFarmerLoading(false);
    }
  };

  const openModal = (type: ModalType, item?: any) => {
    setSelectedItem(item || null);
    setModal(type);
  };

  const closeModal = () => {
    setModal(null);
    setSelectedItem(null);
  };

  const stats = [
    {
      label: 'Member Farmers',
      value: membersLoading ? '...' : String(fpoMembers.length),
      change: '+6 this month',
      icon: Users,
    },
    {
      label: 'Aggregated Produce',
      value: '2,400 Qtl',
      change: '+18.5% this month',
      icon: Package,
    },
    {
      label: 'Estimated Inventory',
      value: '₹58.4L',
      change: '+9.2% market value',
      icon: TrendingUp,
    },
  ];

  const cropInventory = [
    {
      crop: 'Wheat',
      farmers: 18,
      quantity: '920 Qtl',
      price: '₹2,480/Qtl',
      status: 'Ready to Sell',
      image:
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    },
    {
      crop: 'Rice',
      farmers: 11,
      quantity: '680 Qtl',
      price: '₹3,120/Qtl',
      status: 'Available',
      image:
        'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80',
    },
    {
      crop: 'Potato',
      farmers: 8,
      quantity: '460 Qtl',
      price: '₹1,850/Qtl',
      status: 'Available',
      image:
        'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    },
    {
      crop: 'Mustard',
      farmers: 5,
      quantity: '340 Qtl',
      price: '₹5,420/Qtl',
      status: 'Processing',
      image:
        'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const buyerRequests = [
    {
      buyer: 'Shakti Agro Foods',
      crop: 'Wheat',
      quantity: '500 Qtl',
      location: 'Kanpur, UP',
      offer: '₹2,560/Qtl',
      deadline: '2 days left',
    },
    {
      buyer: 'FreshFarm Retail',
      crop: 'Rice',
      quantity: '300 Qtl',
      location: 'Lucknow, UP',
      offer: '₹3,240/Qtl',
      deadline: '4 days left',
    },
    {
      buyer: 'National Grain Traders',
      crop: 'Potato',
      quantity: '250 Qtl',
      location: 'Delhi NCR',
      offer: '₹1,920/Qtl',
      deadline: '6 days left',
    },
  ];

  const activities = [
    {
      title: 'New farmer joined the FPO',
      detail: 'Rajesh Kumar added 12 Qtl of wheat',
      time: '25 min ago',
    },
    {
      title: 'Bulk inventory updated',
      detail: '80 Qtl of rice added to aggregation pool',
      time: '2 hrs ago',
    },
    {
      title: 'Buyer request received',
      detail: 'Shakti Agro Foods requested 500 Qtl wheat',
      time: '5 hrs ago',
    },
    {
      title: 'Pickup completed',
      detail: '45 Qtl collected from Sector 12 collection point',
      time: 'Yesterday',
    },
  ];

  const farmers = fpoMembers.map((member) => ({
    id: member.id,
    name: member.farmerUser.name,
    crop: member.farmerUser.farmerProfile?.cropsGrown || 'Crop not specified',
    quantity: `${member.landSizeAcres} acres`,
    status: member.farmerUser.isVerified ? 'Verified' : 'Active',
  }));

  const pools = [
    {
      crop: 'Wheat',
      quantity: '650 Qtl',
      farmers: 14,
      target: '₹2,550/Qtl',
      status: 'Negotiating',
    },
    {
      crop: 'Rice',
      quantity: '420 Qtl',
      farmers: 9,
      target: '₹3,200/Qtl',
      status: 'Open',
    },
    {
      crop: 'Potato',
      quantity: '280 Qtl',
      farmers: 6,
      target: '₹1,900/Qtl',
      status: 'Buyer Matched',
    },
  ];

  const pickups = [
    {
      farmer: 'Rajesh Kumar',
      crop: 'Wheat',
      quantity: '25 Qtl',
      location: 'Naini Collection Center',
      time: 'Today • 11:30 AM',
    },
    {
      farmer: 'Suresh Patel',
      crop: 'Rice',
      quantity: '40 Qtl',
      location: 'Phaphamau Collection Center',
      time: 'Today • 3:00 PM',
    },
    {
      farmer: 'Amit Singh',
      crop: 'Potato',
      quantity: '32 Qtl',
      location: 'Jhunsi Collection Center',
      time: 'Tomorrow • 9:00 AM',
    },
  ];

  const ModalWrapper = ({
    title,
    subtitle,
    children,
  }: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
  }) => (
    <div
      className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={closeModal}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {title}
            </h2>

            {subtitle && (
              <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
            )}
          </div>

          <button
            onClick={closeModal}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );

  const Input = ({
    label,
    placeholder,
    type = 'text',
  }: {
    label: string;
    placeholder: string;
    type?: string;
  }) => (
    <div>
      <label className="block text-xs font-bold text-slate-600 mb-2">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-sm"
      />
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* BACKGROUND */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=2200&q=85')",
        }}
      />

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-950/30 via-white/70 to-white" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/90 backdrop-blur-xl shadow-xl">
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-emerald-200/30 blur-3xl" />

          <div className="relative p-7 lg:p-9">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                    FPO OPERATIONS
                  </span>

                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                    ✓ Verified Organization
                  </span>
                </div>

                <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
                  {fpo?.orgName || 'FPO Dashboard'}
                </h1>

                <p className="mt-2 text-sm text-slate-500 max-w-2xl">
                  Manage farmers, aggregate produce, connect with buyers and
                  coordinate collective selling.
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-5 text-sm text-slate-600">
                {(user?.fpoProfile?.district || user?.fpoProfile?.state) && (
                  <>
                    <span>
                      📍{' '}
                      {[user?.fpoProfile?.district, user?.fpoProfile?.state]
                        .filter(Boolean)
                        .join(', ')}
                    </span>

                    <span>•</span>
                  </>
                )}

                <span>
                  {membersLoading
                    ? 'Loading farmers...'
                    : `${fpoMembers.length} active farmers`}
                </span>

                <span>•</span>

                <span>2,400 Qtl inventory</span>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => openModal('addFarmer')}
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-lg transition"
                >
                  <UserPlus className="inline w-4 h-4 mr-2" />
                  Add Farmer
                </button>

                <button
                  onClick={() => openModal('sellingPool')}
                  className="px-5 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold shadow-sm transition"
                >
                  <Layers className="inline w-4 h-4 mr-2" />
                  Create Selling Pool
                </button>
              </div>
            </div>
          </div>
          </div>
        </section>

        {/* STATS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="bg-white/95 rounded-2xl border border-slate-200 shadow-sm p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">
                      {stat.label}
                    </p>

                    <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                      {stat.value}
                    </h2>

                    <p className="text-xs text-emerald-600 font-semibold mt-2">
                      {stat.change}
                    </p>
                  </div>

                  <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* QUICK ACTIONS */}
        <section className="bg-white/95 rounded-2xl border border-slate-200 shadow-sm p-6">
          <p className="text-xs font-bold text-emerald-700 uppercase">
            Operations
          </p>

          <h2 className="text-xl font-extrabold text-slate-900 mt-1 mb-5">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => openModal('farmers')}
              className="text-left p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition"
            >
              <Users className="w-7 h-7 text-emerald-600 mb-3" />
              <p className="text-sm font-bold">Manage Farmers</p>
              <p className="text-xs text-slate-500 mt-1">
                {membersLoading
                  ? 'Loading members...'
                  : `${fpoMembers.length} members →`}
              </p>
            </button>

            <button
              onClick={() => openModal('aggregate')}
              className="text-left p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition"
            >
              <Package className="w-7 h-7 text-emerald-600 mb-3" />
              <p className="text-sm font-bold">Aggregate Crop</p>
              <p className="text-xs text-slate-500 mt-1">
                Add produce →
              </p>
            </button>

            <button
              onClick={() => openModal('buyers')}
              className="text-left p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition"
            >
              <ShoppingCart className="w-7 h-7 text-emerald-600 mb-3" />
              <p className="text-sm font-bold">Buyer Requests</p>
              <p className="text-xs text-slate-500 mt-1">3 requests →</p>
            </button>

            <button
              onClick={() => openModal('logistics')}
              className="text-left p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition"
            >
              <Truck className="w-7 h-7 text-emerald-600 mb-3" />
              <p className="text-sm font-bold">Manage Pickups</p>
              <p className="text-xs text-slate-500 mt-1">3 upcoming →</p>
            </button>
          </div>
        </section>

        {/* INVENTORY */}
        <section className="bg-white/95 rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-bold text-emerald-700 uppercase">
                Aggregated Supply
              </p>

              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                Crop Inventory
              </h2>
            </div>

            <button
              onClick={() => openModal('inventory')}
              className="text-sm font-bold text-emerald-700 hover:text-emerald-800"
            >
              View All Inventory →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {cropInventory.map((crop) => (
              <div
                key={crop.crop}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="h-32 overflow-hidden">
                  <img
                    src={crop.image}
                    alt={crop.crop}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4">
                  <div className="flex justify-between gap-2">
                    <h3 className="font-extrabold text-slate-900">
                      {crop.crop}
                    </h3>

                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
                      {crop.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Farmers</span>
                      <span className="font-bold">{crop.farmers}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Quantity</span>
                      <span className="font-bold">{crop.quantity}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Price</span>
                      <span className="font-bold text-emerald-700">
                        {crop.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BUYER REQUESTS */}
        <section className="bg-white/95 rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs font-bold text-emerald-700 uppercase">
                Demand
              </p>

              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                Buyer Requests
              </h2>
            </div>

            <button
              onClick={() => openModal('buyers')}
              className="text-sm font-bold text-emerald-700"
            >
              View All →
            </button>
          </div>

          <div className="space-y-3">
            {buyerRequests.map((request) => (
              <div
                key={`${request.buyer}-${request.crop}`}
                className="border border-slate-200 rounded-xl p-4"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {request.buyer}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      {request.crop} • {request.quantity} • {request.location}
                    </p>
                  </div>

                  <div className="flex items-center gap-5">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">
                        Offer
                      </p>

                      <p className="font-extrabold text-emerald-700">
                        {request.offer}
                      </p>
                    </div>

                    <button
                      onClick={() => openModal('respond', request)}
                      className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                    >
                      Respond
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SELLING POOLS */}
        <section className="bg-white/95 rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-bold text-emerald-700 uppercase">
                Collective Selling
              </p>

              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                Active Selling Pools
              </h2>
            </div>

            <button
              onClick={() => openModal('sellingPool')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold"
            >
              + Create New Pool
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pools.map((pool) => (
              <div
                key={pool.crop}
                className="rounded-xl border border-slate-200 p-5"
              >
                <div className="flex justify-between">
                  <h3 className="font-extrabold">{pool.crop} Pool</h3>

                  <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                    {pool.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-slate-500">Quantity</p>
                    <p className="font-bold">{pool.quantity}</p>
                  </div>

                  <div>
                    <p className="text-slate-500">Farmers</p>
                    <p className="font-bold">{pool.farmers}</p>
                  </div>

                  <div>
                    <p className="text-slate-500">Target Price</p>
                    <p className="font-bold text-emerald-700">
                      {pool.target}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => openModal('pool', pool)}
                  className="w-full mt-5 py-2.5 rounded-lg border border-slate-200 text-xs font-bold hover:bg-slate-50"
                >
                  Manage Pool
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* LOGISTICS */}
        <section className="bg-white/95 rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs font-bold text-emerald-700 uppercase">
                Logistics
              </p>

              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                Upcoming Pickups
              </h2>
            </div>

            <button
              onClick={() => openModal('logistics')}
              className="text-sm font-bold text-emerald-700"
            >
              View Logistics →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pickups.map((pickup) => (
              <div
                key={`${pickup.farmer}-${pickup.crop}`}
                className="rounded-xl border border-slate-200 p-4"
              >
                <span className="text-xs font-bold text-emerald-700">
                  {pickup.crop}
                </span>

                <h3 className="font-bold text-slate-900 mt-2">
                  {pickup.farmer}
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  {pickup.quantity} • {pickup.location}
                </p>

                <p className="text-xs font-semibold text-slate-600 mt-2">
                  {pickup.time}
                </p>

                <button
                  onClick={() => openModal('driver', pickup)}
                  className="mt-4 text-xs font-bold text-emerald-700"
                >
                  Assign Driver →
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* MODALS */}

        {modal === 'addFarmer' && (
          <ModalWrapper
            title="Add Farmer"
            subtitle="Add an existing registered farmer to your FPO"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">
                  Select Farmer
                </label>

                <select
                  value={selectedFarmerId}
                  onChange={(e) => {
                    setSelectedFarmerId(e.target.value);
                    setAddFarmerError('');
                  }}
                  disabled={availableFarmersLoading || addFarmerLoading}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-sm disabled:bg-slate-50"
                >
                  <option value="">
                    {availableFarmersLoading
                      ? 'Loading farmers...'
                      : 'Choose a registered farmer'}
                  </option>

                  {availableFarmers.map((farmer) => (
                    <option key={farmer.id} value={farmer.id}>
                      {farmer.name} — {farmer.email}
                    </option>
                  ))}
                </select>
              </div>

              {availableFarmers.length === 0 && !availableFarmersLoading && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="text-sm font-bold text-amber-800">
                    No available farmers found
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    All registered farmers may already belong to an FPO.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">
                  Land Size in Acres
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={landSizeAcres}
                  onChange={(e) => {
                    setLandSizeAcres(e.target.value);
                    setAddFarmerError('');
                  }}
                  placeholder="e.g. 5"
                  disabled={addFarmerLoading}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-sm disabled:bg-slate-50"
                />
              </div>

              {addFarmerError && (
                <p className="text-sm text-red-600 font-medium">
                  {addFarmerError}
                </p>
              )}

              <button
                onClick={handleAddFarmer}
                disabled={addFarmerLoading || availableFarmersLoading || availableFarmers.length === 0}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold transition"
              >
                {addFarmerLoading ? 'Adding Farmer...' : 'Add Farmer'}
              </button>
            </div>
          </ModalWrapper>
        )}

        {modal === 'sellingPool' && (
          <ModalWrapper
            title="Create Selling Pool"
            subtitle="Combine farmer produce for collective selling"
          >
            <div className="space-y-4">
              <Input label="Crop" placeholder="e.g. Wheat" />
              <Input label="Target Quantity" placeholder="e.g. 500 Qtl" />
              <Input label="Target Price" placeholder="e.g. ₹2,550/Qtl" />

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">
                  Select Farmers
                </label>

                <div className="border border-slate-200 rounded-xl p-3 space-y-2">
                  {farmers.map((farmer) => (
                    <label
                      key={farmer.name}
                      className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg"
                    >
                      <input type="checkbox" />
                      <span className="text-sm">{farmer.name}</span>
                      <span className="ml-auto text-xs text-slate-500">
                        {farmer.quantity}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={closeModal}
                className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold"
              >
                Create Selling Pool
              </button>
            </div>
          </ModalWrapper>
        )}

        {modal === 'farmers' && (
          <ModalWrapper
            title="FPO Farmers"
            subtitle="Manage your registered farmer members"
          >
            <div className="space-y-3">
              {membersLoading ? (
                <div className="text-center py-8">
                  <p className="text-sm text-slate-500">
                    Loading FPO members...
                  </p>
                </div>
              ) : membersError ? (
                <div className="text-center py-8">
                  <p className="text-sm text-red-600">
                    {membersError}
                  </p>
                </div>
              ) : fpoMembers.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-slate-300 rounded-xl">
                  <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />

                  <p className="font-bold text-slate-700">
                    No farmers added yet
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Add farmers to start building your FPO network.
                  </p>

                  <button
                    onClick={() => openModal('addFarmer')}
                    className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                  >
                    <UserPlus className="inline w-4 h-4 mr-1" />
                    Add Farmer
                  </button>
                </div>
              ) : (
                fpoMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-emerald-600" />
                    </div>

                    <div className="flex-1">
                      <p className="font-bold text-slate-900">
                        {member.farmerUser.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {member.farmerUser.farmerProfile?.district ||
                          'Location not available'}
                        {' • '}
                        {member.landSizeAcres} acres
                      </p>
                    </div>

                    <span className="text-xs font-bold text-emerald-600">
                      {member.farmerUser.isVerified ? 'Verified' : 'Active'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </ModalWrapper>
        )}

        {modal === 'aggregate' && (
          <ModalWrapper
            title="Aggregate Crop"
            subtitle="Add farmer produce to the FPO inventory"
          >
            <div className="space-y-4">
              <Input label="Farmer" placeholder="Select farmer" />
              <Input label="Crop" placeholder="e.g. Wheat" />
              <Input label="Quantity" placeholder="Enter quantity in Qtl" />
              <Input label="Quality / Grade" placeholder="e.g. Grade A" />

              <button
                onClick={closeModal}
                className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold"
              >
                Add to Inventory
              </button>
            </div>
          </ModalWrapper>
        )}

        {modal === 'buyers' && (
          <ModalWrapper
            title="Buyer Requests"
            subtitle="Review current bulk purchase requirements"
          >
            <div className="space-y-3">
              {buyerRequests.map((request) => (
                <div
                  key={request.buyer}
                  className="border border-slate-200 rounded-xl p-4"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-bold">{request.buyer}</p>

                      <p className="text-xs text-slate-500 mt-1">
                        {request.crop} • {request.quantity}
                      </p>
                    </div>

                    <p className="font-bold text-emerald-700">
                      {request.offer}
                    </p>
                  </div>

                  <button
                    onClick={() => openModal('respond', request)}
                    className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                  >
                    Respond
                  </button>
                </div>
              ))}
            </div>
          </ModalWrapper>
        )}

        {modal === 'respond' && selectedItem && (
          <ModalWrapper
            title={`Respond to ${selectedItem.buyer}`}
            subtitle={`${selectedItem.crop} • ${selectedItem.quantity}`}
          >
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50">
                <p className="text-xs text-slate-500">Current buyer offer</p>
                <p className="text-xl font-extrabold text-emerald-700">
                  {selectedItem.offer}
                </p>
              </div>

              <Input
                label="Your Price"
                placeholder="Enter your proposed price"
              />

              <Input
                label="Message"
                placeholder="Write a message to the buyer"
              />

              <button
                onClick={closeModal}
                className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold"
              >
                Send Offer
              </button>
            </div>
          </ModalWrapper>
        )}

        {modal === 'inventory' && (
          <ModalWrapper
            title="Complete Inventory"
            subtitle="All aggregated crops currently managed by the FPO"
          >
            <div className="space-y-3">
              {cropInventory.map((crop) => (
                <div
                  key={crop.crop}
                  className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl"
                >
                  <img
                    src={crop.image}
                    alt={crop.crop}
                    className="w-16 h-16 rounded-xl object-cover"
                  />

                  <div className="flex-1">
                    <p className="font-bold">{crop.crop}</p>

                    <p className="text-xs text-slate-500">
                      {crop.farmers} farmers • {crop.quantity}
                    </p>
                  </div>

                  <p className="font-bold text-emerald-700">
                    {crop.price}
                  </p>
                </div>
              ))}
            </div>
          </ModalWrapper>
        )}

        {modal === 'pool' && selectedItem && (
          <ModalWrapper
            title={`${selectedItem.crop} Selling Pool`}
            subtitle="Manage collective selling"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50">
                <p className="text-xs text-slate-500">Quantity</p>
                <p className="font-extrabold mt-1">
                  {selectedItem.quantity}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50">
                <p className="text-xs text-slate-500">Farmers</p>
                <p className="font-extrabold mt-1">
                  {selectedItem.farmers}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50">
                <p className="text-xs text-slate-500">Target Price</p>
                <p className="font-extrabold text-emerald-700 mt-1">
                  {selectedItem.target}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50">
                <p className="text-xs text-slate-500">Status</p>
                <p className="font-extrabold mt-1">
                  {selectedItem.status}
                </p>
              </div>
            </div>

            <button
              onClick={closeModal}
              className="w-full mt-6 py-3 rounded-xl bg-emerald-600 text-white font-bold"
            >
              Close
            </button>
          </ModalWrapper>
        )}

        {modal === 'logistics' && (
          <ModalWrapper
            title="FPO Logistics"
            subtitle="Manage upcoming produce pickups"
          >
            <div className="space-y-3">
              {pickups.map((pickup) => (
                <div
                  key={pickup.farmer}
                  className="border border-slate-200 rounded-xl p-4"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-bold">{pickup.farmer}</p>

                      <p className="text-xs text-slate-500 mt-1">
                        {pickup.crop} • {pickup.quantity}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        {pickup.location}
                      </p>
                    </div>

                    <span className="text-xs font-bold text-emerald-700">
                      {pickup.time}
                    </span>
                  </div>

                  <button
                    onClick={() => openModal('driver', pickup)}
                    className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                  >
                    Assign Driver
                  </button>
                </div>
              ))}
            </div>
          </ModalWrapper>
        )}

        {modal === 'driver' && selectedItem && (
          <ModalWrapper
            title="Assign Driver"
            subtitle={`${selectedItem.crop} • ${selectedItem.quantity}`}
          >
            <div className="space-y-3">
              {['Ravi Sharma • UP-70-AB-1234', 'Amit Verma • UP-70-CD-4521'].map(
                (driver) => (
                  <button
                    key={driver}
                    onClick={closeModal}
                    className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-emerald-600" />

                      <div>
                        <p className="font-bold text-sm">{driver}</p>
                        <p className="text-xs text-slate-500">
                          Available for pickup
                        </p>
                      </div>
                    </div>
                  </button>
                )
              )}
            </div>
          </ModalWrapper>
        )}
      </div>
    </div>
  );
};
export const DriverDashboard: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const driver = user?.driverProfile;

  const [activeTrip, setActiveTrip] = useState<string | null>('TRIP-001');
  const [tripStatus, setTripStatus] = useState<'Assigned' | 'Accepted' | 'In Transit' | 'Delivered'>('Accepted');
  const [showAllTrips, setShowAllTrips] = useState(false);

  const trips = [
    {
      id: 'TRIP-001',
      crop: 'Wheat',
      quantity: '25 Qtl',
      farmer: 'Farmer Pickup',
      pickup: 'Collection Point',
      destination: 'FPO Warehouse',
      time: '11:30 AM',
      distance: '18 km',
      status: tripStatus,
    },
    {
      id: 'TRIP-002',
      crop: 'Rice',
      quantity: '40 Qtl',
      farmer: 'Farmer Pickup',
      pickup: 'Village Collection Center',
      destination: 'FPO Warehouse',
      time: '3:00 PM',
      distance: '24 km',
      status: 'Assigned',
    },
    {
      id: 'TRIP-003',
      crop: 'Potato',
      quantity: '32 Qtl',
      farmer: 'Warehouse Dispatch',
      pickup: 'FPO Warehouse',
      destination: 'Buyer Location',
      time: '5:30 PM',
      distance: '41 km',
      status: 'Assigned',
    },
    {
      id: 'TRIP-004',
      crop: 'Mustard',
      quantity: '18 Qtl',
      farmer: 'FPO Dispatch',
      pickup: 'FPO Warehouse',
      destination: 'Buyer Location',
      time: 'Tomorrow • 9:00 AM',
      distance: '32 km',
      status: 'Assigned',
    },
  ];

  const completedTrips = [
    { crop: 'Wheat', quantity: '22 Qtl', destination: 'FPO Warehouse', date: 'Today', status: 'Delivered' },
    { crop: 'Rice', quantity: '35 Qtl', destination: 'FPO Warehouse', date: 'Yesterday', status: 'Delivered' },
    { crop: 'Potato', quantity: '28 Qtl', destination: 'Buyer Location', date: '18 Sep', status: 'Delivered' },
  ];

  const currentTrip = trips.find((trip) => trip.id === activeTrip) || trips[0];

  const handleTripAction = () => {
    if (!activeTrip) return;

    if (tripStatus === 'Accepted') {
      setTripStatus('In Transit');
    } else if (tripStatus === 'In Transit') {
      setTripStatus('Delivered');
    }
  };

  const getActionLabel = () => {
    if (tripStatus === 'Accepted') return 'Start Trip';
    if (tripStatus === 'In Transit') return 'Mark Delivered';
    if (tripStatus === 'Delivered') return 'Trip Completed';
    return 'Accept Trip';
  };

  const visibleTrips = showAllTrips ? trips : trips.slice(0, 3);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=2200&q=85')",
        }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/35 via-slate-50/85 to-slate-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
        {/* DRIVER HEADER */}
        <section className="relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-xl border border-white/70 shadow-xl">
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-emerald-100 blur-3xl" />

          <div className="relative p-7 lg:p-9">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                    DRIVER OPERATIONS
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    Online
                  </span>
                </div>

                <h1 className="text-3xl font-extrabold text-slate-900">
                  Welcome, {user?.name || 'Driver'}
                </h1>

                <p className="text-sm text-slate-500 mt-2 max-w-2xl">
                  Manage your assigned produce pickups, deliveries and daily logistics from one place.
                </p>

                <div className="flex flex-wrap gap-3 mt-5 text-xs text-slate-600">
                  <span className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
                    🚚 {driver?.vehicleNumber || 'Vehicle not assigned'}
                  </span>
                  <span className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
                    {driver?.licenseNumber ? `License • ${driver.licenseNumber}` : 'License details unavailable'}
                  </span>
                  <span className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
                    🟢 Available for dispatch
                  </span>
                </div>
              </div>

              <div className="w-full lg:w-auto grid grid-cols-2 gap-3">
                <div className="min-w-32 rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Today's Trips</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">3</p>
                </div>
                <div className="min-w-32 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                  <p className="text-[10px] uppercase font-bold text-emerald-600">Completed</p>
                  <p className="text-2xl font-extrabold text-emerald-700 mt-1">2</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            ['Assigned', '3', 'Trips scheduled'],
            ['In Transit', tripStatus === 'In Transit' ? '1' : '0', 'Active delivery'],
            ['Completed', '2', 'Today'],
            ['Distance', '83 km', 'Scheduled today'],
          ].map(([label, value, helper]) => (
            <div key={label} className="bg-white/95 rounded-2xl border border-slate-200 shadow-sm p-5">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{label}</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-2">{value}</p>
              <p className="text-xs text-slate-500 mt-1">{helper}</p>
            </div>
          ))}
        </section>

        {/* CURRENT TRIP + ROUTE */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3 bg-white/95 rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-xs font-bold uppercase text-emerald-700">Current Assignment</p>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">Active Delivery</h2>
              </div>
              <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                {currentTrip.status}
              </span>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Produce</p>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{currentTrip.crop}</h3>
                  <p className="text-sm text-slate-500 mt-1">{currentTrip.quantity} • {currentTrip.distance}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl">
                  🌾
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="bg-white rounded-xl border border-slate-200 p-3">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Pickup</p>
                  <p className="text-sm font-bold text-slate-900 mt-1">{currentTrip.pickup}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-3">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Destination</p>
                  <p className="text-sm font-bold text-slate-900 mt-1">{currentTrip.destination}</p>
                </div>
              </div>

              <button
                onClick={handleTripAction}
                disabled={tripStatus === 'Delivered'}
                className="w-full mt-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-sm transition"
              >
                {getActionLabel()}
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white/95 rounded-2xl border border-slate-200 shadow-sm p-6">
            <p className="text-xs font-bold uppercase text-emerald-700">Route Overview</p>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">Today's Route</h2>

            <div className="mt-6 relative">
              <div className="absolute left-4 top-4 bottom-4 w-px bg-emerald-200" />

              <div className="relative flex gap-4 mb-7">
                <div className="w-8 h-8 rounded-full bg-emerald-100 border-4 border-white shadow-sm flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Pickup</p>
                  <p className="font-bold text-slate-900 mt-1">{currentTrip.pickup}</p>
                  <p className="text-xs text-slate-500 mt-1">{currentTrip.time}</p>
                </div>
              </div>

              <div className="relative flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 border-4 border-white shadow-sm flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Destination</p>
                  <p className="font-bold text-slate-900 mt-1">{currentTrip.destination}</p>
                  <p className="text-xs text-slate-500 mt-1">{currentTrip.distance} route</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert('Route view will be connected to live maps in the next step.')}
              className="w-full mt-6 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              View Route
            </button>
          </div>
        </section>

        {/* ASSIGNMENTS */}
        <section className="bg-white/95 rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs font-bold uppercase text-emerald-700">Dispatch Queue</p>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">Today's Assignments</h2>
            </div>

            <button
              onClick={() => setShowAllTrips((value) => !value)}
              className="text-sm font-bold text-emerald-700 hover:text-emerald-800"
            >
              {showAllTrips ? 'Show Less ↑' : 'View All →'}
            </button>
          </div>

          <div className="space-y-3">
            {visibleTrips.map((trip) => (
              <button
                key={trip.id}
                onClick={() => {
                  setActiveTrip(trip.id);
                  if (trip.id !== 'TRIP-001') {
                    setTripStatus(trip.status as 'Assigned' | 'Accepted' | 'In Transit' | 'Delivered');
                  }
                }}
                className={`w-full text-left rounded-xl border p-4 transition ${
                  activeTrip === trip.id
                    ? 'border-emerald-300 bg-emerald-50/60'
                    : 'border-slate-200 hover:border-emerald-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center text-xl">
                    🚚
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900">{trip.crop} • {trip.quantity}</h3>
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                        {trip.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {trip.pickup} → {trip.destination}
                    </p>
                  </div>

                  <div className="text-left lg:text-right">
                    <p className="text-xs font-bold text-slate-700">{trip.time}</p>
                    <p className="text-xs text-slate-400 mt-1">{trip.distance}</p>
                  </div>

                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                    trip.status === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-700'
                      : trip.status === 'In Transit'
                        ? 'bg-blue-100 text-blue-700'
                        : trip.status === 'Accepted'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                  }`}>
                    {trip.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* VEHICLE + HISTORY */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="bg-white/95 rounded-2xl border border-slate-200 shadow-sm p-6">
            <p className="text-xs font-bold uppercase text-emerald-700">Vehicle</p>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">Vehicle Status</h2>

            <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200 p-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl">
                  🚛
                </div>
                <div>
                  <p className="font-extrabold text-slate-900">
                    {driver?.vehicleNumber || 'Vehicle not assigned'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {driver?.vehicleType || 'Vehicle type unavailable'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="bg-white rounded-xl p-3 border border-slate-200">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Status</p>
                  <p className="text-sm font-bold text-emerald-700 mt-1">Operational</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-slate-200">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Driver</p>
                  <p className="text-sm font-bold text-slate-900 mt-1 truncate">{user?.name || 'Driver'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white/95 rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs font-bold uppercase text-emerald-700">Completed Deliveries</p>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">Delivery History</h2>
              </div>
              <span className="text-xs font-bold text-slate-400">Recent</span>
            </div>

            <div className="space-y-3">
              {completedTrips.map((trip) => (
                <div key={`${trip.crop}-${trip.date}`} className="flex items-center gap-4 p-4 rounded-xl border border-slate-200">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    ✓
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-slate-900">{trip.crop} • {trip.quantity}</p>
                    <p className="text-xs text-slate-500 mt-1">{trip.destination} • {trip.date}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700">Delivered</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
          Admin Supervision Panel
        </span>

        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          Platform Analytics & Moderation
        </h1>

        <p className="text-xs text-slate-500">
          System overview across farmers, buyers, orders, and shipments
        </p>
      </div>
    </div>
  );
};