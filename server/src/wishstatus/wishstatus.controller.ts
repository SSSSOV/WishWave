import { Body, Controller, Delete, ForbiddenException, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { WishstatusService } from './wishstatus.service';
import { CreateWishStatusDto } from './dto/create-wishstatus.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateWishStatusDto } from './dto/update-wishstatus.dto';

@Controller('wishstatus')
@UseGuards(JwtAuthGuard)
export class WishstatusController {
    constructor(private readonly wishStatusService: WishstatusService) {}

    private ensureAdmin(req: any){
        if (req.user.roles?.value !== 'admin') {
            throw new ForbiddenException('У вас нет прав для этой операции')
        }
    }

    @Post()
    create(@Body() dto: CreateWishStatusDto, @Req() req) {
        this.ensureAdmin(req);
        return this.wishStatusService.create(dto);
    }

    @Get()
    getAll(@Req() req) {
        this.ensureAdmin(req);
        return this.wishStatusService.getAll();
    }

    @Get(':id')
    getById(@Param('id', ParseIntPipe) id: number, @Req() req) {
        this.ensureAdmin(req);
        return this.wishStatusService.getById(id);
    }

    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateWishStatusDto, @Req() req) {
        this.ensureAdmin(req);
        return this.wishStatusService.update(id, dto);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
        this.ensureAdmin(req);
        await this.wishStatusService.remove(id);
        return {message: `Статус удален`};
    }
}
