"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Send, Image, Check, CheckCheck, Eye, Clock,
  MessageCircle, User, Paperclip, Lock,
} from "lucide-react";
import { chatConversations, chatMessages, usuarios } from "@/data/mock";
import { useAuth } from "@/context/AuthContext";
import { useTenant } from "@/context/TenantContext";
import { MESSAGE_STATUS_LABELS, ROLE_LABELS } from "@/types";
import type { ChatConversation, ChatMessage, MessageStatus } from "@/types";

const STATUS_ICONS: Record<MessageStatus, { icon: typeof Check; color: string }> = {
  sent: { icon: Check, color: "text-gray-400" },
  delivered: { icon: CheckCheck, color: "text-blue-500" },
  read: { icon: CheckCheck, color: "text-emerald-500" },
};

export default function ChatPage() {
  const { currentUser, hasPermission } = useAuth();
  const { tenant } = useTenant();
  const canChat = hasPermission("chat.enviar");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(chatMessages);
  const [newMessage, setNewMessage] = useState("");
  const [attachImage, setAttachImage] = useState(false);

  const myConversations = useMemo(
    () => chatConversations
      .filter((c) => c.participantIds.includes(currentUser.id) || currentUser.role === "director")
      .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt)),
    [currentUser]
  );

  const selectedConv = myConversations.find((c) => c.id === selectedConvId);

  const convMessages = useMemo(
    () => selectedConvId
      ? localMessages.filter((m) => m.conversationId === selectedConvId).sort((a, b) => a.sentAt.localeCompare(b.sentAt))
      : [],
    [selectedConvId, localMessages]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [convMessages.length]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConvId) return;

    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConvId,
      tenantId: tenant.id,
      senderId: currentUser.id,
      senderName: currentUser.nombreCompleto,
      senderRole: currentUser.role,
      body: newMessage.trim(),
      imageUrl: attachImage ? `/photos/chat_${Date.now()}_compressed.jpg` : null,
      imageCompressed: attachImage,
      status: "sent",
      sentAt: new Date().toISOString(),
      deliveredAt: null,
      readAt: null,
    };

    setLocalMessages([...localMessages, msg]);
    setNewMessage("");
    setAttachImage(false);

    setTimeout(() => {
      setLocalMessages((prev) =>
        prev.map((m) => m.id === msg.id ? { ...m, status: "delivered", deliveredAt: new Date().toISOString() } : m)
      );
    }, 1500);
  }

  function getOtherParticipant(conv: ChatConversation): string {
    const other = conv.participantNames.find((_, i) => conv.participantIds[i] !== currentUser.id);
    return other || conv.participantNames[0];
  }

  function getOtherRole(conv: ChatConversation): string {
    const idx = conv.participantIds.findIndex((id) => id !== currentUser.id);
    return idx >= 0 ? conv.participantRoles[idx] : conv.participantRoles[0];
  }

  if (!canChat && currentUser.role !== "director") {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Lock className="h-12 w-12 text-gray-300" />
        <p className="mt-4 text-lg font-medium text-gray-500">Acceso Restringido</p>
        <p className="mt-1 text-sm text-gray-400">No tiene permisos para acceder al chat.</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      <div className="w-80 shrink-0 rounded-xl border border-gray-200 bg-white flex flex-col">
        <div className="border-b border-gray-200 p-4">
          <h2 className="flex items-center gap-2 text-base font-bold text-gray-900">
            <MessageCircle className="h-5 w-5 text-primary-500" />
            Conversaciones
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {myConversations.length} chats · WebSocket (Socket.io)
          </p>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {myConversations.map((conv) => {
            const other = getOtherParticipant(conv);
            const otherRole = getOtherRole(conv);
            const isSelected = selectedConvId === conv.id;
            return (
              <button key={conv.id} onClick={() => setSelectedConvId(conv.id)}
                className={`flex w-full items-start gap-3 p-4 text-left transition-colors ${
                  isSelected ? "bg-primary-50" : "hover:bg-gray-50"
                }`}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-sm font-bold">
                  {other.split(" ").map(n => n[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900 truncate">{other}</p>
                    {conv.unreadCount > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">{conv.unreadCount}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 capitalize">{otherRole}</p>
                  {conv.relatedStudentName && (
                    <p className="text-xs text-primary-600">Re: {conv.relatedStudentName}</p>
                  )}
                  <p className="mt-0.5 text-xs text-gray-400 truncate">{conv.lastMessagePreview}</p>
                </div>
              </button>
            );
          })}
        </div>
        <div className="border-t border-gray-200 p-3">
          <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2">
            <Lock className="h-3.5 w-3.5 text-emerald-600" />
            <p className="text-xs text-emerald-700">Sin números telefónicos visibles</p>
          </div>
        </div>
      </div>

      <div className="flex-1 rounded-xl border border-gray-200 bg-white flex flex-col">
        {selectedConv ? (
          <>
            <div className="border-b border-gray-200 px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-sm font-bold">
                  {getOtherParticipant(selectedConv).split(" ").map(n => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{getOtherParticipant(selectedConv)}</p>
                  <p className="text-xs text-gray-500">
                    {getOtherRole(selectedConv)}
                    {selectedConv.relatedStudentName && ` · Re: ${selectedConv.relatedStudentName}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                En línea
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {convMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                const statusInfo = STATUS_ICONS[msg.status];
                const StatusIcon = statusInfo.icon;
                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                      isMe ? "bg-primary-600 text-white rounded-br-md" : "bg-gray-100 text-gray-900 rounded-bl-md"
                    }`}>
                      {!isMe && (
                        <p className={`text-xs font-semibold mb-0.5 ${isMe ? "text-primary-200" : "text-primary-600"}`}>
                          {msg.senderName.split(" ").slice(0, 2).join(" ")}
                        </p>
                      )}
                      <p className="text-sm leading-relaxed">{msg.body}</p>
                      {msg.imageUrl && (
                        <div className={`mt-2 rounded-lg border ${isMe ? "border-primary-400 bg-primary-500" : "border-gray-200 bg-white"} p-2`}>
                          <div className="flex items-center gap-2">
                            <Image className="h-4 w-4" />
                            <span className="text-xs">Imagen adjunta</span>
                            {msg.imageCompressed && <span className="text-xs opacity-70">(comprimida)</span>}
                          </div>
                        </div>
                      )}
                      <div className={`mt-1 flex items-center justify-end gap-1 ${isMe ? "text-primary-200" : "text-gray-400"}`}>
                        <span className="text-[10px]">{msg.sentAt.split("T")[1]?.substring(0, 5)}</span>
                        {isMe && <StatusIcon className={`h-3 w-3 ${isMe ? (msg.status === "read" ? "text-emerald-300" : "text-primary-300") : statusInfo.color}`} />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {canChat && (
              <form onSubmit={handleSend} className="border-t border-gray-200 p-3 flex items-center gap-2">
                <button type="button" onClick={() => setAttachImage(!attachImage)}
                  className={`rounded-lg p-2.5 ${attachImage ? "bg-primary-100 text-primary-600" : "text-gray-400 hover:bg-gray-100"}`}>
                  <Paperclip className="h-5 w-5" />
                </button>
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escriba un mensaje..."
                  className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                <button type="submit" disabled={!newMessage.trim()}
                  className="rounded-xl bg-primary-600 p-2.5 text-white hover:bg-primary-700 disabled:opacity-50 active:scale-[0.95]">
                  <Send className="h-5 w-5" />
                </button>
              </form>
            )}

            {attachImage && (
              <div className="border-t border-gray-100 px-4 py-2 bg-primary-50 flex items-center gap-2">
                <Image className="h-4 w-4 text-primary-600" />
                <span className="text-xs text-primary-700">Imagen adjunta (se comprimirá automáticamente antes de enviar)</span>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <MessageCircle className="h-16 w-16 text-gray-200" />
            <p className="mt-4 text-lg font-medium text-gray-400">Seleccione una conversación</p>
            <p className="mt-1 text-sm text-gray-300">Los mensajes se transmiten en tiempo real via WebSocket</p>
          </div>
        )}
      </div>
    </div>
  );
}
