import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { WishService } from './wish.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Wish } from './wish.model';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AccessGuard } from 'src/accesslevel/access.guard';

@Controller('wish')
export class WishController {

    constructor(private wishService: WishService) {}

    @UseGuards(JwtAuthGuard, AccessGuard)
    @Post(':listId/wishes')
    @UseInterceptors(FileInterceptor('image'))
    createWishInList(@Param('listId', ParseIntPipe) listId: number, @Body() dto: CreateWishDto, @UploadedFile() image: Express.Multer.File, @Req() req) {
        return this.wishService.create(dto, image, listId)
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAllWishes() {
        return this.wishService.getAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getWIshById(@Param('id') id: number): Promise<Wish> {
        return this.wishService.findById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async updateWish(@Param('id') id: number, @Body() dto: Partial<CreateWishDto>): Promise<Wish> {
        return this.wishService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteWish(@Param('id', ParseIntPipe) id: number) {
        await this.wishService.delete(id);
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