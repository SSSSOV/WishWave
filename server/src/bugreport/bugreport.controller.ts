import { Body, Controller, ForbiddenException, Get, Post, Req, UseGuards } from '@nestjs/common';
import { BugreportService } from './bugreport.service';
import { CreateBugReportDto } from './dto/create-bugreport.dto';
import { BugReportResponseDto } from './dto/bugreport-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/auth/optional-jwt-auth.guard';

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

}
