"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  MessageCircle, X, Minus, Send, Check, CheckCheck,
  Paperclip, Image, ChevronLeft, Lock,
} from "lucide-react";
import { chatConversations, chatMessages, usuarios } from "@/data/mock";
import { useAuth } from "@/context/AuthContext";
import { useTenant } from "@/context/TenantContext";
import type { ChatConversation, ChatMessage, MessageStatus } from "@/types";

const STATUS_ICONS: Record<MessageStatus, { icon: typeof Check; color: string }> = {
  sent: { icon: Check, color: "text-gray-400" },
  delivered: { icon: CheckCheck, color: "text-blue-400" },
  read: { icon: CheckCheck, color: "text-emerald-400" },
};

export default function ChatWidget() {
  const { currentUser, hasPermission } = useAuth();
  const { tenant } = useTenant();
  const canChat = hasPermission("chat.enviar") || currentUser.role === "director";
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(chatMessages);
  const [newMessage, setNewMessage] = useState("");

  const myConversations = useMemo(
    () => chatConversations
      .filter((c) => c.participantIds.includes(currentUser.id) || currentUser.role === "director")
      .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt)),
    [currentUser]
  );

  const totalUnread = myConversations.reduce((s, c) => s + c.unreadCount, 0);

  const selectedConv = myConversations.find((c) => c.id === selectedConvId);

  const convMessages = useMemo(
    () => selectedConvId
      ? localMessages.filter((m) => m.conversationId === selectedConvId).sort((a, b) => a.sentAt.localeCompare(b.sentAt))
      : [],
    [selectedConvId, localMessages]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [convMessages.length, isOpen]);

  if (!canChat) return null;

  function getOtherName(conv: ChatConversation): string {
    const idx = conv.participantIds.findIndex((id) => id !== currentUser.id);
    return idx >= 0 ? conv.participantNames[idx] : conv.participantNames[0];
  }

  function getOtherRole(conv: ChatConversation): string {
    const idx = conv.participantIds.findIndex((id) => id !== currentUser.id);
    return idx >= 0 ? conv.participantRoles[idx] : conv.participantRoles[0];
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConvId) return;
    const msg: ChatMessage = {
      id: `msg-w-${Date.now()}`,
      conversationId: selectedConvId,
      tenantId: tenant.id,
      senderId: currentUser.id,
      senderName: currentUser.nombreCompleto,
      senderRole: currentUser.role,
      body: newMessage.trim(),
      imageUrl: null,
      imageCompressed: false,
      status: "sent",
      sentAt: new Date().toISOString(),
      deliveredAt: null,
      readAt: null,
    };
    setLocalMessages([...localMessages, msg]);
    setNewMessage("");
    setTimeout(() => {
      setLocalMessages((prev) =>
        prev.map((m) => m.id === msg.id ? { ...m, status: "delivered", deliveredAt: new Date().toISOString() } : m)
      );
    }, 1200);
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => { setIsOpen(true); setIsMinimized(false); }}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 active:scale-95 transition-all"
      >
        <MessageCircle className="h-6 w-6" />
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {totalUnread}
          </span>
        )}
      </button>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-primary-600 pl-4 pr-2 py-2 text-white shadow-lg cursor-pointer hover:bg-primary-700 transition-all"
        onClick={() => setIsMinimized(false)}>
        <MessageCircle className="h-4 w-4" />
        <span className="text-sm font-medium">Chat</span>
        {totalUnread > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold">{totalUnread}</span>
        )}
        <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); setSelectedConvId(null); }}
          className="rounded-full p-1 hover:bg-primary-500"><X className="h-3.5 w-3.5" /></button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex h-[480px] w-[360px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between bg-primary-600 px-4 py-3 text-white">
        {selectedConv ? (
          <div className="flex items-center gap-2">
            <button onClick={() => setSelectedConvId(null)} className="rounded p-0.5 hover:bg-primary-500">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div>
              <p className="text-sm font-semibold leading-tight">{getOtherName(selectedConv)}</p>
              <p className="text-[10px] text-primary-200">
                {getOtherRole(selectedConv)}
                {selectedConv.relatedStudentName && ` · ${selectedConv.relatedStudentName}`}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm font-semibold">Chat</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <button onClick={() => setIsMinimized(true)} className="rounded p-1 hover:bg-primary-500"><Minus className="h-4 w-4" /></button>
          <button onClick={() => { setIsOpen(false); setSelectedConvId(null); }} className="rounded p-1 hover:bg-primary-500"><X className="h-4 w-4" /></button>
        </div>
      </div>

      {!selectedConv ? (
        <div className="flex-1 overflow-y-auto">
          {myConversations.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-400">Sin conversaciones</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {myConversations.map((conv) => {
                const other = getOtherName(conv);
                return (
                  <button key={conv.id} onClick={() => setSelectedConvId(conv.id)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs font-bold">
                      {other.split(" ").map(n => n[0]).slice(0, 2).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900 truncate">{other}</p>
                        {conv.unreadCount > 0 && (
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[9px] font-bold text-white">{conv.unreadCount}</span>
                        )}
                      </div>
                      {conv.relatedStudentName && (
                        <p className="text-[10px] text-primary-500">Re: {conv.relatedStudentName}</p>
                      )}
                      <p className="text-xs text-gray-400 truncate">{conv.lastMessagePreview}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          <div className="border-t border-gray-100 px-3 py-2">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
              <Lock className="h-3 w-3" />
              <span>Mensajes auditables · WebSocket en tiempo real</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {convMessages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              const si = STATUS_ICONS[msg.status];
              const StatusIcon = si.icon;
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                    isMe ? "bg-primary-600 text-white rounded-br-sm" : "bg-gray-100 text-gray-900 rounded-bl-sm"
                  }`}>
                    {!isMe && (
                      <p className="text-[10px] font-semibold text-primary-600 mb-0.5">
                        {msg.senderName.split(" ").slice(0, 2).join(" ")}
                      </p>
                    )}
                    <p className="text-[13px] leading-relaxed">{msg.body}</p>
                    {msg.imageUrl && (
                      <div className={`mt-1.5 flex items-center gap-1.5 rounded px-2 py-1 ${isMe ? "bg-primary-500" : "bg-gray-200"}`}>
                        <Image className="h-3 w-3" />
                        <span className="text-[10px]">Imagen{msg.imageCompressed ? " (comprimida)" : ""}</span>
                      </div>
                    )}
                    <div className={`mt-0.5 flex items-center justify-end gap-0.5 ${isMe ? "text-primary-200" : "text-gray-400"}`}>
                      <span className="text-[9px]">{msg.sentAt.split("T")[1]?.substring(0, 5)}</span>
                      {isMe && <StatusIcon className={`h-2.5 w-2.5 ${isMe && msg.status === "read" ? "text-emerald-300" : ""}`} />}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="border-t border-gray-200 flex items-center gap-1.5 px-3 py-2">
            <button type="button" className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
              <Paperclip className="h-4 w-4" />
            </button>
            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Mensaje..."
              className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
            <button type="submit" disabled={!newMessage.trim()}
              className="rounded-lg bg-primary-600 p-1.5 text-white hover:bg-primary-700 disabled:opacity-40 active:scale-95">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </>
      )}
    </div>
  );
}
