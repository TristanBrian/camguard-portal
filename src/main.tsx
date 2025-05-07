
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from 'sonner'

// Initialize admin user on app start
import './utils/initAdmin';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster />
      <Sonner position="top-right" richColors closeButton />
    </BrowserRouter>
  </React.StrictMode>,
)
