import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../../store/AppContext'
import { Card, Header, Loading } from '../../components'
import { pollingService } from '../../services/pollingService'

const RoutePageDriver = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addNotification, auth, logout } = useApp()

  const [route, setRoute] = useState(null)
  const [loading, setLoading] = useState(true)
  const [driverLocation, setDriverLocation] = useState({ latitude: 40.7128, longitude: -74.006 })

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setRoute({
        id: 'route_1',
        stops: [
          { id: 'req_1', giverName: 'Sharma General Store', location: 'Gandhi Nagar Market',  weight: 25, latitude: 40.716,  longitude: -74.008, status: 'in-progress', distanceFromCurrent: 0.8 },
          { id: 'req_2', giverName: 'Patel Kirana Shop',    location: 'Shahi Garments',    weight: 15, latitude: 40.713,  longitude: -74.004, status: 'pending',     distanceFromCurrent: 1.2 },
          { id: 'req_3', giverName: 'Anita Textiles',       location: 'ABC Bakery', weight: 50, latitude: 40.71,   longitude: -74.01,  status: 'pending',     distanceFromCurrent: 2.1 },
        ],
        totalWeight: 90,
        vehicleCapacity: 500,
        currentLoad: 120,
      })
      setLoading(false)
    }, 500)
  }, [])

  useEffect(() => {
    if (!route) return
    pollingService.startPolling(`route_${id}`, () => {
      setDriverLocation(prev => ({
        latitude: prev.latitude + (Math.random() - 0.5) * 0.002,
        longitude: prev.longitude + (Math.random() - 0.5) * 0.002,
      }))
    }, 3000)
    return () => pollingService.stopPolling(`route_${id}`)
  }, [id, route])

  const handleMarkCollected = (stopId) => {
    setRoute(prev => {
      if (!prev) return prev
      const stops = prev.stops.map(s => s.id === stopId ? { ...s, status: 'completed' } : s)
      // auto-activate next pending stop
      const nextIdx = stops.findIndex(s => s.status === 'pending')
      if (nextIdx !== -1) stops[nextIdx] = { ...stops[nextIdx], status: 'in-progress' }
      addNotification('✅ Waste marked as collected!', 'success')
      return { ...prev, stops }
    })
  }

  const handleLogout = () => { logout(); navigate('/auth/login') }

  if (loading) return <Loading />

  if (!route) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Route Not Found" onLogout={handleLogout} userName={auth.user?.name} />
        <div className="page-container text-center py-16">
          <p className="text-5xl mb-4">🗺️</p>
          <p className="text-gray-500 mb-6">Route not found</p>
          <button onClick={() => navigate('/driver/dashboard')} className="btn-primary px-6">Back to Dashboard</button>
        </div>
      </div>
    )
  }

  const currentStop = route.stops.find(s => s.status === 'in-progress')
  const completed = route.stops.filter(s => s.status === 'completed').length
  const pct = Math.round(((route.currentLoad + route.totalWeight) / route.vehicleCapacity) * 100)

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header icon="🗺️" title="Current Route"
        subtitle={`${completed}/${route.stops.length} stops done`}
        onLogout={handleLogout} userName={auth.user?.name}
      />

      <div className="page-container space-y-4">

        {/* Progress bar */}
        <Card>
          <div className="flex justify-between text-xs font-semibold text-gray-500 mb-2">
            <span>⚖️ Load after all pickups</span>
            <span>{route.currentLoad + route.totalWeight} / {route.vehicleCapacity} kg</span>
          </div>
          <div className="bg-gray-100 h-3 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${pct > 80 ? 'bg-red-500' : pct > 50 ? 'bg-amber-400' : 'bg-primary'}`}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
          <p className="text-right text-xs text-gray-400 mt-1">{pct}%</p>
        </Card>

        {/* Current stop — big CTA */}
        {currentStop && (
          <div className="bg-primary rounded-2xl p-5 text-white shadow-lg">
            <p className="text-xs font-bold uppercase tracking-widest opacity-75 mb-2">▶ Current Stop</p>
            <p className="text-xl font-extrabold mb-0.5">{currentStop.giverName}</p>
            <p className="text-sm opacity-80 mb-1">📍 {currentStop.location}</p>
            <div className="flex gap-3 text-sm mt-3 mb-4">
              <span className="bg-white bg-opacity-20 rounded-full px-3 py-1">⚖️ {currentStop.weight} kg</span>
              <span className="bg-white bg-opacity-20 rounded-full px-3 py-1">📏 {currentStop.distanceFromCurrent} km</span>
            </div>
            <button
              onClick={() => handleMarkCollected(currentStop.id)}
              className="w-full bg-white text-primary font-bold py-3 rounded-xl active:scale-95 transition-all"
            >
              ✅ Mark as Collected
            </button>
          </div>
        )}

        {/* All stops list */}
        <Card>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">All Stops</h3>
          <div className="space-y-3">
            {route.stops.map((stop, idx) => {
              const isDone = stop.status === 'completed'
              const isActive = stop.status === 'in-progress'
              return (
                <div key={stop.id} className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all ${
                  isActive ? 'border-primary bg-green-50' :
                  isDone   ? 'border-gray-100 bg-gray-50 opacity-50' :
                             'border-gray-100 bg-white'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    isDone ? 'bg-gray-300 text-gray-500' : isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {isDone ? '✓' : idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm truncate ${isDone ? 'line-through text-gray-400' : 'text-gray-800'}`}>{stop.giverName}</p>
                    <p className="text-xs text-gray-500 truncate">{stop.location}</p>
                    <div className="flex gap-3 mt-1 text-xs text-gray-500">
                      <span>⚖️ {stop.weight} kg</span>
                      <span>📏 {stop.distanceFromCurrent} km</span>
                    </div>
                  </div>
                  <div className={`shrink-0 text-xs font-bold px-2 py-1 rounded-full ${
                    isDone   ? 'bg-gray-100 text-gray-400' :
                    isActive ? 'bg-green-100 text-green-700' :
                               'bg-yellow-50 text-yellow-600'
                  }`}>
                    {isDone ? 'Done' : isActive ? 'Now' : 'Next'}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Live location */}
        <div className="flex items-center gap-2 px-1">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
          </span>
          <p className="text-xs text-gray-400 font-mono">
            Live: {driverLocation.latitude.toFixed(5)}, {driverLocation.longitude.toFixed(5)}
          </p>
        </div>
      </div>

      {/* Sticky bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex gap-3 shadow-lg">
        <button onClick={() => navigate('/driver/dashboard')} className="flex-1 btn-outline text-center text-sm">
          ← Dashboard
        </button>
        <button onClick={() => navigate('/driver/dump')} className="flex-[2] bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl active:scale-95 transition-all text-sm">
          🗑️ Dump at Yard
        </button>
      </div>
    </div>
  )
}

export default RoutePageDriver
