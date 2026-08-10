import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '../App'
import AdminPanelScreen from './screens/AdminPanelScreen'
import './index.css'

// Render admin panel when URL contains ?admin or hash #admin
const isAdmin =
  window.location.search.includes('admin') ||
  window.location.hash === '#admin'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isAdmin ? <AdminPanelScreen /> : <App />}
  </React.StrictMode>,
)
