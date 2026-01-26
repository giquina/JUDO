import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './lib/auth'
import { ConfirmDialogProvider } from '@/components/ConfirmDialog'
import { AlertDialogProvider } from '@/components/AlertDialog'

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <AuthProvider>
        <ConfirmDialogProvider>
          <AlertDialogProvider>
            <App />
          </AlertDialogProvider>
        </ConfirmDialogProvider>
      </AuthProvider>
    </ConvexProvider>
  </StrictMode>,
)
