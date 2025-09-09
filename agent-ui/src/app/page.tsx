"use client"
import Sidebar from '@/components/playground/Sidebar/Sidebar'
import { ChatArea } from '@/components/playground/ChatArea'
import { Suspense, useState, useEffect } from 'react'

// Basic breakpoint matcher to auto-close mobile sidebar on resize > md
const useIsMdUp = () => {
  const [mdUp, setMdUp] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setMdUp(!!e.matches)
    handler(mq)
    mq.addEventListener('change', handler as any)
    return () => mq.removeEventListener('change', handler as any)
  }, [])
  return mdUp
}

export default function Home() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const isMdUp = useIsMdUp()

  // Close mobile sidebar when resizing to desktop
  useEffect(() => {
    if (isMdUp && mobileSidebarOpen) setMobileSidebarOpen(false)
  }, [isMdUp, mobileSidebarOpen])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="relative flex h-dvh max-h-dvh w-full overflow-hidden bg-background/80">
        {/* Sidebar */}
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        {/* Mobile overlay */}
        {mobileSidebarOpen && (
          <button
            aria-label="Cerrar menú"
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm md:hidden"
          />
        )}

        <ChatArea onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />
      </div>
    </Suspense>
  )
}
