import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { WishService } from './wish.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Wish } from './wish.model';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { WishlistService } from 'src/wishlist/wishlist.service';
import { where } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { WishListWish } from 'src/wishlist/wishlist-wish.model';

@Controller('wish')
export class WishController {

    constructor(private wishService: WishService, private wishlistService: WishlistService, @InjectModel(WishListWish) private wishListWishRepository: typeof WishListWish) {}

    @UseGuards(JwtAuthGuard)
    @Post(':listId/wishes')
    @UseInterceptors(FileInterceptor('image'))
    async createWishInList(@Param('listId', ParseIntPipe) listId: number, @Body() dto: CreateWishDto, @UploadedFile() image: Express.Multer.File, @Req() req) {
        const userId = req.user.id;
        const canAccess = await this.wishlistService.canAccessWishList(userId, listId);

        if (!canAccess) {
            throw new ForbiddenException('У вас нет прав доступа к добавлению желания в этот список')
        }

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
    async bookWish(@Param('id', ParseIntPipe) wishId: number,@Req() req) {
        const userId = req.user['id'];
        const record = await this.wishListWishRepository.findOne({where: {wishId}});
        if (!record) {
            throw new NotFoundException('Желание не найдено в списках');
        }
        
        const shareToken = req.query.token as string | undefined;
        const can = await this.wishlistService.canAccessWishList(userId, record.wishlistId, shareToken);
        if (!can) {
            throw new ForbiddenException('Нет доступа к бронироваю этого желания');
        }
        return this.wishService.bookWish(wishId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/unbook/')
    async unbookWish(@Param('id', ParseIntPipe) wishId: number, @Req() req) {
        const userId = req.user?.id ?? null;
        const record = await this.wishListWishRepository.findOne({where: {wishId}});
        if(!record) {
            throw new NotFoundException('Желание не найдено в списках');
        }
        const wishlistId = record.wishlistId;

        const shareToken = req.query.token as string | undefined;

        const can = await this.wishlistService.canAccessWishList(userId, record.wishlistId, shareToken);
        if (!can) {
            throw new ForbiddenException('Нет доступа к бронироваю этого желания');
        } 

        return this.wishService.unbookWish(wishId, userId);
    }
}