import { RefObject } from "react";
import { Send } from "lucide-react";
import { K } from "@/components/chatbot/theme";

export function ChatInput({input, onInputChange, onSend, streaming, inputRef}: {input: string; onInputChange: (value: string) => void; onSend: () => void; streaming: boolean; inputRef: RefObject<HTMLTextAreaElement | null>;}) {
  
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) 
      { e.preventDefault(); onSend(); }
  }

  return (
    <div className="px-4 py-3 shrink-0" style={{ backgroundColor: K.surface, borderTop: `1px solid ${K.border}` }}>
      <div className="flex items-end gap-2 rounded-xl px-4 py-2.5 transition-all"
        style={{ backgroundColor: K.panel, border: `1px solid ${K.border}` }}>
       
        <textarea ref={inputRef} value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What are you craving?"
          rows={1} disabled={streaming}
          className="flex-1 resize-none bg-transparent text-base outline-none disabled:opacity-50 max-h-28"
          style={{ color: K.text, lineHeight: "1.5" }} />

        <button onClick={onSend}
          disabled={!input.trim() || streaming}
          className="size-9 rounded-xl flex items-center justify-center shrink-0 transition-all disabled:opacity-30"
          style={{ backgroundColor: K.amber, color: K.panel }}
          aria-label="Send">
          <Send size={15} strokeWidth={2.2} />
        </button>
      </div>

      <p className="text-xs text-center mt-2" style={{ color: K.muted }}>
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}
