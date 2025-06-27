'use client'

import { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { usePlaygroundStore } from '@/store'
import { useQueryState } from 'nuqs'
import SessionItem from './SessionItem'
import SessionBlankState from './SessionBlankState'
import useSessionLoader from '@/hooks/useSessionLoader'
import { cn } from '@/lib/utils'
import type { FC } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { motion, AnimatePresence } from 'framer-motion'

interface SkeletonListProps {
  skeletonCount: number
}

const SkeletonList: FC<SkeletonListProps> = ({ skeletonCount }) => {
  const skeletons = useMemo(
    () => Array.from({ length: skeletonCount }, (_, i) => i),
    [skeletonCount]
  )

  return (
    <div className="space-y-3">
      {skeletons.map((skeleton, index) => (
        <motion.div
          key={skeleton}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Skeleton
            className={cn(
              'from-muted/50 to-muted/30 h-14 w-full rounded-xl bg-gradient-to-r',
              index % 2 === 0 && 'from-muted/30 to-muted/50'
            )}
          />
        </motion.div>
      ))}
    </div>
  )
}

dayjs.extend(utc)

const formatDate = (
  timestamp: number,
  format: 'natural' | 'full' = 'full'
): string => {
  const date = dayjs.unix(timestamp).utc()
  return format === 'natural'
    ? date.format('HH:mm')
    : date.format('YYYY-MM-DD HH:mm:ss')
}

const Sessions = () => {
  const [agentId] = useQueryState('agent', {
    parse: (value) => value || undefined,
    history: 'push'
  })

  const [sessionId] = useQueryState('session')

  const {
    selectedEndpoint,
    isEndpointActive,
    isEndpointLoading,
    sessionsData,
    hydrated,
    hasStorage,
    setSessionsData
  } = usePlaygroundStore()

  const [isScrolling, setIsScrolling] = useState(false)
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  )

  const { getSession, getSessions } = useSessionLoader()
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  const { isSessionsLoading } = usePlaygroundStore()

  const handleScroll = () => {
    setIsScrolling(true)

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false)
    }, 1500)
  }

  // Cleanup the scroll timeout when component unmounts
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  // Load a session on render if a session id exists in url
  useEffect(() => {
    if (sessionId && agentId && selectedEndpoint && hydrated) {
      getSession(sessionId, agentId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated])

  useEffect(() => {
    if (!selectedEndpoint || !agentId || !hasStorage) {
      setSessionsData(() => null)
      return
    }

    if (!isEndpointLoading) {
      setSessionsData(() => null)
      getSessions(agentId)
    }
  }, [
    selectedEndpoint,
    agentId,
    getSessions,
    isEndpointLoading,
    hasStorage,
    setSessionsData
  ])

  useEffect(() => {
    if (sessionId) {
      setSelectedSessionId(sessionId)
    }
  }, [sessionId])

  const formattedSessionsData = useMemo(() => {
    if (!sessionsData || !Array.isArray(sessionsData)) return []

    return sessionsData.map((entry) => ({
      ...entry,
      created_at: entry.created_at,
      formatted_time: formatDate(entry.created_at, 'natural')
    }))
  }, [sessionsData])

  const handleSessionClick = useCallback(
    (id: string) => () => setSelectedSessionId(id),
    []
  )

  if (isSessionsLoading || isEndpointLoading)
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <div className="mb-4 flex items-center gap-2">
          <div className="bg-primary h-1 w-1 rounded-full"></div>
          <span className="text-primary text-xs font-semibold uppercase tracking-wider">
            Sessions
          </span>
        </div>

        <div className="bg-card/30 h-[calc(100vh-325px)] w-full overflow-hidden rounded-xl p-4">
          <SkeletonList skeletonCount={5} />
        </div>
      </motion.div>
    )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="bg-primary h-1 w-1 rounded-full"></div>
        <span className="text-primary text-xs font-semibold uppercase tracking-wider">
          Sessions
        </span>
        {formattedSessionsData.length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-primary/20 text-primary ml-auto flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium"
          >
            {formattedSessionsData.length}
          </motion.div>
        )}
      </div>

      <div
        className={cn(
          'bg-card/20 font-geist h-[calc(100vh-345px)] overflow-y-auto rounded-xl p-2 backdrop-blur-sm transition-all duration-300',
          // Custom scrollbar styling
          '[&::-webkit-scrollbar]:w-2',
          '[&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent',
          '[&::-webkit-scrollbar-thumb]:bg-border/50 [&::-webkit-scrollbar-thumb]:rounded-full',
          '[&::-webkit-scrollbar-thumb:hover]:bg-border/80',
          isScrolling
            ? '[&::-webkit-scrollbar]:opacity-100'
            : '[&::-webkit-scrollbar]:opacity-0'
        )}
        onScroll={handleScroll}
        onMouseEnter={() => setIsScrolling(true)}
        onMouseLeave={handleScroll}
      >
        {!isEndpointActive ||
        !hasStorage ||
        (!isSessionsLoading && (!sessionsData || sessionsData.length === 0)) ? (
          <SessionBlankState />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, staggerChildren: 0.05 }}
            className="space-y-2 pr-1"
          >
            <AnimatePresence>
              {formattedSessionsData.map((entry, index) => (
                <motion.div
                  key={`${entry.session_id}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  layout
                >
                  <SessionItem
                    {...entry}
                    isSelected={selectedSessionId === entry.session_id}
                    onSessionClick={handleSessionClick(entry.session_id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default Sessions
