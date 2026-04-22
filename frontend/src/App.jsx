import { HashRouter as BrowserRouter } from 'react-router-dom'
import { AppProvider } from './store/AppContext'
import { Router } from './router'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="min-h-screen bg-gray-50">
          <Router />
        </div>
      </AppProvider>
    </BrowserRouter>
  )
}

export default App
