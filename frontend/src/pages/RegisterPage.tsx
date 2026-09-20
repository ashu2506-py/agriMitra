import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sprout,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Building2,
  Truck,
  Tractor,
} from 'lucide-react';
import { UserRole } from '../types';
import { useAuthStore } from '../stores/authStore';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const [role, setRole] = useState<UserRole>('FARMER');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');

  // Farmer
  const [farmSizeAcres, setFarmSizeAcres] = useState('');
  const [cropsGrown, setCropsGrown] = useState<string[]>([]);
  const [cropInput, setCropInput] = useState('');

  // Buyer
  const [companyName, setCompanyName] = useState('');
  const [buyerType, setBuyerType] = useState('RETAILER');
  const [gstNumber, setGstNumber] = useState('');

  // FPO
  const [orgName, setOrgName] = useState('');
  const [regNumber, setRegNumber] = useState('');

  // Driver
  const [licenseNumber, setLicenseNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('Pickup');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [capacityKg, setCapacityKg] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const addCrop = () => {
    const crop = cropInput.trim();

    if (!crop) return;

    if (!cropsGrown.includes(crop)) {
      setCropsGrown((prev) => [...prev, crop]);
    }

    setCropInput('');
  };

  const removeCrop = (cropToRemove: string) => {
    setCropsGrown((prev) =>
      prev.filter((crop) => crop !== cropToRemove)
    );
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (role === 'FARMER' && cropsGrown.length === 0) {
      setError('Please add at least one crop.');
      return;
    }

    setLoading(true);

    try {
      const baseData = {
        role,
        name,
        email,
        phone,
        password,
        confirmPassword,
        state,
        district,
        pincode,
        address,
      };

      let requestData: Record<string, unknown> = baseData;

      if (role === 'FARMER') {
        requestData = {
          ...baseData,
          farmSizeAcres: Number(farmSizeAcres),
          cropsGrown,
        };
      }

      if (role === 'BUYER') {
        requestData = {
          ...baseData,
          companyName,
          buyerType,
          gstNumber: gstNumber || undefined,
        };
      }

      if (role === 'FPO') {
        requestData = {
          ...baseData,
          orgName,
          regNumber,
        };
      }

      if (role === 'DRIVER') {
        requestData = {
          ...baseData,
          licenseNumber,
          vehicleType,
          vehicleNumber,
          capacityKg: Number(capacityKg),
        };
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || 'Registration failed. Please try again.'
        );
      }

      const user = data?.data?.user || data?.user;

      if (!user) {
        throw new Error(
          'Registration succeeded but user data was not returned.'
        );
      }

      setUser({
        ...user,
        createdAt: user.createdAt || new Date().toISOString(),
      });

      if (role === 'FARMER') {
        navigate('/farmer-dashboard');
      } else if (role === 'BUYER') {
        navigate('/marketplace');
      } else if (role === 'FPO') {
        navigate('/fpo-dashboard');
      } else if (role === 'DRIVER') {
        navigate('/driver-dashboard');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong during registration.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-140px)] overflow-hidden py-12 px-4">
      {/* Agricultural background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2200&q=85')",
        }}
      />

      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/45 via-emerald-900/20 to-slate-950/30" />

      {/* Registration card */}
      <div className="relative w-full max-w-xl mx-auto bg-white/95 backdrop-blur-md p-8 rounded-3xl border border-white/70 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 mx-auto mb-4 shadow-sm">
            <Sprout className="w-7 h-7" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Create your AGRI MITRA Account
          </h2>

          <p className="text-xs text-slate-500 mt-2">
            Select your account type to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Select Your Account Type
            </label>

            <div className="grid grid-cols-4 gap-2">
              {[
                {
                  role: 'FARMER' as UserRole,
                  label: 'Farmer',
                  icon: Tractor,
                },
                {
                  role: 'BUYER' as UserRole,
                  label: 'Buyer',
                  icon: Building2,
                },
                {
                  role: 'FPO' as UserRole,
                  label: 'FPO',
                  icon: Building2,
                },
                {
                  role: 'DRIVER' as UserRole,
                  label: 'Driver',
                  icon: Truck,
                },
              ].map(({ role: accountRole, label, icon: Icon }) => (
                <button
                  key={accountRole}
                  type="button"
                  onClick={() => handleRoleChange(accountRole)}
                  className={`py-3 px-2 text-xs font-bold rounded-xl border transition flex flex-col items-center gap-1 ${
                    role === accountRole
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50/90 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {role === 'FPO'
                ? 'Authorized Person Name'
                : 'Full Name'}
            </label>

            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />

              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50/90 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                placeholder={
                  role === 'FPO'
                    ? 'Authorized person name'
                    : 'Ramesh Kumar'
                }
              />
            </div>
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>

              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/90 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                  placeholder="ramesh@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Phone Number
              </label>

              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />

                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/90 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                  placeholder="9876543210"
                />
              </div>
            </div>
          </div>

          {/* Farmer Fields */}
          {role === 'FARMER' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Farm Size (Acres)
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={farmSizeAcres}
                  onChange={(e) => setFarmSizeAcres(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50/90 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                  placeholder="e.g. 5.5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Crops Grown
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cropInput}
                    onChange={(e) => setCropInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCrop();
                      }
                    }}
                    className="flex-1 px-4 py-3 bg-slate-50/90 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                    placeholder="e.g. Wheat"
                  />

                  <button
                    type="button"
                    onClick={addCrop}
                    className="px-4 py-3 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition shadow-sm"
                  >
                    Add
                  </button>
                </div>

                {cropsGrown.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {cropsGrown.map((crop) => (
                      <button
                        key={crop}
                        type="button"
                        onClick={() => removeCrop(crop)}
                        className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium"
                      >
                        {crop} ×
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Buyer Fields */}
          {role === 'BUYER' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Company Name
                </label>

                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50/90 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                  placeholder="ABC Agro Traders"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Buyer Type
                  </label>

                  <select
                    value={buyerType}
                    onChange={(e) => setBuyerType(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50/90 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                  >
                    <option value="RETAILER">Retailer</option>
                    <option value="WHOLESALER">Wholesaler</option>
                    <option value="RESTAURANT">Restaurant</option>
                    <option value="PROCESSOR">Processor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    GST Number
                  </label>

                  <input
                    type="text"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50/90 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </>
          )}

          {/* FPO Fields */}
          {role === 'FPO' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  FPO Organization Name
                </label>

                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50/90 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                  placeholder="Example Farmers Producer Organization"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  FPO Registration Number
                </label>

                <input
                  type="text"
                  required
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50/90 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                  placeholder="Registration number"
                />
              </div>
            </>
          )}

          {/* Driver Fields */}
          {role === 'DRIVER' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Driving License Number
                </label>

                <input
                  type="text"
                  required
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50/90 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                  placeholder="Enter license number"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Vehicle Type
                  </label>

                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50/90 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                  >
                    <option value="Mini-Truck">Mini Truck</option>
                    <option value="Pickup">Pickup</option>
                    <option value="Heavy Truck">Heavy Truck</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Vehicle Registration Number
                  </label>

                  <input
                    type="text"
                    required
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50/90 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                    placeholder="UP32AB1234"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Vehicle Capacity (KG)
                </label>

                <input
                  type="number"
                  min="1"
                  required
                  value={capacityKg}
                  onChange={(e) => setCapacityKg(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50/90 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                  placeholder="e.g. 1000"
                />
              </div>
            </>
          )}

          {/* Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                District
              </label>

              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />

                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/90 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                  placeholder="Your district"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                State
              </label>

              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50/90 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                placeholder="Your state"
              />
            </div>
          </div>

          {/* Pincode */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Pincode
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              value={pincode}
              onChange={(e) =>
                setPincode(e.target.value.replace(/\D/g, ''))
              }
              className="w-full px-4 py-3 bg-slate-50/90 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
              placeholder="6-digit pincode"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Address
            </label>

            <textarea
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-slate-50/90 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 resize-none transition"
              placeholder="Enter your complete address"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password
            </label>

            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50/90 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                placeholder="Minimum 8 characters"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Confirm Password
            </label>

            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />

              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50/90 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                placeholder="Re-enter your password"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-xl transition shadow-md hover:shadow-lg"
          >
            {loading ? 'Creating Account...' : `Create ${role} Account`}
          </button>
        </form>

        <div className="mt-7 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link
            to="/login"
            className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};