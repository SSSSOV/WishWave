import { Controller, ForbiddenException, Get, Req, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('stats')
export class StatsController {
    constructor(private readonly statsService: StatsService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getTotals(@Req() req) {
        const role = req.user.roles?.value;
        if (role !== 'admin') {
            throw new ForbiddenException('У вас нет прав для просмотра общей статистика')
        }

        return this.statsService.getTotals();
    }

}
