'use client'
import { useEffect, useState } from 'react'

export default function SWRegister() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const register = async () => {
        try {
          const reg =
            await navigator.serviceWorker.register('/service-worker.js')
          setReady(true)
          // Optional: listen for updates
          reg.addEventListener('updatefound', () => {
            const installing = reg.installing
            if (installing) {
              installing.addEventListener('statechange', () => {
                if (
                  installing.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  console.log('[PWA] New content available, reload to update.')
                }
              })
            }
          })
        } catch (e) {
          console.warn('[PWA] SW registration failed', e)
        }
      }
      // Small delay to not block TTI
      setTimeout(register, 300)
    }
  }, [])

  return <span className="sr-only">SW {ready ? 'ready' : 'loading'}</span>
}
