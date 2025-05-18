import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { WishService } from './wish.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Wish } from './wish.model';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

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

    @Patch(':id')
    async updateWish(@Param('id') id: number, @Body() dto: Partial<CreateWishDto>): Promise<Wish> {
        return this.wishService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/book')
    bookWish(@Param('id', ParseIntPipe) wishId: number,@Req() req) {
        const userId = req.user['id'];
        return this.wishService.bookWish(wishId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/unbook/')
    unbookWish(@Param('id', ParseIntPipe) wishId: number, @Req() req) {
        const userId = req.user['id'];
        return this.wishService.unbookWish(wishId, userId);
    }
}