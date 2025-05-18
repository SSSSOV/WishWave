import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { WishService } from './wish.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Wish } from './wish.model';

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

    @Get(':id')
    async getWIshById(@Param('id') id: number): Promise<Wish> {
        return this.wishService.findById(id);
    }
}
