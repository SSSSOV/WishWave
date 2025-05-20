import { Body, Controller, Delete, ForbiddenException, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
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
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) wishlistId: number, @Body() dto: Partial<CreateWishlistDto>, @Req() req) {
        const userId = req.user.id;
        if (!(await this.wishListService.isOwner(userId, wishlistId))) {
            throw new ForbiddenException('Только владелец может редактировать список')
        }
        return this.wishListService.update(wishlistId, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) wishlistId: number, @Req() req) {
        const userId = req.user.id;
        if (!(await this.wishListService.isOwner(userId, wishlistId))) {
            throw new ForbiddenException('Только владелец может удалить список')
        }
        return this.wishListService.remove(wishlistId);
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
