import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../../store/AppContext'
import { Button, Input, Card } from '../../components'

const ROLES = [
  { value: 'giver',     label: 'Merchant',     icon: '🏪', desc: 'Shop / Business owner',   color: 'border-green-400',  bg: 'bg-green-50',   active: 'ring-2 ring-green-400 bg-green-50' },
  { value: 'collector', label: 'Field Agent',  icon: '🚛', desc: 'Driver / Collector',       color: 'border-blue-400',   bg: 'bg-blue-50',    active: 'ring-2 ring-blue-400 bg-blue-50'   },
  { value: 'admin',     label: 'Admin',        icon: '👨‍💼', desc: 'System Administrator',    color: 'border-purple-400', bg: 'bg-purple-50',  active: 'ring-2 ring-purple-400 bg-purple-50' },
]

const LoginPage = () => {
  const navigate = useNavigate()
  const { login, addNotification } = useApp()

  const [selectedRole, setSelectedRole] = useState('giver')
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    if (formData.email && !formData.email.includes('@')) newErrors.email = 'Please enter a valid email'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }

    setLoading(true)
    try {
      login(formData.email, formData.password, selectedRole)
      addNotification('Login successful!', 'success')

      if (selectedRole === 'giver') navigate('/giver/dashboard')
      else if (selectedRole === 'collector') navigate('/driver/dashboard')
      else navigate('/admin/dashboard')
    } catch (error) {
      addNotification('Login failed. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-green-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-4xl">♻️</span>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-400 bg-clip-text text-transparent tracking-tight">
                WasteCollect
              </h1>
            </div>
            <p className="text-gray-500 text-sm font-medium tracking-wide uppercase">Smart Waste Collection Management</p>
            <div className="mx-auto mt-2 h-0.5 w-12 bg-gradient-to-r from-green-400 to-emerald-300 rounded-full" />
          </div>

          {/* Role Selector */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Login as</p>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map(role => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setSelectedRole(role.value)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    selectedRole === role.value ? role.active + ' border-opacity-100 shadow-md scale-105' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{role.icon}</div>
                  <div className="text-xs font-bold text-gray-700">{role.label}</div>
                  <div className="text-xs text-gray-400 leading-tight hidden sm:block">{role.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />
            <Button type="submit" variant="primary" fullWidth disabled={loading}>
              {loading ? 'Logging in...' : `Login as ${ROLES.find(r => r.value === selectedRole)?.label}`}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <Link to="/auth/register" className="text-primary font-semibold hover:underline">
                Register here
              </Link>
            </p>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              💡 <strong>Demo:</strong> Use any email &amp; password. Select your role above.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage
