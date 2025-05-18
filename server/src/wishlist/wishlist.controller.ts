import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateWishDto } from 'src/wish/dto/create-wish.dto';

@Controller('wishlist')
export class WishlistController {
    constructor(private readonly wishListService: WishlistService) {}
    
    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() dto: CreateWishDto, @Req() req) {
        const userId = req.user.id;
        return this.wishListService.create(dto, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll(@Req() req) {
        const userId = req.user.id;
        return this.wishListService.getAllByUser(userId);
    }
}
