import { motion } from "framer-motion";
import { K } from "@/components/chatbot/theme";

export function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 h-5">
      {[0, 1, 2].map((i) => (
        <motion.span key={i}
          style={{ backgroundColor: K.amber }}
          className="size-2 rounded-full"
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.7, delay: i * 0.15, repeat: Infinity }} />
      ))}
    </span>
  );
}
