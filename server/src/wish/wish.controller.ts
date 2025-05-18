import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { WishService } from './wish.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('wish')
export class WishController {

    constructor(private wishService: WishService) {}

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    createWish(@Body() dto: CreateWishDto, @UploadedFile() image) {
        return this.wishService.create(dto, image)
    }

    @Get()
    getAllWishes() {
        return this.wishService.getAll();
    }
}
