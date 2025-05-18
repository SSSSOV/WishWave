import { Body, Controller, Post } from '@nestjs/common';
import { BanService } from './ban.service';
import { BanUserDto } from './dto/ban-user.dto';

@Controller('ban')
export class BanController {
    constructor(private banService: BanService) {}

    @Post()
    banUser(@Body() dto: BanUserDto) {
        return this.banService.banUser(dto.userId, dto.description);
    }
}
