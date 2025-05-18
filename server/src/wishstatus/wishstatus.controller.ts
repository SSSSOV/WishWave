import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { WishstatusService } from './wishstatus.service';
import { CreateWishStatusDto } from './dto/create-wishstatus.dto';

@Controller('wishstatus')
export class WishstatusController {
    constructor(private readonly wishStatusService: WishstatusService) {}

    @Post()
    create(@Body() dto: CreateWishStatusDto) {
        return this.wishStatusService.create(dto);
    }

    @Get()
    getAll() {
        return this.wishStatusService.getAll();
    }

    @Get(':id')
    getById(@Param('id', ParseIntPipe) id: number) {
        return this.wishStatusService.getById(id);
    }
}
