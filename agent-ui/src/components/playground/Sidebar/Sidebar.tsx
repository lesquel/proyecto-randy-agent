'use client'

import type React from 'react'

import { Button } from '@/components/ui/button'
import { AgentSelector } from '@/components/playground/Sidebar/AgentSelector'
import useChatActions from '@/hooks/useChatActions'
import { usePlaygroundStore } from '@/store'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Icon from '@/components/ui/icon'
import { getProviderIcon } from '@/lib/modelProvider'
import Sessions from './Sessions'
import { isValidUrl } from '@/lib/utils'
import { toast } from 'sonner'
import { useQueryState } from 'nuqs'
import { truncateText } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import NewChatButton from './NewChatButton'
import IconLogo from '../../../assets/bot.png'

const ENDPOINT_PLACEHOLDER = "https://proyecto-randy-agent.onrender.com"

const SidebarHeader = () => (
  <div className="flex items-center gap-3 p-1">
    <div className="from-primary to-primary/80 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br shadow-sm p-[0.1em]">
      <img src={IconLogo.src} alt="icon" className="w-full color-black" />
    </div>
    <div className="flex flex-col">
      <span className="text-foreground text-sm font-semibold">Chat AI+</span>
    </div>
  </div>
)

const ModelDisplay = ({ model }: { model: string }) => (
  <div className="border-border/50 bg-card/50 flex h-11 w-full items-center gap-3 rounded-xl border p-3 text-sm font-medium shadow-sm backdrop-blur-sm">
    <div className="bg-muted flex h-6 w-6 items-center justify-center rounded-md">
      {(() => {
        const icon = getProviderIcon(model)
        return icon ? <Icon type={icon} className="shrink-0" size="xs" /> : null
      })()}
    </div>
    <span className="text-foreground">{model}</span>
  </div>
)

const Endpoint = () => {
  const {
    selectedEndpoint,
    isEndpointActive,
    setSelectedEndpoint,
    setAgents,
    setSessionsData,
    setMessages
  } = usePlaygroundStore()

  const { initializePlayground } = useChatActions()
  const [isEditing, setIsEditing] = useState(false)
  const [endpointValue, setEndpointValue] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isRotating, setIsRotating] = useState(false)
  const [, setAgentId] = useQueryState('agent')
  const [, setSessionId] = useQueryState('session')

  useEffect(() => {
    setEndpointValue(selectedEndpoint)
    setIsMounted(true)
  }, [selectedEndpoint])

  const getStatusColor = (isActive: boolean) =>
    isActive
      ? 'bg-emerald-500 shadow-emerald-500/50'
      : 'bg-red-500 shadow-red-500/50'

  const handleSave = async () => {
    if (!isValidUrl(endpointValue)) {
      toast.error('Please enter a valid URL')
      return
    }

    const cleanEndpoint = endpointValue.replace(/\/$/, '').trim()
    setSelectedEndpoint(cleanEndpoint)
    setAgentId(null)
    setSessionId(null)
    setIsEditing(false)
    setIsHovering(false)
    setAgents([])
    setSessionsData([])
    setMessages([])
  }

  const handleCancel = () => {
    setEndpointValue(selectedEndpoint)
    setIsEditing(false)
    setIsHovering(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const handleRefresh = async () => {
    setIsRotating(true)
    await initializePlayground()
    setTimeout(() => setIsRotating(false), 500)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="bg-primary h-1 w-1 rounded-full"></div>
        <span className="text-primary text-xs font-semibold uppercase tracking-wider">
          Endpoint
        </span>
      </div>

      {isEditing ? (
        <div className="flex w-full items-center gap-2">
          <input
            type="text"
            value={endpointValue}
            onChange={(e) => setEndpointValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-border bg-background text-foreground focus:border-primary focus:ring-primary/20 flex h-11 w-full items-center rounded-xl border px-3 text-sm font-medium shadow-sm focus:outline-none focus:ring-2"
            autoFocus
            placeholder="Enter endpoint URL..."
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            className="hover:bg-primary/10 hover:text-primary h-11 w-11 rounded-xl"
          >
            <Icon type="save" size="xs" />
          </Button>
        </div>
      ) : (
        <div className="flex w-full items-center gap-2">
          <motion.div
            className="border-border/50 bg-card/50 hover:border-primary/50 group relative flex h-11 w-full cursor-pointer items-center justify-between rounded-xl border p-3 shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={() => setIsEditing(true)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <AnimatePresence mode="wait">
              {isHovering ? (
                <motion.div
                  key="endpoint-display-hover"
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="text-primary flex items-center gap-2 text-sm font-medium">
                    <Icon type="edit" size="xxs" />
                    <span>Edit Endpoint</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="endpoint-display"
                  className="absolute inset-0 flex items-center justify-between px-3"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15 }}
                >
                  <span className="text-foreground text-sm font-medium">
                    {isMounted
                      ? truncateText(selectedEndpoint, 21) ||
                        ENDPOINT_PLACEHOLDER
                      : 'http://localhost:7777'}
                  </span>
                  <div
                    className={`h-2 w-2 shrink-0 rounded-full shadow-sm ${getStatusColor(isEndpointActive)}`}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            className="hover:bg-primary/10 hover:text-primary h-11 w-11 rounded-xl"
          >
            <motion.div
              animate={{ rotate: isRotating ? 360 : 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <Icon type="refresh" size="xs" />
            </motion.div>
          </Button>
        </div>
      )}
    </div>
  )
}

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { clearChat, focusChatInput, initializePlayground } = useChatActions()
  const {
    messages,
    selectedEndpoint,
    isEndpointActive,
    selectedModel,
    hydrated,
    isEndpointLoading
  } = usePlaygroundStore()

  const [isMounted, setIsMounted] = useState(false)
  const [agentId] = useQueryState('agent')

  useEffect(() => {
    setIsMounted(true)
    if (hydrated) initializePlayground()
  }, [selectedEndpoint, initializePlayground, hydrated])

  const handleNewChat = () => {
    clearChat()
    focusChatInput()
  }

  return (
    <motion.aside
      className="border-border/50 bg-card/30 font-dmmono relative flex h-screen shrink-0 grow-0 flex-col overflow-hidden border-r px-4 py-4 shadow-xl backdrop-blur-xl"
      initial={{ width: '18rem' }}
      animate={{ width: isCollapsed ? '4rem' : '18rem' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <motion.button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="bg-background/80 hover:bg-background absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon
          type="sheet"
          size="xs"
          className={`transform transition-transform duration-200 ${isCollapsed ? 'rotate-180' : 'rotate-0'}`}
        />
      </motion.button>

      <motion.div
        className="flex w-full flex-col space-y-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{
          opacity: isCollapsed ? 0 : 1,
          x: isCollapsed ? -20 : 0,
          filter: isCollapsed ? 'blur(4px)' : 'blur(0px)'
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{
          pointerEvents: isCollapsed ? 'none' : 'auto'
        }}
      >
        <SidebarHeader />

        <NewChatButton />

        {isMounted && (
          <>
            <Endpoint />

            {isEndpointActive && (
              <AnimatePresence>
                <motion.div
                  className="flex w-full flex-col gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary h-1 w-1 rounded-full"></div>
                      <span className="text-primary text-xs font-semibold uppercase tracking-wider">
                        Agent
                      </span>
                    </div>

                    {isEndpointLoading ? (
                      <div className="flex w-full flex-col gap-3">
                        {Array.from({ length: 2 }).map((_, index) => (
                          <Skeleton
                            key={index}
                            className="bg-muted/50 h-11 w-full rounded-xl"
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <AgentSelector />
                        {selectedModel && agentId && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ModelDisplay model={selectedModel} />
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <Sessions />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            )}
          </>
        )}
      </motion.div>
    </motion.aside>
  )
}

export default Sidebar
