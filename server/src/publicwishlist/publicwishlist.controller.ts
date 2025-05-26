import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateWishDto } from 'src/wish/dto/create-wish.dto';
import { WishService } from 'src/wish/wish.service';
import { CreateWishlistDto } from 'src/wishlist/dto/create-wishlist.dto';
import { WishlistService } from 'src/wishlist/wishlist.service';

@Controller('publicwishlist')
export class PublicwishlistController {
    constructor(private readonly wishListService: WishlistService, private readonly wishService: WishService) {}

    @Post()
    async createPublic(@Body() dto: CreateWishlistDto) {
        const list = await this.wishListService.create(dto, null);
        return {id: list.id, token: list.shareToken};
    }

    @Get(':id')
    async getPublic(@Param('id', ParseIntPipe) id: number, @Query('token') shareToken?: string) {
        try {
            const wl = await this.wishListService.getFullById(null, id, shareToken);
            const plain = wl.get({plain: true}) as any;
            return plain;
        } catch (e) {
            if (e instanceof ForbiddenException) {
                throw new ForbiddenException('Нужен корректный токен для просмотра этого списка');
            }
            throw e;
        }
    }

    @Patch(':id')
    async upddatePublic(@Param('id', ParseIntPipe) id: number, @Query('token') shareToken: string, @Body() dto: Partial<CreateWishlistDto>) {
        if (!shareToken) {
            throw new BadRequestException('Требует параметр token')
        }

        const canEdit = await this.wishListService.canEditWishList(id, null, shareToken);
        if (!canEdit) {
            throw new ForbiddenException('Неверный токен для редактирования')
        }
        return this.wishListService.update(id, dto);
    }

    @Post(':id/wishes')
    @UseInterceptors(FileInterceptor('image', {limits: { fileSize: 2 * 1024 * 1024 }}))
    async addWishPublic(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateWishDto, @UploadedFile() image: Express.Multer.File, @Query('token') shareToken: string) {
        if (!shareToken) {
            throw new BadRequestException('Требуется параметр token')
        }

        console.log('addWishPublic.canEdit', { id, shareToken });
        
        const canEdit = await this.wishListService.canEditWishList(id, null, shareToken);
        if (!canEdit) {
            throw new ForbiddenException('Неверный токен для добавления желания')
        }

        const wish = await this.wishService.create(dto, null, id);
        return wish;
    }

    @Patch(':listId/wishes/:wishId')
    async updateWishPublic(@Param('listId') listId: number, @Param('wishId') wishId: number, @Body() dto: CreateWishDto, @Query('token') token?: string) {
        if (!token) {
            throw new BadRequestException('Требуется параметр токен')
        }
        
        const canEdit = await this.wishListService.canEditWishList(listId, null, token);
        if(!canEdit) {
            throw new ForbiddenException('Неверный токен для редактирования списка')
        }
        return this.wishListService.update(wishId, dto);
    }

    @Delete(':listId/wishes/:wishId')
    async removeWishPublic(@Param('listId') listId: number, @Param('wishId') wishId: number, @Query('token') token?: string) {
        if (!token) {
            throw new BadRequestException('Требуется параметр токен')
        }

        const canEdit = await this.wishListService.canEditWishList(listId, null, token);
        if (!canEdit) {
            throw new ForbiddenException('Неверный токен для редактирования списка')
        }
        return this.wishService.delete(wishId);
    }
}
