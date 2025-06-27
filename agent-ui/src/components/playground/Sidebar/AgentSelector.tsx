'use client'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'
import { usePlaygroundStore } from '@/store'
import { useQueryState } from 'nuqs'
import Icon from '@/components/ui/icon'
import { useEffect } from 'react'
import useChatActions from '@/hooks/useChatActions'
import { motion, AnimatePresence } from 'framer-motion'

export function AgentSelector() {
  const { agents, setMessages, setSelectedModel, setHasStorage } =
    usePlaygroundStore()
  const { focusChatInput } = useChatActions()

  const [agentId, setAgentId] = useQueryState('agent', {
    parse: (value) => value || undefined,
    history: 'push'
  })

  const [, setSessionId] = useQueryState('session')

  // Set the model when the component mounts if an agent is already selected
  useEffect(() => {
    if (agentId && agents.length > 0) {
      const agent = agents.find((agent) => agent.value === agentId)
      if (agent) {
        setSelectedModel(agent.model.provider || '')
        setHasStorage(!!agent.storage)
        if (agent.model.provider) {
          focusChatInput()
        }
      } else {
        setAgentId(agents[0].value)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentId, agents, setSelectedModel])

  const handleOnValueChange = (value: string) => {
    const newAgent = value === agentId ? '' : value
    const selectedAgent = agents.find((agent) => agent.value === newAgent)

    setSelectedModel(selectedAgent?.model.provider || '')
    setHasStorage(!!selectedAgent?.storage)
    setAgentId(newAgent)
    setMessages([])
    setSessionId(null)

    if (selectedAgent?.model.provider) {
      focusChatInput()
    }
  }

  const selectedAgent = agents.find((agent) => agent.value === agentId)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Select
        value={agentId || ''}
        onValueChange={(value) => handleOnValueChange(value)}
      >
        <SelectTrigger className="border-border/50 bg-card/50 hover:border-primary/50 hover:bg-card/70 focus:border-primary focus:ring-primary/20 group h-12 w-full rounded-xl border px-4 py-3 text-sm font-medium shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md focus:ring-2">
          <div className="flex items-center gap-3">
            {/* Agent icon with subtle animation */}
            {/* <motion.div
              className="bg-primary/10 group-hover:bg-primary/15 flex h-7 w-7 items-center justify-center rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Icon type="agent" size="xs" className="text-primary" />
            </motion.div> */}

            {/* Selected value with better typography */}
            <SelectValue
              placeholder={
                <span className="text-muted-foreground">Select Agent</span>
              }
              className="text-foreground"
            />
          </div>

          {/* Custom chevron with rotation animation */}
          <motion.div
            className="ml-auto"
            animate={{ rotate: 0 }}
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.2 }}
          >
            <Icon
              type="chevron-down"
              size="xs"
              className="text-muted-foreground"
            />
          </motion.div>
        </SelectTrigger>

        <SelectContent className="border-border/50 bg-card/95 font-dmmono border shadow-xl backdrop-blur-xl">
          <AnimatePresence>
            {agents.map((agent, index) => (
              <motion.div
                key={`${agent.value}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <SelectItem
                  className="hover:bg-primary/10 focus:bg-primary/10 group cursor-pointer rounded-lg px-3 py-3 transition-all duration-200"
                  value={agent.value}
                >
                  <div className="flex items-center gap-3">
                    {/* Agent icon */}
                    <div className="bg-primary/10 group-hover:bg-primary/20 flex h-6 w-6 items-center justify-center rounded-md transition-colors duration-200">
                      <Icon type="agent" size="xs" className="text-primary" />
                    </div>

                    {/* Agent label with better typography */}
                    <span className="text-foreground text-sm font-medium">
                      {agent.label}
                    </span>

                    {/* Selected indicator */}
                    {agentId === agent.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-primary ml-auto h-2 w-2 rounded-full shadow-sm"
                      />
                    )}
                  </div>
                </SelectItem>
              </motion.div>
            ))}
          </AnimatePresence>

          {agents.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <SelectItem
                value="no-agents"
                className="cursor-not-allowed select-none py-4 text-center"
                disabled
              >
                <div className="text-muted-foreground flex flex-col items-center gap-2">
                  <span className="text-sm">No agents found</span>
                </div>
              </SelectItem>
            </motion.div>
          )}
        </SelectContent>
      </Select>

      {/* Selected agent info display */}
      <AnimatePresence>
        {selectedAgent && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 overflow-hidden"
          >
            <div className="bg-muted/50 rounded-lg px-3 py-2">
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <div className="bg-primary h-1 w-1 rounded-full" />
                <span>Selected: {selectedAgent.label}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
