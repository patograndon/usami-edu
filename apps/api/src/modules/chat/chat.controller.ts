import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('chat')
export class ChatController {
  constructor(private svc: ChatService) {}

  @Get('conversations')
  findConversations(@CurrentUser('tenantId') tenantId: string, @CurrentUser('userId') userId: string) {
    return this.svc.findConversations(tenantId, userId);
  }

  @Get('conversations/:id/messages')
  findMessages(@Param('id') id: string) {
    return this.svc.findMessages(id);
  }

  @Post('conversations/:id/messages')
  sendMessage(@Param('id') id: string, @Body() body: { body: string; imageUrl?: string }, @CurrentUser('tenantId') tenantId: string, @CurrentUser('userId') userId: string) {
    return this.svc.sendMessage({ conversationId: id, tenantId, senderId: userId, body: body.body, imageUrl: body.imageUrl });
  }

  @Post('conversations')
  createConversation(@Body() body: { participantIds: string[]; relatedStudentId?: string }, @CurrentUser('tenantId') tenantId: string) {
    return this.svc.createConversation(tenantId, body.participantIds, body.relatedStudentId);
  }
}
