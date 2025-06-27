import type { PlaygroundChatMessage } from '@/types/playground'
import { AgentMessage, UserMessage } from './MessageItem'
import Tooltip from '@/components/ui/tooltip'
import { memo } from 'react'
import type {
  ToolCallProps,
  ReasoningStepProps,
  ReasoningProps,
  ReferenceData,
  Reference
} from '@/types/playground'
import type { FC } from 'react'
import ChatBlankState from './ChatBlankState'
import Icon from '@/components/ui/icon'

interface MessageListProps {
  messages: PlaygroundChatMessage[]
}

interface MessageWrapperProps {
  message: PlaygroundChatMessage
  isLastMessage: boolean
}

interface ReferenceProps {
  references: ReferenceData[]
}

interface ReferenceItemProps {
  reference: Reference
}

const ReferenceItem: FC<ReferenceItemProps> = ({ reference }) => (
  <div className="border-border/50 bg-card/50 hover:border-primary/30 hover:bg-card/70 group relative flex h-16 w-48 cursor-default flex-col justify-between overflow-hidden rounded-xl border p-4 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md">
    {/* Subtle gradient overlay */}
    <div className="from-primary/5 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

    <div className="relative z-10 space-y-1">
      <p className="text-foreground line-clamp-1 text-sm font-semibold">
        {reference.name}
      </p>
      <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
        {reference.content}
      </p>
    </div>

    {/* Corner accent */}
    <div className="bg-primary/20 absolute -right-1 -top-1 h-3 w-3 rounded-full opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
  </div>
)

const References: FC<ReferenceProps> = ({ references }) => (
  <div className="flex flex-col gap-6">
    {references.map((referenceData, index) => (
      <div
        key={`${referenceData.query}-${index}`}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-wrap gap-3">
          {referenceData.references.map((reference, refIndex) => (
            <ReferenceItem
              key={`${reference.name}-${reference.meta_data.chunk}-${refIndex}`}
              reference={reference}
            />
          ))}
        </div>
      </div>
    ))}
  </div>
)

const AgentMessageWrapper = ({ message }: MessageWrapperProps) => {
  return (
    <div className="flex flex-col gap-8">
      {message.extra_data?.reasoning_steps &&
        message.extra_data.reasoning_steps.length > 0 && (
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 shadow-sm backdrop-blur-sm">
              <Tooltip
                delayDuration={0}
                content={<p className="text-accent">Reasoning</p>}
                side="top"
              >
                <Icon type="reasoning" size="sm" className="text-blue-600" />
              </Tooltip>
            </div>

            <div className="flex flex-1 flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-blue-500" />
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Reasoning
                </p>
              </div>
              <Reasonings reasoning={message.extra_data.reasoning_steps} />
            </div>
          </div>
        )}

      {message.extra_data?.references &&
        message.extra_data.references.length > 0 && (
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 shadow-sm backdrop-blur-sm">
              <Tooltip
                delayDuration={0}
                content={<p className="text-accent">References</p>}
                side="top"
              >
                <Icon type="references" size="sm" className="text-green-600" />
              </Tooltip>
            </div>

            <div className="flex flex-1 flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-green-500" />
                <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
                  References
                </p>
              </div>
              <References references={message.extra_data.references} />
            </div>
          </div>
        )}

      {message.tool_calls && message.tool_calls.length > 0 && (
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 shadow-sm backdrop-blur-sm">
            <Tooltip
              delayDuration={0}
              content={<p className="text-accent">Tool Calls</p>}
              side="top"
            >
              <Icon type="hammer" size="sm" className="text-orange-600" />
            </Tooltip>
          </div>

          <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-orange-500" />
              <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                Tool Calls
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {message.tool_calls.map((toolCall, index) => (
                <ToolComponent
                  key={
                    toolCall.tool_call_id ||
                    `${toolCall.tool_name}-${toolCall.created_at}-${index}`
                  }
                  tools={toolCall}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <AgentMessage message={message} />
    </div>
  )
}

const Reasoning: FC<ReasoningStepProps> = ({ index, stepTitle }) => (
  <div className="flex items-center gap-3">
    <div className="bg-muted/60 flex h-7 min-w-fit items-center rounded-lg px-3 shadow-sm backdrop-blur-sm">
      <p className="text-muted-foreground text-xs font-medium">
        STEP {index + 1}
      </p>
    </div>
    <p className="text-foreground text-sm font-medium leading-relaxed">
      {stepTitle}
    </p>
  </div>
)

const Reasonings: FC<ReasoningProps> = ({ reasoning }) => (
  <div className="flex flex-col gap-3">
    {reasoning.map((title, index) => (
      <Reasoning
        key={`${title.title}-${title.action}-${index}`}
        stepTitle={title.title}
        index={index}
      />
    ))}
  </div>
)

const ToolComponent = memo(({ tools }: ToolCallProps) => (
  <div className="border-border/50 bg-card/50 hover:border-primary/30 hover:bg-card/70 group cursor-default rounded-xl border px-4 py-2.5 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-md">
    <p className="font-dmmono text-foreground text-sm font-medium">
      {tools.tool_name}
    </p>

    {/* Subtle indicator */}
    <div className="from-primary/50 mt-1.5 h-0.5 w-full rounded-full bg-gradient-to-r to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
  </div>
))

ToolComponent.displayName = 'ToolComponent'

const Messages = ({ messages }: MessageListProps) => {
  if (messages.length === 0) {
    return <ChatBlankState />
  }

  return (
    <div className="space-y-8">
      {messages.map((message, index) => {
        const key = `${message.role}-${message.created_at}-${index}`
        const isLastMessage = index === messages.length - 1

        if (message.role === 'agent') {
          return (
            <AgentMessageWrapper
              key={key}
              message={message}
              isLastMessage={isLastMessage}
            />
          )
        }

        return <UserMessage key={key} message={message} />
      })}
    </div>
  )
}

export default Messages
