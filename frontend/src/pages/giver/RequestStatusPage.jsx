import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../../store/AppContext'
import { Card, Header, Loading } from '../../components'
import { pollingService } from '../../services/pollingService'

const STATUS_STEPS = [
  { step: 'pending',   label: 'Waiting',  icon: '⏳', desc: 'Looking for agent' },
  { step: 'accepted',  label: 'Assigned', icon: '🚛', desc: 'Agent on the way'  },
  { step: 'collected', label: 'Collected',icon: '♻️', desc: 'Waste picked up'   },
]

const RequestStatusPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { requests, setRequests, addNotification, auth, logout } = useApp()

  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [driverLocation, setDriverLocation] = useState(null)

  useEffect(() => {
    const found = requests.find(r => r.id === id)
    setRequest(found || null)
    setLoading(false)
  }, [id, requests])

  useEffect(() => {
    if (!request) return

    const poll = () => {
      setRequest(prev => {
        if (!prev) return prev
        let updated = { ...prev }

        if (prev.status === 'pending' && Math.random() > 0.7) {
          updated.status = 'accepted'
          updated.driverName = ['Ravi Kumar', 'Vikram Rao', 'Manoj Singh'][Math.floor(Math.random() * 3)]
          addNotification(`🚛 ${updated.driverName} is on the way!`, 'success')
        }
        if (prev.status === 'accepted' && Math.random() > 0.8) {
          updated.status = 'collected'
          updated.collectedAt = new Date()
          addNotification('♻️ Waste collected successfully!', 'success')
        }
        if (prev.status === 'accepted') {
          setDriverLocation({
            latitude: (prev.latitude || 40.7128) + (Math.random() - 0.5) * 0.01,
            longitude: (prev.longitude || -74.006) + (Math.random() - 0.5) * 0.01,
          })
        }
        return updated
      })
    }

    pollingService.startPolling(`request_${id}`, poll, 3000)
    return () => pollingService.stopPolling(`request_${id}`)
  }, [id, request?.status])

  const handleLogout = () => { logout(); navigate('/auth/login') }

  if (loading) return <Loading />

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Not Found" onLogout={handleLogout} userName={auth.user?.name} />
        <div className="page-container text-center py-16">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-gray-500 mb-6">Request not found</p>
          <button onClick={() => navigate('/giver/dashboard')} className="btn-primary px-6">Back to Dashboard</button>
        </div>
      </div>
    )
  }

  const currentIdx = STATUS_STEPS.findIndex(s => s.step === request.status)

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header icon="📍" title="Track Request"
        subtitle={`ID: ${request.id}`}
        onLogout={handleLogout} userName={auth.user?.name}
      />

      <div className="page-container space-y-4">

        {/* Status Stepper */}
        <Card>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-5">Status</h3>
          <div className="flex items-start justify-between relative">
            {/* connector line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 mx-8" />
            <div
              className="absolute top-5 left-0 h-0.5 bg-primary mx-8 transition-all duration-500"
              style={{ width: currentIdx === 0 ? '0%' : currentIdx === 1 ? '50%' : '100%' }}
            />
            {STATUS_STEPS.map((s, i) => {
              const done = i <= currentIdx
              return (
                <div key={s.step} className="relative flex flex-col items-center flex-1 z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mb-2 border-2 transition-all ${
                    done ? 'bg-primary border-primary text-white shadow-md' : 'bg-white border-gray-200 text-gray-400'
                  }`}>
                    {s.icon}
                  </div>
                  <p className={`text-xs font-bold text-center ${done ? 'text-primary' : 'text-gray-400'}`}>{s.label}</p>
                  <p className="text-xs text-gray-400 text-center hidden sm:block">{s.desc}</p>
                </div>
              )
            })}
          </div>

          {/* Live pulse for active */}
          {request.status !== 'collected' && (
            <div className="mt-5 flex items-center gap-2 bg-blue-50 rounded-xl p-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
              </span>
              <p className="text-sm text-blue-700 font-medium">
                {request.status === 'pending' ? 'Searching for nearby agents...' : `${request.driverName} is on the way`}
              </p>
            </div>
          )}
        </Card>

        {/* Request Details */}
        <Card>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">⚖️ Weight</p>
              <p className="font-bold text-gray-800">{request.weight} kg</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">📍 Location</p>
              <p className="font-bold text-gray-800 text-sm truncate">{request.location}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">🕐 Created</p>
              <p className="font-bold text-gray-800 text-sm">{new Date(request.createdAt).toLocaleTimeString()}</p>
            </div>
            {request.collectedAt && (
              <div className="bg-green-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">♻️ Collected</p>
                <p className="font-bold text-green-700 text-sm">{new Date(request.collectedAt).toLocaleTimeString()}</p>
              </div>
            )}
          </div>
          {request.description && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-1">📝 Description</p>
              <p className="text-sm text-gray-700">{request.description}</p>
            </div>
          )}
        </Card>

        {/* Driver Info */}
        {request.driverName && (
          <Card>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Field Agent</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl shrink-0">🚛</div>
              <div>
                <p className="font-bold text-gray-800">{request.driverName}</p>
                <p className="text-xs text-gray-400">Assigned agent</p>
              </div>
            </div>
            {driverLocation && (
              <div className="mt-4 bg-blue-50 rounded-xl p-3 flex items-center gap-2">
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
                </span>
                <div>
                  <p className="text-xs font-bold text-blue-700">Live Location</p>
                  <p className="text-xs text-blue-600 font-mono">
                    {driverLocation.latitude.toFixed(4)}, {driverLocation.longitude.toFixed(4)}
                  </p>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Sticky bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex gap-3 shadow-lg">
        <button onClick={() => navigate('/giver/dashboard')} className="flex-1 btn-outline text-center">
          ← Dashboard
        </button>
        {request.status === 'collected' && (
          <button onClick={() => navigate(`/giver/acknowledge/${request.id}`)} className="flex-[2] btn-primary text-center">
            ✅ Acknowledge
          </button>
        )}
      </div>
    </div>
  )
}

export default RequestStatusPage
