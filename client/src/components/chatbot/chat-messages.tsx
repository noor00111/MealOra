import { RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { K } from "@/components/chatbot/theme";
import { BowlIcon } from "@/components/chatbot/bowl-icon";
import { TypingDots } from "@/components/chatbot/typing-dots";
import { SUGGESTIONS } from "@/components/chatbot/suggestions";
import { Message } from "@/types/chat";

export function ChatMessages({messages, onSuggestionClick, bottomRef}: {messages: Message[]; onSuggestionClick: (text: string) => void; bottomRef: RefObject<HTMLDivElement | null>;}) {
  const isEmpty = messages.length === 0;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4" style={{ backgroundColor: K.panel }}>
      
      {isEmpty ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center h-full gap-5 text-center px-2">
          <div className="size-20 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: K.card, color: K.amber, border: `2px solid ${K.amber}35` }}>
            <BowlIcon size={42} />
          </div>
          
          <div>
            <p className="text-xl font-black leading-tight" style={{ color: K.text }}>
              Hey, hungry? 👋
            </p>
            <p className="text-base mt-2 leading-relaxed" style={{ color: K.muted }}>
              Tell me what you&apos;re craving — I&apos;ll find the perfect meal.
            </p>
          </div>

          <div className="w-full flex flex-col gap-2">
            {SUGGESTIONS.map(({ text, icon: Icon }) => (
              <button key={text} onClick={() => onSuggestionClick(text)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-150"
                style={{ backgroundColor: K.surface, border: `1px solid ${K.border}` }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = K.amber + "55")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = K.border)}>
                <Icon size={15} style={{ color: K.amber, flexShrink: 0 }} />
                <span className="text-sm font-medium" style={{ color: K.text }}>{text}</span>
              </button>
            ))}
          </div>
        </motion.div>
      ) : (
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start gap-3"}`}>

              {msg.role === "assistant" && (
                <div className="size-8 rounded-lg flex items-center justify-center shrink-0 mt-1"
                  style={{ backgroundColor: K.card, color: K.amber, border: `1px solid ${K.border}` }}>
                  <BowlIcon size={15} />
                </div>
              )}

              {msg.role === "assistant" ? (
                <div className="max-w-[84%] rounded-2xl rounded-tl-sm overflow-hidden flex"
                  style={{ backgroundColor: K.card, border: `1px solid ${K.border}` }}>
                  <div className="w-[3px] shrink-0" style={{ backgroundColor: K.amber }} />
                  <div className="px-4 py-3">
                    {msg.content === "" ? <TypingDots /> : (
                      <p className="text-base leading-relaxed whitespace-pre-wrap" style={{ color: K.text }}>
                        {msg.content}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-br-sm"
                  style={{ backgroundColor: K.primary, color: "#fff" }}>
                  <p className="text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
