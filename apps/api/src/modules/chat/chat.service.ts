import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async findConversations(tenantId: string, userId: string) {
    return this.prisma.chatConversation.findMany({
      where: { tenantId, participants: { some: { userId } } },
      include: {
        participants: { include: { conversation: false } },
        messages: { orderBy: { sentAt: 'desc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findMessages(conversationId: string) {
    return this.prisma.chatMessage.findMany({
      where: { conversationId },
      include: { sender: { select: { id: true, fullName: true, role: true } } },
      orderBy: { sentAt: 'asc' },
    });
  }

  async sendMessage(data: { conversationId: string; tenantId: string; senderId: string; body: string; imageUrl?: string }) {
    return this.prisma.chatMessage.create({
      data,
      include: { sender: { select: { id: true, fullName: true, role: true } } },
    });
  }

  async createConversation(tenantId: string, participantIds: string[], relatedStudentId?: string) {
    return this.prisma.chatConversation.create({
      data: {
        tenantId,
        relatedStudentId,
        participants: { create: participantIds.map((userId) => ({ userId, role: 'member' })) },
      },
      include: { participants: true },
    });
  }
}
