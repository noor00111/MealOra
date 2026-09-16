"use client";

import { usePathname } from "next/navigation";
import { LauncherButton } from "@/components/chatbot/launcher-button";
import { ChatPanel } from "@/components/chatbot/chat-panel";
import { useChat } from "@/components/chatbot/use-chat";

export function Chatbot() {
  const pathname = usePathname();
  const chat = useChat();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) return null;

  return (
    <>
      <LauncherButton
        open={chat.open}
        hasUnread={chat.hasUnread}
        onToggle={() => chat.setOpen((v) => !v)}
      />
      <ChatPanel chat={chat} />
    </>
  );
}
