"use client"

import { usePlaygroundStore } from "@/store"
import Messages from "./Messages"
import ScrollToBottom from "@/components/playground/ChatArea/ScrollToBottom"
import { StickToBottom } from "use-stick-to-bottom"
import { motion } from "framer-motion"

const MessageArea = () => {
  const { messages } = usePlaygroundStore()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-1 flex-col overflow-hidden"
    >
      <StickToBottom
        className="relative mb-4 flex max-h-[calc(100vh-64px)] min-h-0 flex-grow flex-col"
        resize="smooth"
        initial="smooth"
      >
        <StickToBottom.Content className="flex min-h-full flex-col justify-center">
          {/* Enhanced scrollable area with custom scrollbar */}
          <div className="mx-auto w-full max-w-2xl space-y-8 px-4 pb-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/50 [&::-webkit-scrollbar-thumb:hover]:bg-border/80">
            <Messages messages={messages} />
          </div>
        </StickToBottom.Content>

        {/* Enhanced scroll to bottom with better positioning */}
        <ScrollToBottom />

        {/* Gradient fade at bottom */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background/80 to-transparent" />
      </StickToBottom>
    </motion.div>
  )
}

export default MessageArea
