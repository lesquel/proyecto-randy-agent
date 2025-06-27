'use client'

import { useQueryState } from 'nuqs'
import type { SessionEntry } from '@/types/playground'
import { Button } from '../../../ui/button'
import useSessionLoader from '@/hooks/useSessionLoader'
import { deletePlaygroundSessionAPI } from '@/api/playground'
import { usePlaygroundStore } from '@/store'
import { toast } from 'sonner'
import Icon from '@/components/ui/icon'
import { useState } from 'react'
import DeleteSessionModal from './DeleteSessionModal'
import useChatActions from '@/hooks/useChatActions'
import { truncateText, cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

type SessionItemProps = SessionEntry & {
  isSelected: boolean
  onSessionClick: () => void
}

const SessionItem = ({
  title,
  session_id,
  isSelected,
  onSessionClick
}: SessionItemProps) => {
  const [agentId] = useQueryState('agent')
  const { getSession } = useSessionLoader()
  const [, setSessionId] = useQueryState('session')
  const { selectedEndpoint, sessionsData, setSessionsData } =
    usePlaygroundStore()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const { clearChat } = useChatActions()

  const handleGetSession = async () => {
    if (agentId) {
      onSessionClick()
      await getSession(session_id, agentId)
      setSessionId(session_id)
    }
  }

  const handleDeleteSession = async () => {
    if (agentId) {
      try {
        const response = await deletePlaygroundSessionAPI(
          selectedEndpoint,
          agentId,
          session_id
        )

        if (response.status === 200 && sessionsData) {
          setSessionsData(
            sessionsData.filter((session) => session.session_id !== session_id)
          )
          clearChat()
          toast.success('Session deleted')
        } else {
          toast.error('Failed to delete session')
        }
      } catch {
        toast.error('Failed to delete session')
      } finally {
        setIsDeleteModalOpen(false)
      }
    }
  }

  return (
    <>
      <motion.div
        className={cn(
          'group relative flex h-14 w-full cursor-pointer items-center justify-between overflow-hidden rounded-xl border border-transparent p-4 transition-all duration-200',
          isSelected
            ? 'border-primary/20 from-primary/10 to-primary/5 cursor-default bg-gradient-to-r shadow-sm'
            : 'bg-card/50 hover:border-border/50 hover:bg-card/70 backdrop-blur-sm hover:shadow-md'
        )}
        onClick={handleGetSession}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        layout
      >
        {/* Background gradient for selected state */}
        {isSelected && (
          <motion.div
            className="from-primary/5 absolute inset-0 bg-gradient-to-r to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Content */}
        <div className="relative flex flex-1 items-center gap-3">
          {/* Session indicator */}
          <motion.div
            className={cn(
              'h-2 w-2 rounded-full transition-colors duration-200',
              isSelected
                ? 'bg-primary shadow-primary/50 shadow-sm'
                : 'bg-muted-foreground/40'
            )}
            animate={{ scale: isSelected ? 1.2 : 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          />

          {/* Session info */}
          <div className="flex flex-1 flex-col gap-1">
            <h4
              className={cn(
                'text-sm font-medium transition-colors duration-200',
                isSelected ? 'text-primary' : 'text-foreground'
              )}
            >
              {truncateText(title, 20)}
            </h4>
            <div className="text-muted-foreground text-xs">
              Session • {session_id.slice(0, 8)}
            </div>
          </div>
        </div>

        {/* Delete button */}
        <AnimatePresence>
          {(isHovering || isSelected) && (
            <motion.div
              className="z-10"
              initial={{ opacity: 0, scale: 0.8, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 10 }}
              transition={{ duration: 0.15 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive h-8 w-8 rounded-lg transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsDeleteModalOpen(true)
                }}
              >
                <Icon type="trash" size="xs" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hover effect overlay */}
        <motion.div
          className="via-primary/5 absolute inset-0 bg-gradient-to-r from-transparent to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: isHovering && !isSelected ? '100%' : '-100%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      </motion.div>

      <DeleteSessionModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteSession}
        isDeleting={false}
      />
    </>
  )
}

export default SessionItem
