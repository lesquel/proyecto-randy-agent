'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/hooks/useSession'

export default function LoginPage() {
  const { session, save } = useSession()
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [ok, setOk] = useState(false)

  useEffect(() => {
    if (session) router.replace('/')
  }, [session, router])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (username.trim().length < 3) {
      setError('Mínimo 3 caracteres')
      return
    }
    save(username)
    setOk(true)
    setTimeout(() => router.push('/'), 400)
  }

  return (
    <main className="relative mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5 py-10">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_30%,hsl(var(--primary)/0.15),transparent_60%),radial-gradient(circle_at_70%_70%,hsl(var(--accent)/0.25),transparent_55%)]" />
      <div className="bg-background/60 w-full overflow-hidden rounded-xl border p-6 shadow-lg backdrop-blur-md">
        <div className="mb-6 space-y-1 text-center">
          <h1 className="from-primary bg-gradient-to-r via-teal-400 to-fuchsia-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
            Iniciar sesión
          </h1>
          <p className="text-muted-foreground text-xs">
            Accede con tu nombre local (no usamos servidor)
          </p>
        </div>
        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="text-muted-foreground text-xs font-medium uppercase tracking-wide"
            >
              Usuario
            </label>
            <div className="relative">
              <input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-background/70 focus:border-primary focus:bg-background/90 peer w-full rounded-md border px-3 py-2 text-sm shadow-sm outline-none ring-0 transition"
                placeholder="tu-nombre"
                autoComplete="username"
              />
              <span className="text-muted-foreground/60 pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-[10px]">
                local
              </span>
            </div>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          {ok && <p className="text-xs text-green-500">Sesión iniciada...</p>}
          <button
            type="submit"
            className="from-primary text-primary-foreground focus:ring-primary group relative w-full overflow-hidden rounded-md bg-gradient-to-r via-indigo-500 to-fuchsia-500 px-4 py-2 text-sm font-medium shadow transition hover:scale-[1.01] focus:outline-none focus:ring-2"
          >
            <span className="relative z-10">Entrar</span>
            <span className="absolute inset-0 -z-0 bg-white opacity-0 transition group-hover:opacity-20" />
          </button>
          <p className="text-muted-foreground text-center text-[11px]">
            ¿No tienes cuenta?{' '}
            <a
              className="text-primary font-medium underline-offset-4 hover:underline"
              href="/register"
            >
              Regístrate
            </a>
          </p>
        </form>
      </div>
    </main>
  )
}
