import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { BugreportService } from './bugreport.service';
import { CreateBugReportDto } from './dto/create-bugreport.dto';
import { BugReportResponseDto } from './dto/bugreport-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/auth/optional-jwt-auth.guard';
import { UpdateBugReportDto } from './dto/update-bugreport.dto';

@Controller('bugreport')
export class BugreportController {
    constructor(private readonly bugService: BugreportService) {}

    @UseGuards(OptionalJwtAuthGuard)
    @Post()
    async create(@Body() dto: CreateBugReportDto, @Req() req): Promise<BugReportResponseDto> {
        const userId = req.user?.id ?? null;
        const br = await this.bugService.create(dto, userId);
        const full = await this.bugService.findById(br.id);
        const p = full.get({plain: true}) as any;
        const owner = p.user ? {id: p.user.id, fullname: p.user.fullname, login: p.user.login, image: p.user.image} : null;

        return {id: p.id, title: p.title, description: p.description, email: p.email, owner, createdAt: p.createdAt, updatedAt: p.updatedAt};
    }

    @Get('all')
    @UseGuards(JwtAuthGuard)
    async findAll(@Req() req): Promise<BugReportResponseDto[]> {
        if (req.user.roles?.value !== 'admin') {
            throw new ForbiddenException('Нет прав для просмотра всех багрепортов')
        }

        const rows = await this.bugService.findAll();
        return rows.map(br => {const p = br.get({plain: true}) as any;
            const owner = p.user ? {id: p.user.id, fullname: p.user.fullname, login: p.user.login, image: p.user.image} : null;
                return {id: p.id, title: p.title, description: p.description, email: p.email, owner, createdAt: p.createdAt, updatedAt: p.updatedAt};})
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findMine(@Req() req): Promise<BugReportResponseDto[]> {
        const userId = req.user.id;
        const rows = await this.bugService.findByUser(userId);
        
        return rows.map(br => {const p = br.get({plain: true}) as any;
            const owner = p.user ? {id: p.user.id, fullname: p.user.fullname, login: p.user.login, image: p.user.image} : null;
                return {id: p.id, title: p.title, description: p.description, email: p.email, owner, createdAt: p.createdAt, updatedAt: p.updatedAt};})
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getOne(@Param('id') id: number, @Req() req): Promise<BugReportResponseDto> {
        const userId = req.user.id;
        const role = req.user.roles?.value;
        const br = await this.bugService.findById(id);
        if (br.userId !== userId && role !== 'admin') {
            throw new ForbiddenException('Нет парв на просмотр этого списка')
        }

        const p = br.get({plain: true}) as any;
        const owner = p.user ? {id: p.user.id, fullname: p.user.fullname, login: p.user.login, image: p.user.image} : null;

        return {id: p.id, title: p.title, description: p.description, email: p.email, owner, createdAt: p.createdAt, updatedAt: p.updatedAt};
    }


    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id') id: number, @Body() dto: UpdateBugReportDto, @Req() req): Promise<BugReportResponseDto> {
        const userId = req.user.id;
        const updated = await this.bugService.update(id, dto, userId);
        const p = updated.get({plain:true}) as any;
        const owner = p.user ? {id: p.user.id, fullname: p.user.fullname, login: p.user.login, image: p.user.image} : null;

        return {id: p.id, title: p.title, description: p.description, email: p.email, owner, createdAt: p.createdAt, updatedAt: p.updatedAt};
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: number, @Req() req): Promise<{message: string}> {
        const userId = req.user.id;
        const role = req.user.roles?.value;
        const br = await this.bugService.findById(id);
        if (br.userId !== userId && role !== 'admin') {
            throw new ForbiddenException('Нет прав на удаление этого баг-репорта');
        }

        await this.bugService.remove(id);
        return {message: 'Баг репорт удален'};
    }

}
