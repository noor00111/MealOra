import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { K } from "@/components/chatbot/theme";
import { BowlIcon } from "@/components/chatbot/bowl-icon";

export function LauncherButton({ open, hasUnread, onToggle }: { open: boolean; hasUnread: boolean; onToggle: () => void }) {
  return (
    <motion.button
      onClick={onToggle}
      className="fixed bottom-24 right-4 z-50 size-14 rounded-2xl flex items-center justify-center focus:outline-none"
      whileHover={{ scale: 1.08, rotate: open ? 0 : -5 }}
      whileTap={{ scale: 0.92 }}
      aria-label={open ? "Close chat" : "Open food assistant"}
      style={{
        backgroundColor: K.panel,
        border: `2px solid ${K.amber}`,
        color: K.amber,
        boxShadow: `0 0 28px 0 ${K.amber}45`,
      }}>
        
      <AnimatePresence mode="wait" initial={false}>
        {open ? (
          <motion.span key="x"
            initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.16 }}>
            <X size={20} strokeWidth={2.5} />
          </motion.span>
        ) : (
          <motion.span key="bowl"
            initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.16 }}>
            <BowlIcon size={24} />
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hasUnread && !open && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 size-3.5 rounded-full border-2"
            style={{ backgroundColor: K.amber, borderColor: K.panel }} />
        )}
      </AnimatePresence>
    </motion.button>
  );
}
