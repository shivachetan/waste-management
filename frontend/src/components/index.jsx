import React from 'react'

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    outline: 'btn-outline',
  }

  return (
    <button
      className={`
        btn ${variantClasses[variant]} ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="label">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`input-field ${error ? 'border-red-500' : ''}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

export const Card = ({ children, className = '', onClick }) => {
  return (
    <div
      className={`card ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export const Header = ({ title, subtitle, icon, onLogout, userName }) => {
  const initials = userName
    ? userName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <div className="relative bg-gradient-to-r from-green-800 via-green-600 to-emerald-500 text-white shadow-md mb-4 overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white opacity-5 rounded-full" />
      <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white opacity-5 rounded-full" />
      {/* Bottom shimmer line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-20" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
        {/* Icon bubble */}
        {icon && (
          <div className="shrink-0 w-9 h-9 bg-white bg-opacity-15 rounded-xl flex items-center justify-center text-lg border border-white border-opacity-20">
            {icon}
          </div>
        )}

        {/* Title + subtitle */}
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-extrabold tracking-tight leading-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-green-100 font-medium truncate opacity-85">{subtitle}</p>
          )}
        </div>

        {/* Avatar + logout */}
        {onLogout && (
          <div className="flex items-center gap-2 shrink-0">
            {/* Avatar initials */}
            <div className="w-8 h-8 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-full flex items-center justify-center text-xs font-bold tracking-wide">
              {initials}
            </div>
            {/* Logout */}
            <button
              onClick={onLogout}
              title="Logout"
              className="w-8 h-8 flex items-center justify-center bg-white bg-opacity-15 hover:bg-opacity-25 border border-white border-opacity-20 rounded-full transition-all active:scale-90 text-sm"
            >
              ⏻
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export const Sidebar = ({ items, active, onSelect }) => {
  return (
    <div className="w-full md:w-64 bg-gray-100 border-r border-gray-300 p-4">
      <nav className="space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`
              w-full text-left px-4 py-3 rounded-lg transition-colors
              ${active === item.id
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

export const Notification = ({ message, type = 'info', onClose }) => {
  const typeClasses = {
    info: 'bg-blue-100 text-blue-700 border-blue-300',
    success: 'bg-green-100 text-green-700 border-green-300',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    error: 'bg-red-100 text-red-700 border-red-300',
  }

  return (
    <div className={`border-l-4 p-4 mb-4 rounded ${typeClasses[type]}`}>
      <div className="flex justify-between items-center">
        <p>{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xl font-bold opacity-50 hover:opacity-100"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}

export const Badge = ({ children, variant = 'primary' }) => {
  const variantClasses = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    danger: 'bg-danger text-white',
    gray: 'bg-gray-200 text-gray-800',
  }

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${variantClasses[variant]}`}>
      {children}
    </span>
  )
}

export const Loading = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )
}
