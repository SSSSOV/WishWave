import { Body, Controller, Post } from '@nestjs/common';
import { WishstatusService } from './wishstatus.service';
import { CreateWishStatusDto } from './dto/create-wishstatus.dto';

@Controller('wishstatus')
export class WishstatusController {
    constructor(private readonly wishStatusService: WishstatusService) {}

    @Post()
    create(@Body() dto: CreateWishStatusDto) {
        return this.wishStatusService.create(dto);
    }

}
