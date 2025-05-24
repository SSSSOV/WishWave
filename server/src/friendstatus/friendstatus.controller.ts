import { Body, Controller, Delete, ForbiddenException, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FriendstatusService } from './friendstatus.service';
import { CreateFriendStatusDto } from './dto/create-friend-status.dto';
import { UpdateFriendStatusDto } from './dto/update-friend-status.dto';

@Controller('friendstatus')
@UseGuards(JwtAuthGuard)
export class FriendstatusController {
    constructor(private readonly friendstatusService: FriendstatusService) {}

    private ensureAdmin(req: any) {
        if (req.user.roles?.value !== 'admin') {
            throw new ForbiddenException('У вас нет прав для этой операции')
        }
    }

    @Post()
    create(@Body() dto: CreateFriendStatusDto, @Req() req) {
        this.ensureAdmin(req);
        return this.friendstatusService.create(dto);
    }

    @Get()
    getAll(@Req() req) {
        this.ensureAdmin(req);
        return this.friendstatusService.getAll();
    }

    @Get(':id')
    getById(@Param('id', ParseIntPipe) id: number, @Req() req) {
        this.ensureAdmin(req);
        return this.friendstatusService.getById(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFriendStatusDto, @Req() req) {
        this.ensureAdmin(req);
        return this.friendstatusService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
        this.ensureAdmin(req);
        return this.friendstatusService.remove(id);
    }
}
