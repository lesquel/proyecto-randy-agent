'use client'

import ChatInput from './ChatInput'
import MessageArea from './MessageArea'
import Icon from '@/components/ui/icon'

interface ChatAreaProps {
  onOpenMobileSidebar?: () => void
}

const ChatArea = ({ onOpenMobileSidebar }: ChatAreaProps) => {
  return (
    <main className="relative flex flex-1 flex-col md:ml-0">
      {/* Mobile top bar */}
      <div className="flex items-center gap-2 border-b border-border/40 bg-background/80 px-3 py-2 backdrop-blur-sm md:hidden">
        <button
          onClick={onOpenMobileSidebar}
          aria-label="Abrir menú"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/40 bg-card/60 shadow-sm"
        >
          <Icon type="sheet" size="xs" />
        </button>
        <span className="text-sm font-medium text-foreground">Chat</span>
      </div>

      <div className="relative flex flex-1 flex-col overflow-hidden">
        <MessageArea />
      </div>
      <div className="sticky bottom-0 z-10 px-3 pb-2 pt-1 md:px-6">
        <ChatInput />
      </div>
    </main>
  )
}

export default ChatArea
