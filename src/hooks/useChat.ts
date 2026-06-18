"use client";

import { useCallback } from "react";
import { useApiData } from "./useApiData";
import * as api from "@/services/api";
import { chatConversations as mockConversations, chatMessages as mockMessages } from "@/data/mock";
import type { ChatConversation, ChatMessage } from "@/types";

export function useChatConversations() {
  const apiFn = useCallback(async (): Promise<ChatConversation[]> => {
    return api.getChatConversations();
  }, []);

  return useApiData<ChatConversation[]>({
    apiFn,
    mockData: mockConversations,
  });
}

export function useChatMessages(conversationId: string) {
  const apiFn = useCallback(async (): Promise<ChatMessage[]> => {
    return api.getChatMessages(conversationId);
  }, [conversationId]);

  const filtered = mockMessages.filter((m) => m.conversationId === conversationId);

  return useApiData<ChatMessage[]>({
    apiFn,
    mockData: filtered,
  });
}
