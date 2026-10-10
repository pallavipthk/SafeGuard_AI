import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App'
import useThemeStore from './store/themeStore'
import './index.css'

const queryClient = new QueryClient()

const saved = localStorage.getItem('theme') || 'dark'
if (saved === 'dark') {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}
useThemeStore.getState().initTheme()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster position="top-right" toastOptions={{
          className: 'glass-card',
          style: { background: 'var(--glass-bg)', color: 'var(--text-primary)', backdropFilter: 'blur(20px)' }
        }} />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
