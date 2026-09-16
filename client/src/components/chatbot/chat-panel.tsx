import { motion, AnimatePresence } from "framer-motion";
import { K } from "@/components/chatbot/theme";
import { ChatHeader } from "@/components/chatbot/chat-header";
import { ChatMessages } from "@/components/chatbot/chat-messages";
import { ChatInput } from "@/components/chatbot/chat-input";
import { useChat } from "@/components/chatbot/use-chat";

export function ChatPanel({ chat }: { chat: ReturnType<typeof useChat> }) {
  return (
    <AnimatePresence>
      {chat.open && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
          className="fixed top-36 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-3xl flex flex-col overflow-hidden"
          style={{
            height: "min(590px, calc(100dvh - 160px))",
            backgroundColor: K.panel,
            border: `1px solid ${K.border}`,
            boxShadow: `0 32px 80px 0 rgba(0,0,0,0.65), 0 0 0 1px ${K.border}`,
          }}>
          <ChatHeader
            hasMessages={chat.messages.length > 0}
            onClear={chat.clearChat}
            onClose={() => chat.setOpen(false)}
          />
          <ChatMessages
            messages={chat.messages}
            onSuggestionClick={chat.send}
            bottomRef={chat.bottomRef}
          />
          <ChatInput
            input={chat.input}
            onInputChange={chat.setInput}
            onSend={() => chat.send(chat.input)}
            streaming={chat.streaming}
            inputRef={chat.inputRef}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
