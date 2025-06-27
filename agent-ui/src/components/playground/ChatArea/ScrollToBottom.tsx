"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useStickToBottomContext } from "use-stick-to-bottom"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"

const ScrollToBottom: React.FC = () => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext()

  return (
    <AnimatePresence>
      {!isAtBottom && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
            type: "spring",
            stiffness: 400,
            damping: 25,
          }}
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              onClick={() => scrollToBottom()}
              type="button"
              size="icon"
              className="group relative h-12 w-12 overflow-hidden rounded-full border border-border/50 bg-background/95 backdrop-blur-sm text-primary shadow-lg transition-all duration-300 hover:border-primary/30 hover:bg-background hover:shadow-xl"
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Icon with bounce animation */}
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="relative z-10"
              >
                <Icon type="arrow-down" size="sm" className="text-primary" />
              </motion.div>

              {/* Ripple effect */}
              <div className="absolute inset-0 rounded-full bg-primary/20 opacity-0 transition-opacity duration-300 group-active:opacity-100" />
            </Button>
          </motion.div>

          {/* Subtle tooltip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-popover/95 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-popover-foreground shadow-md"
          >
            Scroll to bottom
            <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-popover/95" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ScrollToBottom
