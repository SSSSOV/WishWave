import { Body, Controller, ForbiddenException, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateWishlistDto } from './dto/create-wishlist.dto';

@Controller('wishlist')
export class WishlistController {
    constructor(private readonly wishListService: WishlistService) {}
    
    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() dto: CreateWishlistDto, @Req() req) {
        const userId = req.user.id;
        return this.wishListService.create(dto, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll(@Req() req) {
        const userId = req.user.id;
        return this.wishListService.getAllByUser(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOne(@Param('id') id: number, @Req() req) {
        const wishlistId = id;
        const shareToken = req.query.token as string | undefined;
        const userId = req.user?.id ?? null;
        
        const can = await this.wishListService.canAccessWishList(userId, wishlistId, shareToken);
        if (!can) {
            throw new ForbiddenException('Доступ к списку запрещен')
        }

        return this.wishListService.getWishesByListId(userId, wishlistId);
    }
}
