import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useTranslation from '../hooks/useTranslation';
import { UserPlus, Eye, EyeOff, Leaf } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password || !confirmPassword) {
      setError(t('authFillAllFields') || 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError(t('authPasswordTooShort') || 'Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError(t('authPasswordMismatch') || 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(fullName, email, password, confirmPassword);
      navigate('/login');
    } catch (err) {
      setError(err.message || t('authRegisterFailed') || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 px-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-8xl opacity-10">🌾</div>
        <div className="absolute bottom-10 right-10 text-8xl opacity-10">🌱</div>
        <div className="absolute top-1/3 right-1/4 text-6xl opacity-5">🌿</div>
        <div className="absolute bottom-1/3 left-1/4 text-6xl opacity-5">🌻</div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-2xl shadow-lg mb-4">
            <Leaf size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('authAppTitle') || 'AI Crop Recommendation'}
          </h1>
          <p className="text-gray-500 mt-1">
            {t('authAppSubtitle') || '& Growth Prediction System'}
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {t('authRegisterTitle') || 'Create Account'}
            </h2>
            <p className="text-gray-500 mt-1">
              {t('authRegisterSubtitle') || 'Join our farming intelligence platform'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t('authFullName') || 'Full Name'}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t('authFullNamePlaceholder') || 'Enter your full name'}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition text-gray-900"
                autoComplete="name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t('authEmail') || 'Email'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('authEmailPlaceholder') || 'Enter your email'}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition text-gray-900"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t('authPassword') || 'Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('authPasswordPlaceholder') || 'At least 6 characters'}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition text-gray-900 pr-12"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t('authConfirmPassword') || 'Confirm Password'}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('authConfirmPasswordPlaceholder') || 'Re-enter your password'}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition text-gray-900"
                autoComplete="new-password"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-200"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <UserPlus size={20} />
              )}
              {loading
                ? (t('authCreatingAccount') || 'Creating account...')
                : (t('authRegisterButton') || 'Create Account')}
            </button>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center text-sm text-gray-500">
            {t('authHaveAccount') || 'Already have an account?'}{' '}
            <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold">
              {t('authLoginLink') || 'Sign in'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
