import { Body, Controller, Delete, ForbiddenException, Get, Param, ParseIntPipe, Post, Req } from '@nestjs/common';
import { BanService } from './ban.service';
import { BanUserDto } from './dto/ban-user.dto';

@Controller('ban')
export class BanController {
    constructor(private readonly banService: BanService) {}

    private ensureAdmin(req: any) {
        if (req.user.roles !== 'admin') {
            throw new ForbiddenException('У вас нет прав выдавать баны');
        }
    }

    @Post()
    async banUser(@Body() dto: BanUserDto, @Req() req) {
        this.ensureAdmin(req);
        return this.banService.banUser(dto.userId, dto.description);
    }

    @Delete(':id')
    async unbanUser(@Param('id', ParseIntPipe) banId: number, @Req() req) {
        this.ensureAdmin(req);
        return this.banService.unbanUser(banId);
    }

    @Get()
    async getAllBans(@Req() req) {
        this.ensureAdmin(req);
        return this.banService.getAllBans();
    }

    @Get(':id')
    async getBanById(@Param('id', ParseIntPipe) banId: number, @Req() req) {
        this.ensureAdmin(req);
        return this.banService.getBanById(banId);
    }
}
