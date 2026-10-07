import React from 'react';
import { ArrowRight, AlertCircle, CheckCircle, Info } from 'lucide-react';

// Feature Card with icon
export function FeatureCard({ icon: Icon, title, description, color = 'farm', onClick, href }) {
  const colorClasses = {
    farm: 'bg-gradient-to-br from-farm-50 to-farm-100 border-farm-200 hover:shadow-lg hover:from-farm-100',
    harvest: 'bg-gradient-to-br from-harvest-50 to-harvest-100 border-harvest-200 hover:shadow-lg hover:from-harvest-100',
    sky: 'bg-gradient-to-br from-sky-50 to-sky-100 border-sky-200 hover:shadow-lg hover:from-sky-100',
  };

  const Wrapper = href ? 'a' : 'button';

  return (
    <Wrapper
      href={href}
      onClick={onClick}
      className={`${colorClasses[color]} block w-full p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer text-left hover:border-opacity-100`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-3 bg-white rounded-lg">
          <Icon size={32} className={`text-${color}-600`} />
        </div>
      </div>
      <h3 className="font-bold text-lg text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <div className="flex items-center text-sm font-semibold text-gray-700 gap-2">
        Get Started <ArrowRight size={16} />
      </div>
    </Wrapper>
  );
}

// Dashboard Metric Card
export function MetricCard({ label, value, unit = '', icon: Icon, trend, color = 'farm', subtitle }) {
  const bgColor = {
    farm: 'bg-farm-50 border-farm-200',
    harvest: 'bg-harvest-50 border-harvest-200',
    sky: 'bg-sky-50 border-sky-200',
  };

  const iconColor = {
    farm: 'text-farm-600',
    harvest: 'text-harvest-600',
    sky: 'text-sky-600',
  };

  return (
    <div className={`${bgColor[color]} border-2 rounded-xl p-6`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-600 text-sm font-semibold">{label}</p>
          {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
        </div>
        {Icon && <Icon size={24} className={iconColor[color]} />}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        <span className="text-gray-600 text-sm">{unit}</span>
      </div>
      {trend && (
        <p className={`text-xs font-semibold mt-3 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
          {trend.positive ? '↑' : '↓'} {trend.text}
        </p>
      )}
    </div>
  );
}

// Status Badge
export function StatusBadge({ status, variant = 'default' }) {
  const variants = {
    success: 'bg-green-100 text-green-700 border-green-300',
    warning: 'bg-amber-100 text-amber-700 border-amber-300',
    danger: 'bg-red-100 text-red-700 border-red-300',
    info: 'bg-blue-100 text-blue-700 border-blue-300',
    default: 'bg-gray-100 text-gray-700 border-gray-300',
  };

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${variants[variant]}`}>
      <span className="w-2 h-2 rounded-full bg-current"></span>
      {status}
    </span>
  );
}

// Alert Box
export function Alert({ type = 'info', title, message, onClose }) {
  const styles = {
    info: { bg: 'bg-blue-50', border: 'border-blue-300', icon: Info, color: 'text-blue-700' },
    success: { bg: 'bg-green-50', border: 'border-green-300', icon: CheckCircle, color: 'text-green-700' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-300', icon: AlertCircle, color: 'text-amber-700' },
    error: { bg: 'bg-red-50', border: 'border-red-300', icon: AlertCircle, color: 'text-red-700' },
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <div className={`${style.bg} border-2 ${style.border} rounded-lg p-4 flex gap-4 ${style.color}`}>
      <Icon size={20} className="flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <p className="font-semibold text-sm mb-1">{title}</p>}
        <p className="text-sm">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="flex-shrink-0 font-bold text-lg">
          ×
        </button>
      )}
    </div>
  );
}

// Form Input
export function FormInput({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helper,
  icon: Icon,
  required,
  disabled,
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon size={18} className="absolute left-3 top-3.5 text-gray-400" />}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full ${Icon ? 'pl-10' : 'px-4'} py-2.5 border-2 rounded-lg transition-all ${
            error
              ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-100'
              : 'border-gray-300 focus:border-farm-500 focus:ring-farm-100'
          } focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed`}
        />
      </div>
      {error && <p className="text-sm text-red-600 font-semibold">{error}</p>}
      {helper && <p className="text-sm text-gray-500">{helper}</p>}
    </div>
  );
}

// Primary Button
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading,
  disabled,
  ...props
}) {
  const variants = {
    primary: 'bg-farm-600 hover:bg-farm-700 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    outline: 'border-2 border-farm-600 text-farm-600 hover:bg-farm-50',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  return (
    <button
      className={`${variants[variant]} ${sizes[size]} rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
}

// Card
export function Card({ children, className = '', ...props }) {
  return (
    <div className={`bg-white rounded-xl border-2 border-gray-200 shadow-soft p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}
