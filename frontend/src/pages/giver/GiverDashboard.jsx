import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../../store/AppContext'
import { Button, Card, Header, Loading } from '../../components'

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   icon: '⏳', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  accepted:  { label: 'Accepted',  icon: '✅', bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200'   },
  collected: { label: 'Collected', icon: '♻️', bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200'  },
  dumped:    { label: 'Dumped',    icon: '🗑️', bg: 'bg-gray-50',   text: 'text-gray-600',   border: 'border-gray-200'   },
}

const FILTERS = [
  { value: 'all',       label: 'All',       icon: '📋' },
  { value: 'pending',   label: 'Pending',   icon: '⏳' },
  { value: 'accepted',  label: 'Accepted',  icon: '✅' },
  { value: 'collected', label: 'Collected', icon: '♻️' },
  { value: 'dumped',    label: 'Dumped',    icon: '🗑️' },
]

const GiverDashboard = () => {
  const navigate = useNavigate()
  const { auth, requests, setRequests, logout } = useApp()
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setRequests([
        { id: 'req_1', weight: 25, status: 'collected', location: 'Gandhi Nagar Market',    driverName: 'Ravi Kumar',   createdAt: new Date(Date.now() - 2 * 3600000), collectedAt: new Date(Date.now() - 3600000) },
        { id: 'req_2', weight: 15, status: 'accepted',  location: 'Shahi Garments',      driverName: 'Suresh Patel', createdAt: new Date(Date.now() - 1800000),    collectedAt: null },
        { id: 'req_3', weight: 50, status: 'pending',   location: 'ABC Bakery',   driverName: null,           createdAt: new Date(Date.now() - 600000),     collectedAt: null },
      ])
      setLoading(false)
    }, 500)
  }, [])

  const handleLogout = () => { logout(); navigate('/auth/login') }

  const stats = [
    { label: 'Total',     icon: '📋', value: requests.length,                                       filter: 'all',       bg: 'bg-indigo-50', text: 'text-indigo-600' },
    { label: 'Pending',   icon: '⏳', value: requests.filter(r => r.status === 'pending').length,   filter: 'pending',   bg: 'bg-yellow-50', text: 'text-yellow-600' },
    { label: 'Accepted',  icon: '✅', value: requests.filter(r => r.status === 'accepted').length,  filter: 'accepted',  bg: 'bg-blue-50',   text: 'text-blue-600'   },
    { label: 'Collected', icon: '♻️', value: requests.filter(r => r.status === 'collected').length, filter: 'collected', bg: 'bg-green-50',  text: 'text-green-600'  },
  ]

  const filteredRequests = requests.filter(r => {
    const matchesStatus = activeFilter === 'all' || r.status === activeFilter
    const matchesSearch = searchText.trim() === '' ||
      r.location.toLowerCase().includes(searchText.toLowerCase()) ||
      (r.driverName && r.driverName.toLowerCase().includes(searchText.toLowerCase()))
    return matchesStatus && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header icon="🏪" title="Merchant Dashboard"
        subtitle={`Welcome, ${auth.user?.name || 'User'}`}
        onLogout={handleLogout} userName={auth.user?.name}
      />

      <div className="page-container space-y-4">

        {/* Stats grid — clickable filters */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <button
              key={s.filter}
              onClick={() => setActiveFilter(s.filter)}
              className={`${s.bg} rounded-2xl p-4 flex items-center gap-3 border-2 transition-all text-left ${
                activeFilter === s.filter ? 'border-current shadow-md scale-105' : 'border-transparent'
              }`}
            >
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className={`text-2xl font-extrabold ${s.text}`}>{s.value}</p>
                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Requests Card */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <span>📦</span> My Requests
              <span className="text-sm font-normal text-gray-400">({filteredRequests.length})</span>
            </h2>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search location or driver..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
            />
            {searchText && (
              <button onClick={() => setSearchText('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl leading-none">×</button>
            )}
          </div>

          {/* Filter pills — horizontal scroll on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
            {FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border-2 transition-all whitespace-nowrap shrink-0 ${
                  activeFilter === f.value
                    ? 'bg-primary border-primary text-white shadow'
                    : 'bg-white border-gray-200 text-gray-600'
                }`}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>

          {loading ? <Loading /> : filteredRequests.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-3">{searchText ? '🔍' : '📭'}</p>
              <p className="text-gray-500 text-sm mb-4">
                {searchText ? `No results for "${searchText}"` : activeFilter === 'all' ? 'No requests yet' : `No ${activeFilter} requests`}
              </p>
              {(activeFilter !== 'all' || searchText) && (
                <button onClick={() => { setActiveFilter('all'); setSearchText('') }} className="text-primary text-sm font-semibold">
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRequests.map(req => {
                const s = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending
                return (
                  <div key={req.id} className={`rounded-xl border ${s.border} ${s.bg} p-4`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 truncate text-sm">📍 {req.location}</p>
                        <p className="text-xs text-gray-400">{new Date(req.createdAt).toLocaleString()}</p>
                      </div>
                      <span className={`shrink-0 flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${s.text} bg-white border ${s.border}`}>
                        {s.icon} {s.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm flex-wrap">
                      <span className="text-gray-600 font-medium">⚖️ {req.weight} kg</span>
                      {req.driverName
                        ? <span className="text-gray-600">🚛 {req.driverName}</span>
                        : <span className="text-gray-400">🔍 Finding agent...</span>
                      }
                    </div>

                    {req.status !== 'collected' && (
                      <Link to={`/giver/request/${req.id}`}>
                        <button className="mt-3 text-xs font-semibold text-primary flex items-center gap-1">
                          👁️ Track Request →
                        </button>
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Sticky new request button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
        <Link to="/giver/create-request" className="block">
          <button className="w-full btn-primary flex items-center justify-center gap-2">
            <span>➕</span> New Pickup Request
          </button>
        </Link>
      </div>
    </div>
  )
}

export default GiverDashboard
