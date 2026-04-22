import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../../store/AppContext'
import { Card, Header, Loading } from '../../components'

const DriverDashboard = () => {
  const navigate = useNavigate()
  const { auth, logout, addNotification } = useApp()
  const [loading, setLoading] = useState(true)
  const [vehicleInfo, setVehicleInfo] = useState(null)
  const [nearbyRequests, setNearbyRequests] = useState([])

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setVehicleInfo({ id: 'v1', number: 'KA13AB1234', capacity: 500, currentLoad: 120, status: 'available', location: { latitude: 40.7128, longitude: -74.006 } })
      setNearbyRequests([
        { id: 'req_1', weight: 25, location: 'Gandhi Nagar Market',  distance: 0.8, priority: 'high',   giverName: 'Sharma General Store' },
        { id: 'req_2', weight: 15, location: 'Shahi Garments',    distance: 1.2, priority: 'medium', giverName: 'Patel Kirana Shop'    },
        { id: 'req_3', weight: 50, location: 'ABC Bakery', distance: 2.1, priority: 'medium', giverName: 'Anita Textiles'       },
      ])
      setLoading(false)
    }, 500)
  }, [])

  const handleLogout = () => { logout(); navigate('/auth/login') }
  const handleAccept = (id) => {
    addNotification('✅ Request accepted! Head to location.', 'success')
    navigate(`/driver/route/${id}`)
  }

  const pct = vehicleInfo ? Math.round((vehicleInfo.currentLoad / vehicleInfo.capacity) * 100) : 0
  const isAvailable = vehicleInfo?.status === 'available'

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header icon="🚛" title="Field Agent Dashboard"
        subtitle={`Hello, ${auth.user?.name || 'Agent'}`}
        onLogout={handleLogout} userName={auth.user?.name}
      />

      <div className="page-container space-y-4">

        {/* Vehicle Card */}
        <Card>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">🚛 Vehicle Status</h2>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Vehicle No.</p>
              <p className="font-bold text-gray-800 text-sm">{vehicleInfo?.number ?? '—'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Status</p>
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {isAvailable ? '🟢 Available' : '🔴 Unavailable'}
              </span>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 col-span-2">
              <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">📍 GPS</p>
              <p className="text-xs text-gray-600 font-mono">
                {vehicleInfo?.location.latitude.toFixed(4)}, {vehicleInfo?.location.longitude.toFixed(4)}
              </p>
            </div>
          </div>

          {/* Load bar */}
          <div>
            <div className="flex justify-between text-xs font-medium text-gray-500 mb-1.5">
              <span>⚖️ <strong className="text-gray-700">{vehicleInfo?.currentLoad ?? 0} kg</strong> loaded</span>
              <span>Max <strong className="text-gray-700">{vehicleInfo?.capacity ?? 0} kg</strong></span>
            </div>
            <div className="bg-gray-100 h-3 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${pct > 80 ? 'bg-red-500' : pct > 50 ? 'bg-amber-400' : 'bg-primary'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-right text-xs text-gray-400 mt-1">{pct}% full</p>
          </div>

          {pct > 80 && (
            <div className="mt-3 flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-800">
              <span>⚠️</span> Vehicle almost full — dump at yard soon.
            </div>
          )}
        </Card>

        {/* Nearby Requests */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <span>📡</span> Nearby Requests
            </h2>
            <span className="text-xs bg-primary text-white px-2.5 py-1 rounded-full font-bold">
              {nearbyRequests.length}
            </span>
          </div>

          {loading ? <Loading /> : nearbyRequests.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-2">🔍</p>
              <p className="text-gray-400 text-sm">No nearby requests right now</p>
            </div>
          ) : (
            <div className="space-y-3">
              {nearbyRequests.map(req => {
                const canAccept = isAvailable && vehicleInfo && vehicleInfo.currentLoad + req.weight <= vehicleInfo.capacity
                const freeAfter = vehicleInfo ? vehicleInfo.capacity - vehicleInfo.currentLoad - req.weight : 0
                const isHigh = req.priority === 'high'

                return (
                  <div key={req.id} className={`rounded-xl border-2 p-4 ${canAccept ? 'border-gray-200' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <p className="font-bold text-gray-800 text-sm">🏪 {req.giverName}</p>
                        <p className="text-xs text-gray-400 mt-0.5">📍 {req.location}</p>
                      </div>
                      <span className={`shrink-0 text-xs font-bold px-2 py-1 rounded-full ${isHigh ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {isHigh ? '🔴 High' : '🟡 Med'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">⚖️ {req.weight} kg</span>
                      <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">📏 {req.distance} km</span>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${canAccept ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {canAccept ? `✅ ${freeAfter} kg free` : '❌ No space'}
                      </span>
                    </div>

                    <button
                      disabled={!canAccept}
                      onClick={() => handleAccept(req.id)}
                      className={`w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                        canAccept ? 'bg-primary text-white shadow' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {canAccept ? '✅ Accept Request' : '🚫 Not Enough Space'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Sticky dump button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
        <Link to="/driver/dump" className="block">
          <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2">
            🗑️ Dump at Yard
          </button>
        </Link>
      </div>
    </div>
  )
}

export default DriverDashboard
