import { RotateCcw, X, Zap } from "lucide-react";
import { K } from "@/components/chatbot/theme";
import { BowlIcon } from "@/components/chatbot/bowl-icon";

export function ChatHeader({ hasMessages, onClear, onClose }: { hasMessages: boolean; onClear: () => void; onClose: () => void }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 shrink-0"
      style={{ backgroundColor: K.surface, borderBottom: `1px solid ${K.border}` }}>
      
      <div className="size-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: K.card, color: K.amber, border: `1px solid ${K.border}` }}>
        <BowlIcon size={24} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-base font-black tracking-tight leading-tight" style={{ color: K.text }}>
          MealOra Assistant
        </p>
        <span className="inline-flex items-center gap-1 text-xs leading-tight mt-0.5" style={{ color: K.muted }}>
          <Zap size={11} style={{ color: K.amber }} />
          AI · meals, deals &amp; kitchens
        </span>

      </div>
      {hasMessages && (
        <button onClick={onClear} title="Clear chat"
          className="size-8 rounded-lg flex items-center justify-center transition-colors"
          style={{ color: K.muted }}
          onMouseEnter={e => (e.currentTarget.style.color = K.text)}
          onMouseLeave={e => (e.currentTarget.style.color = K.muted)}>
          <RotateCcw size={14} />
        </button>
      )}
      
      <button onClick={onClose} title="Close"
        className="size-8 rounded-lg flex items-center justify-center transition-colors"
        style={{ color: K.muted }}
        onMouseEnter={e => (e.currentTarget.style.color = K.text)}
        onMouseLeave={e => (e.currentTarget.style.color = K.muted)}>
        <X size={16} strokeWidth={2.4} />
      </button>
    </div>
  );
}
