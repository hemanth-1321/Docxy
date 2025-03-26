import { StrictMode } from 'react'
import { AuthProvider } from './context/AuthContext.tsx'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <App />
    </AuthProvider>
)
