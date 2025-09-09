'use client'
import { useCallback, useEffect, useState } from 'react'

export interface SessionData {
  id: string
  username: string
  createdAt: number
}

const STORAGE_KEY = 'randy_session'

function safeParse(raw: string | null): SessionData | null {
  if (!raw) return null
  try {
    const obj = JSON.parse(raw)
    if (obj && typeof obj.username === 'string') return obj as SessionData
    return null
  } catch {
    return null
  }
}

export function loadSession(): SessionData | null {
  if (typeof window === 'undefined') return null
  return safeParse(localStorage.getItem(STORAGE_KEY))
}

export function useSession() {
  const [session, setSession] = useState<SessionData | null>(null)

  useEffect(() => {
    setSession(loadSession())
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setSession(loadSession())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const save = useCallback((username: string) => {
    const data: SessionData = {
      id:
        typeof crypto !== 'undefined' && (crypto as any).randomUUID
          ? (crypto as any).randomUUID()
          : Math.random().toString(36).slice(2),
      username: username.trim(),
      createdAt: Date.now()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    setSession(data)
    return data
  }, [])

  const clear = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setSession(null)
  }, [])

  return { session, save, clear }
}
