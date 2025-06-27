"use client"

import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"
import useChatActions from "@/hooks/useChatActions"
import { usePlaygroundStore } from "@/store"
import { motion } from "framer-motion"

function NewChatButton() {
  const { clearChat } = useChatActions()
  const { messages } = usePlaygroundStore()

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button
        className="group relative z-10 h-12 w-full cursor-pointer overflow-hidden rounded-xl bg-gradient-to-r from-brand to-brand/90 px-6 py-3 font-semibold text-primary shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-brand/25 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-lg"
        onClick={clearChat}
        disabled={messages.length === 0}
      >
        {/* Background gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand/80 to-brand opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Content */}
        <div className="relative flex items-center justify-center gap-3">
          <span className="text-sm font-medium tracking-wide">New Chat</span>

          {/* Icon container with subtle animation */}
          <motion.div
            className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 backdrop-blur-sm"
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Icon type="plus-icon" size="xs" className="text-primary" />
          </motion.div>
        </div>

        {/* Subtle shine effect */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
      </Button>
    </motion.div>
  )
}

export default NewChatButton
