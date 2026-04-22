import React, { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useApp } from './store/AppContext'

// Lazy load pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'))
const GiverDashboard = lazy(() => import('./pages/giver/GiverDashboard'))
const CreateRequestPage = lazy(() => import('./pages/giver/CreateRequestPage'))
const RequestStatusPage = lazy(() => import('./pages/giver/RequestStatusPage'))
const DriverDashboard = lazy(() => import('./pages/driver/DriverDashboard'))
const RoutePageDriver = lazy(() => import('./pages/driver/RoutePageDriver'))

// Fallback loading component
const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
)

// Placeholder components
const AcknowledgePage = () => {
  const nav = useNavigate()
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="text-6xl mb-4">✅</div>
      <h1 className="text-2xl font-extrabold text-gray-800 mb-2">Collection Confirmed!</h1>
      <p className="text-gray-500 mb-8">Thank you for confirming the waste pickup.</p>
      <button onClick={() => nav('/giver/dashboard')} className="btn-primary px-8">Back to Dashboard</button>
    </div>
  )
}
const DumpPage = () => {
  const nav = useNavigate()
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="text-6xl mb-4">🗑️</div>
      <h1 className="text-2xl font-extrabold text-gray-800 mb-2">Vehicle Dumped!</h1>
      <p className="text-gray-500 mb-2">Waste dumped successfully at the yard.</p>
      <p className="text-sm text-green-600 font-semibold mb-8">Vehicle is now available for pickups ✅</p>
      <button onClick={() => nav('/driver/dashboard')} className="btn-primary px-8">Back to Dashboard</button>
    </div>
  )
}
const AdminDashboard = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="bg-gradient-to-r from-purple-700 to-purple-500 text-white py-4 mb-6 shadow-lg">
      <div className="page-container">
        <h1 className="text-xl font-extrabold">👨‍💼 Admin Dashboard</h1>
        <p className="text-purple-200 text-sm">System monitoring & operations</p>
      </div>
    </div>
    <div className="page-container">
      <div className="card text-center py-12">
        <p className="text-5xl mb-4">🚧</p>
        <p className="text-gray-500">Admin dashboard coming soon</p>
      </div>
    </div>
  </div>
)
const NotFound = () => {
  const nav = useNavigate()
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h1 className="text-2xl font-extrabold text-gray-800 mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
      <button onClick={() => nav('/')} className="btn-primary px-8">Go Home</button>
    </div>
  )
}

// Protected route wrapper - moved inside Router component to access useApp context
const ProtectedRoute = ({ children, requiredType = null, auth }) => {
  if (!auth.isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  if (requiredType && auth.user.type !== requiredType) {
    return <Navigate to="/" replace />
  }

  return children
}

export const Router = () => {
  const { auth } = useApp()

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        {/* Giver Routes */}
        <Route
          path="/giver/dashboard"
          element={
            <ProtectedRoute auth={auth} requiredType="giver">
              <GiverDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/giver/create-request"
          element={
            <ProtectedRoute auth={auth} requiredType="giver">
              <CreateRequestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/giver/request/:id"
          element={
            <ProtectedRoute auth={auth} requiredType="giver">
              <RequestStatusPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/giver/acknowledge/:id"
          element={
            <ProtectedRoute auth={auth} requiredType="giver">
              <AcknowledgePage />
            </ProtectedRoute>
          }
        />

        {/* Driver Routes */}
        <Route
          path="/driver/dashboard"
          element={
            <ProtectedRoute auth={auth} requiredType="collector">
              <DriverDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/route/:id"
          element={
            <ProtectedRoute auth={auth} requiredType="collector">
              <RoutePageDriver />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/dump"
          element={
            <ProtectedRoute auth={auth} requiredType="collector">
              <DumpPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute auth={auth} requiredType="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route
          path="/"
          element={
            auth.isAuthenticated ? (
              <Navigate
                to={
                  auth.user.type === 'giver'
                    ? '/giver/dashboard'
                    : auth.user.type === 'collector'
                      ? '/driver/dashboard'
                      : '/admin/dashboard'
                }
                replace
              />
            ) : (
              <Navigate to="/auth/login" replace />
            )
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
