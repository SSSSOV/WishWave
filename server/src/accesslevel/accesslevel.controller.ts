import { Body, Controller, Delete, ForbiddenException, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AccesslevelService } from './accesslevel.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateAccessLevelDto } from './dto/update-accesslevel.dto';

@Controller('accesslevel')
@UseGuards(JwtAuthGuard)
export class AccesslevelController {
    constructor(private readonly accessLevelService: AccesslevelService) {}

    private ensureAdmin(req: any) {
        if (req.user.roles?.value !== 'admin') {
            throw new ForbiddenException('У вас нет прав для этой операции')
        }
    }

    @Post()
    async createLevel(@Body('name') name: string, @Req() req) {
        this.ensureAdmin(req);
        return this.accessLevelService.create(name);
    }

    @Get()
    async findAll(@Req() req) {
        this.ensureAdmin(req);
        return this.accessLevelService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
        this.ensureAdmin(req);
        return this.accessLevelService.findById(id);
    }

    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAccessLevelDto, @Req() req) {
        this.ensureAdmin(req);
        return this.accessLevelService.update(id, dto.name);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
        this.ensureAdmin(req);
        return this.accessLevelService.remove(id);
    }
}
