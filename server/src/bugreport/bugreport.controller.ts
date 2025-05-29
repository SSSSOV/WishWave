import { Body, Controller, ForbiddenException, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
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
        const {id, title, description, email, userId: uid, createdAt} = br.get({plain:true});

        return {id, title, description, email, ...(uid != null && uid !== null ? {userId: uid} : {}), createdAt};
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findMine(@Req() req): Promise<BugReportResponseDto[]> {
        const userId = req.user.id;
        const rows = await this.bugService.findByUser(userId);
        
        return rows.map(br => {const {id, title, description, email, userId, createdAt} = br.get({plain: true});
            return {id, title, description, email, ...(userId != null && {userId}), createdAt} as BugReportResponseDto});
    }

    @Get('all')
    @UseGuards(JwtAuthGuard)
    async findAll(@Req() req): Promise<BugReportResponseDto[]> {
        if (req.user.roles?.value !== 'admin') {
            throw new ForbiddenException('Нет прав для просмотра всех багрепортов')
        }

        const rows = await this.bugService.findAll();
        return rows.map(br => {const {id, title, description, email, userId, createdAt} = br.get({plain: true});
            return {id, title, description, email, ...(userId != null && {userId}), createdAt} as BugReportResponseDto});
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id') id: number, @Body() dto: UpdateBugReportDto, @Req() req): Promise<BugReportResponseDto> {
        const userId = req.user.id;
        const updated = await this.bugService.update(id, dto, userId);
        const p = updated.get({plain:true}) as any;
        
        return {id: p.id, title: p.title, description: p.description, email: p.email, ...(p.userId != null ? {userId: p.userId} : {}), createdAt: p.createdAt, updatedAt: p.updatedAt};
    }

}
