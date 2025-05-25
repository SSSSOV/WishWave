import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { DuplicateWishDto } from './dto/duplicate-wish.dto';

@Controller('wishlist')
export class WishlistController {
    constructor(private readonly wishListService: WishlistService) {}
    
    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() dto: CreateWishlistDto, @Req() req) {
        const userId = req.user.id;
        const list = await this.wishListService.create(dto, userId);

        const plain = list.get({plain: true}) as any;
        if (plain.shareToken) {
            plain.shareToken = `${req.protocol}://${req.get('host')}/api/wishlist/${plain.id}?token=${plain.shareToken}`;
        }
        return plain;
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll(@Req() req) {
        const userId = req.user.id;
        const lists = await this.wishListService.getAllByUser(userId);

        return lists.map(list => {const plain = list.get({plain: true}) as any;
            if (plain.accesslevelId === 3 && plain.shareToken){
                plain.shareToken = `${req.protocol}://${req.get('host')}/api/wishlist/${plain.id}?token=${plain.shareToken}`;
            }
            return plain;
        });
    }

    @UseGuards(JwtAuthGuard)
    @Patch('duplicate')
    async duplicateWish(@Body() dto: DuplicateWishDto, @Req() req) {
        const userId = req.user.id;
        return this.wishListService.duplicate(userId, dto.wishId, dto.targetListId);
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
    @Patch(':targetListId/copy/:wishId')
    async copyWish(@Param('targetListId', ParseIntPipe) targetListId: number, @Param('wishId', ParseIntPipe) wishId: number, @Req() req) {
        const userId = req.user.id;
        await this.wishListService.copyToList(userId, wishId, targetListId);
        return {message: `Желание ${wishId} скопировано в список ${targetListId}`};
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
        const userId = req.user.id as number;
        const shareToken = req.query.token as string | undefined;

        const wishlist = await this.wishListService.getFullById(userId, id, shareToken);
        const plain = wishlist.get({plain: true});
        if (plain.accesslevelId ===3 && plain.shareToken) {
            plain.shareToken = `${req.protocol}://${req.get('host')}/api/wishlist/${plain.id}?token=${plain.shareToken}`;
        }

        return plain;
    }

    @UseGuards(JwtAuthGuard)
    @Get('friend/:friendId/search')
    async searchFriendLists(@Param('friendId', ParseIntPipe) friendId: number, @Query('name') name: string, @Req() req) {
        if(!name) {
            throw new BadRequestException('Укажите параметр name')
        }

        const requesterId = req.user.id as number;
        const lists = await this.wishListService.searchFriendLists(requesterId, friendId, name);

        return lists.map(list => {const plain = list.get({plain:true}) as any;
            if (plain.accesslevelId === 3 && plain.shareToken) {
                plain.shareToken = `${req.protocol}://${req.get('host')}/api/wishlist/${plain.id}?token=${plain.shareToken}`;
            }
            return plain;    
        })
    }

}
