import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../store/AppContext'
import { Button, Input, Header, Card } from '../../components'

const CreateRequestPage = () => {
  const navigate = useNavigate()
  const { auth, requests, setRequests, addNotification, logout } = useApp()

  const [formData, setFormData] = useState({
    weight: '',
    description: '',
    latitude: '',
    longitude: '',
    locationName: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [gettingLocation, setGettingLocation] = useState(false)

  useEffect(() => {
    if (navigator.geolocation) {
      setGettingLocation(true)
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          setFormData(prev => ({
            ...prev,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            locationName: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
          }))
          setGettingLocation(false)
        },
        () => {
          setGettingLocation(false)
          setFormData(prev => ({
            ...prev,
            latitude: '40.7128',
            longitude: '-74.0060',
            locationName: 'Current Location',
          }))
        }
      )
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.weight || parseFloat(formData.weight) <= 0) newErrors.weight = 'Please enter a valid weight'
    if (!formData.locationName) newErrors.locationName = 'Location is required'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }

    setLoading(true)
    try {
      const newRequest = {
        id: `req_${Date.now()}`,
        weight: parseFloat(formData.weight),
        description: formData.description,
        status: 'pending',
        location: formData.locationName,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        driverName: null,
        createdAt: new Date(),
        collectedAt: null,
        giverId: auth.user?.id,
      }
      setRequests([...requests, newRequest])
      addNotification('Request created! Finding nearby agents...', 'success')
      setTimeout(() => navigate(`/giver/request/${newRequest.id}`), 1000)
    } catch {
      addNotification('Failed to create request. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => { logout(); navigate('/auth/login') }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header icon="📦" title="New Pickup Request"
        subtitle="Find a nearby field agent"
        onLogout={handleLogout} userName={auth.user?.name}
      />

      <div className="page-container">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Weight */}
            <div>
              <label className="label">⚖️ Waste Weight (kg)</label>
              <input
                type="number"
                name="weight"
                placeholder="e.g., 25"
                value={formData.weight}
                onChange={handleChange}
                inputMode="numeric"
                className={`input-field ${errors.weight ? 'border-red-400' : ''}`}
              />
              {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
              <p className="text-xs text-gray-400 mt-1">Approximate weight of waste to be collected</p>
            </div>

            {/* Description */}
            <div>
              <label className="label">📝 Description <span className="font-normal text-gray-400">(optional)</span></label>
              <textarea
                name="description"
                placeholder="e.g., plastic, cardboard, mixed waste..."
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="input-field resize-none"
              />
            </div>

            {/* Location */}
            <div>
              <label className="label">📍 Pickup Location</label>
              {gettingLocation ? (
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border-2 border-blue-100">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary shrink-0" />
                  <span className="text-sm text-blue-700">Fetching your GPS location...</span>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    name="locationName"
                    placeholder="Your shop or location address"
                    value={formData.locationName}
                    onChange={handleChange}
                    className={`input-field ${errors.locationName ? 'border-red-400' : ''}`}
                  />
                  {errors.locationName && <p className="text-red-500 text-sm mt-1">{errors.locationName}</p>}
                  {formData.latitude && (
                    <p className="text-xs text-gray-400 mt-1 font-mono">
                      {formData.latitude}, {formData.longitude}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Info */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-green-800 mb-2">💡 How it works</p>
              <ol className="text-sm text-green-700 space-y-1 list-decimal list-inside">
                <li>We match your request with nearby field agents</li>
                <li>Agents within 5 km get notified</li>
                <li>First to accept gets assigned</li>
                <li>Track the agent in real-time</li>
              </ol>
            </div>
          </form>
        </Card>
      </div>

      {/* Sticky bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex gap-3 shadow-lg">
        <button
          type="button"
          onClick={() => navigate('/giver/dashboard')}
          disabled={loading}
          className="flex-1 btn-outline text-center"
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading || gettingLocation}
          className="flex-[2] btn-primary text-center disabled:opacity-50"
        >
          {loading ? '⏳ Creating...' : '➕ Create Request'}
        </button>
      </div>
    </div>
  )
}

export default CreateRequestPage
