'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from '@/hooks/useSession'
import { useEffect, useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import ThemeToggle from '@/components/ui/ThemeToggle'

const links = [
  { href: '/inicio', label: 'Inicio' },
  { href: '/', label: 'Chat' }
]

export default function Navbar() {
  const { session, clear } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const goAuth = (target: 'login' | 'register') => router.push(`/${target}`)
  const initials = useMemo(() => {
    if (!session?.username) return ''
    return session.username.slice(0, 2).toUpperCase()
  }, [session])

  return (
    <nav className="border-border/60 from-background/80 to-background/60 sticky top-0 z-40 w-full border-b bg-gradient-to-b backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="relative select-none text-lg font-semibold tracking-tight"
          >
            <span className="from-primary bg-gradient-to-r via-teal-400 to-fuchsia-500 bg-clip-text text-transparent">
              Chat AI
            </span>
            <span className="bg-primary pointer-events-none absolute -bottom-1 left-0 h-[2px] w-0 transition-all group-hover:w-full" />
          </Link>
          <div className="flex items-center gap-1">
            {links.map((l) => {
              const active = pathname === l.href
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'} hover:bg-accent/40`}
                >
                  {active && (
                    <span className="from-primary/20 to-primary/10 ring-primary/30 absolute inset-0 -z-10 rounded-md bg-gradient-to-r ring-1" />
                  )}
                  {l.label}
                </Link>
              )
            })}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {mounted && session ? (
            <>
              <div className="flex items-center gap-3">
                <div className="from-primary text-primary-foreground ring-background relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br via-indigo-500 to-fuchsia-500 text-xs font-semibold shadow ring-2">
                  {initials}
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-muted-foreground text-xs">
                    Conectado
                  </span>
                  <span className="text-sm font-medium">
                    {session.username}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clear}
                className="text-xs text-red-500 hover:text-red-600"
              >
                Cerrar sesión
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goAuth('login')}
                className="text-xs"
              >
                Iniciar sesión
              </Button>
              <Button
                size="sm"
                onClick={() => goAuth('register')}
                className="from-primary bg-gradient-to-r to-fuchsia-500 text-xs hover:opacity-90"
              >
                Registro
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
