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
    send(@Body() dto: CreateFriendRequestDto, @Req() req) {
        return this.friendService.sendRequest(req.user.id, dto.targetUserId);
    }

    @Get('requests/received')
    received(@Req() req) {
        return this.friendService.getReceivedRequests(req.user.id);
    }

    @Get('requests/sent')
    sent(@Req() req) {
        return this.friendService.getSentRequest(req.user.id);
    }

    @Patch('request/:requestId/accept')
    accept(@Param('requestId') id: string, @Req() req) {
        console.log('→ accept called. JWT payload:', req.user);
        return this.friendService.acceptedRequest(req.user.id, +id);
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
        const friends = await this.friendService.getFriends(userId);
        return friends.map(u => {
            const plain = (u as any).get({plain: true});
            const {birthDate, phone, socials, ...rest} = plain;
            return rest as FriendResponseDto;
        })
    }

    @Delete(':friendshipId')
    remove(@Param('friendshipId') id: string, @Req() req) {
        return this.friendService.unfriend(req.user.id, +id);
    }

}
