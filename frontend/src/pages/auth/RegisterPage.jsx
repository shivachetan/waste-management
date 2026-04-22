import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../../store/AppContext'
import { Input, Card } from '../../components'

const ROLES = [
  { value: 'giver',     label: 'Merchant',    icon: '🏪', desc: 'Shop / Business owner',  color: 'border-green-400',  active: 'ring-2 ring-green-400 bg-green-50'   },
  { value: 'collector', label: 'Field Agent', icon: '🚛', desc: 'Driver / Collector',      color: 'border-blue-400',   active: 'ring-2 ring-blue-400 bg-blue-50'     },
  { value: 'admin',     label: 'Admin',       icon: '👨‍💼', desc: 'System Administrator',  color: 'border-purple-400', active: 'ring-2 ring-purple-400 bg-purple-50' },
]

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register, addNotification } = useApp()

  const [step, setStep] = useState(1) // 1 = role, 2 = form
  const [userType, setUserType] = useState(null)
  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '', name: '', phone: '', address: '',
    shopName: '', ownerName: '', vehicleNumber: '', maxCapacity: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const e = {}
    if (!formData.email) e.email = 'Required'
    if (!formData.name) e.name = 'Required'
    if (!formData.phone) e.phone = 'Required'
    if (!formData.password) e.password = 'Required'
    if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match'
    if (userType === 'giver') {
      if (!formData.shopName) e.shopName = 'Required'
      if (!formData.ownerName) e.ownerName = 'Required'
    }
    if (userType === 'collector') {
      if (!formData.vehicleNumber) e.vehicleNumber = 'Required'
      if (!formData.maxCapacity) e.maxCapacity = 'Required'
    }
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }

    setLoading(true)
    try {
      const details = { phone: formData.phone, address: formData.address }
      if (userType === 'giver') { details.shopName = formData.shopName; details.ownerName = formData.ownerName }
      if (userType === 'collector') { details.vehicleNumber = formData.vehicleNumber; details.maxCapacity = formData.maxCapacity }

      register(formData.email, formData.password, userType, details)
      addNotification('Account created! Welcome 🎉', 'success')
      navigate(userType === 'giver' ? '/giver/dashboard' : userType === 'collector' ? '/driver/dashboard' : '/admin/dashboard')
    } catch {
      addNotification('Registration failed. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-green-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-3xl">♻️</span>
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-400 bg-clip-text text-transparent">WasteCollect</h1>
            </div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Create Account</p>
          </div>

          {step === 1 ? (
            <>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">I am a...</p>
              <div className="space-y-2 mb-6">
                {ROLES.map(role => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => { setUserType(role.value); setStep(2) }}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all hover:shadow-md ${role.color} bg-white`}
                  >
                    <span className="text-3xl">{role.icon}</span>
                    <div>
                      <p className="font-bold text-gray-800">{role.label}</p>
                      <p className="text-xs text-gray-400">{role.desc}</p>
                    </div>
                    <span className="ml-auto text-gray-300 text-lg">›</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <button type="button" onClick={() => setStep(1)} className="text-sm text-primary font-semibold flex items-center gap-1 mb-2">
                ← Change role
              </button>

              <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3 mb-2">
                <span className="text-2xl">{ROLES.find(r => r.value === userType)?.icon}</span>
                <div>
                  <p className="text-xs text-gray-400">Registering as</p>
                  <p className="font-bold text-gray-800 text-sm">{ROLES.find(r => r.value === userType)?.label}</p>
                </div>
              </div>

              <Input label="Full Name" type="text" name="name" placeholder="Your name" value={formData.name} onChange={handleChange} error={errors.name} required />
              <Input label="Email" type="email" name="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} error={errors.email} required />
              <Input label="Phone" type="tel" name="phone" placeholder="+1 234 567 8900" value={formData.phone} onChange={handleChange} error={errors.phone} required />
              <Input label="Address" type="text" name="address" placeholder="Your address (optional)" value={formData.address} onChange={handleChange} />

              {userType === 'giver' && (
                <>
                  <Input label="🏪 Shop Name" type="text" name="shopName" placeholder="Your shop name" value={formData.shopName} onChange={handleChange} error={errors.shopName} required />
                  <Input label="Owner Name" type="text" name="ownerName" placeholder="Shop owner name" value={formData.ownerName} onChange={handleChange} error={errors.ownerName} required />
                </>
              )}

              {userType === 'collector' && (
                <>
                  <Input label="🚛 Vehicle Number" type="text" name="vehicleNumber" placeholder="e.g., ABC123XYZ" value={formData.vehicleNumber} onChange={handleChange} error={errors.vehicleNumber} required />
                  <Input label="Max Capacity (kg)" type="number" name="maxCapacity" placeholder="500" value={formData.maxCapacity} onChange={handleChange} error={errors.maxCapacity} required />
                </>
              )}

              <Input label="Password" type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} error={errors.password} required />
              <Input label="Confirm Password" type="password" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} required />

              <button type="submit" disabled={loading} className="w-full btn-primary mt-2 disabled:opacity-50">
                {loading ? '⏳ Creating account...' : '🎉 Create Account'}
              </button>
            </form>
          )}

          <div className="mt-5 pt-4 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-primary font-semibold">Login</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default RegisterPage
