import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FriendService } from './friend.service';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { FriendResponseDto } from './dto/friend-response.dto';

@UseGuards(JwtAuthGuard)
@Controller('friend')
export class FriendController {
    constructor(private readonly friendService: FriendService) {}

    @Post('request')
    async send(@Body() dto: CreateFriendRequestDto, @Req() req) {
        const fr = await this.friendService.sendRequest(req.user.id, dto.targetUserId);
        const plain = fr.get({plain: true});
        return {id: plain.id, friendStatusId: plain.friendstatusId, createdAt: plain.createdAt, updatedAt: plain.updatedAt, sender: plain.senderUser, recipient: plain.recipientUser};
    }

    @Get('requests/received')
    async received(@Req() req) {
        const rows = await this.friendService.getReceivedRequests(req.user.id);
        return rows.map(fr => {const plain = fr.get({plain: true});
            return {id: plain.id, friendStatusId: plain.friendstatusId, createdAt: plain.createdAt, updatedAt: plain.updatedAt, sender: plain.senderUser, recipient: plain.recipientUser}});
    }

    @Get('requests/sent')
    async sent(@Req() req) {
        const rows = await this.friendService.getSentRequest(req.user.id);
        return rows.map(fr => {const plain = fr.get({plain: true});
            return {id: plain.id, friendStatusId: plain.friendstatusId, createdAt: plain.createdAt, updatedAt: plain.updatedAt, sender: plain.senderUser, recipient: plain.recipientUser}});
    }

    @Patch('request/:requestId/accept')
    async accept(@Param('requestId') id: number, @Req() req) {
        const fr = await this.friendService.acceptedRequest(req.user.id, id);
        const plain = fr.get({plain: true});
        return {id: plain.id, friendStatusId: plain.friendstatusId, createdAt: plain.createdAt, updatedAt: plain.updatedAt, sender: plain.senderUser, recipient: plain.recipientUser};
    }

    @Patch('request/:requestId/reject')
    reject(@Param('requestId') id: string, @Req() req) {
        return this.friendService.rejectRequest(req.user.id, +id);
    }

    @Delete('request/:requestId')
    cancel(@Param('requestId') id: string, @Req() req) {
        return this.friendService.cancelRequest(req.user.id, +id);
    }

    @Get()
    async friends(@Req() req): Promise<FriendResponseDto[]> {
        const userId = req.user.id;
        const rows = await this.friendService.getFriends(userId);

        return rows.map(fr => {
            const { sender, recipient, senderUser, recipientUser } = fr.get({ plain: true }) as any;

            const other = sender === userId ? recipientUser : senderUser;
            if (!other) {
            throw new Error(`Не удалось найти информацию о другом пользователе в дружбе ${fr.id}`);
            }

            const { birthDate, phone, socials, ...rest } = other;
            return rest as FriendResponseDto;
        });
    }

    @Delete(':userId')
    remove(@Param('userId') id: number, @Req() req) {
        const me = req.user.id;
        return this.friendService.unfriendByUserId(me, id);
    }

}
