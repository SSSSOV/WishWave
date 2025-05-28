import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { WishService } from './wish.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { WishlistService } from 'src/wishlist/wishlist.service';
import { InjectModel } from '@nestjs/sequelize';
import { WishListWish } from 'src/wishlist/wishlist-wish.model';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishIdDto } from './dto/wish-id.dto';
import { FUllWIshDto } from './dto/full-wish.dto';

@Controller('wish')
export class WishController {

    constructor(private wishService: WishService, private wishlistService: WishlistService, @InjectModel(WishListWish) private wishListWishRepository: typeof WishListWish) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('image', {limits: {fileSize: 2 * 1024 * 1024}}))
    async createWishInList(@Body() dto: CreateWishDto, @UploadedFile() image: Express.Multer.File, @Req() req) {
        const userId = req.user.id;
        if (!(await this.wishlistService.isOwner(userId, dto.listId))) {
            throw new ForbiddenException('Только владелец списка может добавлять в него желания');
        }

        return this.wishService.createFullWish(dto, image, dto.listId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllWishes(@Req() req) {
        const userId = req.user.id;
        const ownLists = await this.wishlistService.getAllByUser(userId);
        const listIds = ownLists.map(l => l.id);
        return this.wishService.findAllFullByListIds(listIds, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('booked')
    async getBooked(@Req() req): Promise<FUllWIshDto[]> {
        const userId = req.user.id;

        return this.wishService.getBookedFullByUser(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getWIshById(@Param('id') wishId: number, @Req() req, @Query('token') shareToken?: string | undefined): Promise<FUllWIshDto> {
        const userId = req.user.id;
        return this.wishService.getFullWishById(wishId, userId, shareToken)
    }
    

    @UseGuards(JwtAuthGuard)
    @Patch()
    @UseInterceptors(FileInterceptor('image', {limits: {fileSize: 2 * 1024 * 1024}}))
    async updateWish(@UploadedFile() image: Express.Multer.File, @Body() dto: UpdateWishDto, @Req() req): Promise<FUllWIshDto> {
        const userId = req.user.id;
        const {id} = dto;
        const record = await this.wishListWishRepository.findOne({where: {wishId: id}});
        if (!record) {
            throw new NotFoundException('Желание не найдено в списках')
        }

        const isOwner = await this.wishlistService.isOwner(userId, record.wishlistId);
        if (!isOwner && req.user.roles?.value != 'admin') {
            throw new ForbiddenException('Только владелец списка или администратор может редактировать желание')
        }

        return this.wishService.updateFullWish(id, dto, image, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    async deleteWish(@Body() dto: WishIdDto, @Req() req) {
        const userId = req.user.id;
        const userRole = req.user.roles?.value;
        const wishId = dto.id;
        const record = await this.wishListWishRepository.findOne({where: {wishId}});
        if (!record) {
            throw new NotFoundException('Желание не найдено в списках')
        }

        const isOwner = await this.wishlistService.isOwner(userId, record.wishlistId);
        if (!isOwner && userRole !== 'admin') {
            throw new ForbiddenException('Только владелец может удалять желание')
        }

        await this.wishService.delete(wishId);
        return {message: `Желание c id ${wishId} успешно удалено`};
    }

    @UseGuards(JwtAuthGuard)
    @Patch('book')
    async bookWish(@Body() dto: WishIdDto,@Req() req): Promise<FUllWIshDto> {
        const userId = req.user['id'];
        const wishId = dto.id;
        const record = await this.wishListWishRepository.findOne({where: {wishId}});
        if (!record) {
            throw new NotFoundException('Желание не найдено в списках');
        }
        
        const shareToken = req.query.token as string | undefined;
        const can = await this.wishlistService.canAccessWishList(userId, record.wishlistId, shareToken);
        if (!can) {
            throw new ForbiddenException('Нет доступа к бронироваю этого желания');
        }

        const wl = await this.wishlistService.findByIdWithAccess(record.wishlistId);
        if (!wl) {
            throw new NotFoundException('Список не найден');
        }

       return this.wishService.bookFullWish(wishId, userId, shareToken);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('unbook')
    async unbookWish(@Body() dto: WishIdDto, @Req() req): Promise<FUllWIshDto> {
        const userId = req.user?.id ?? null;
        const wishId = dto.id;
        const record = await this.wishListWishRepository.findOne({where: {wishId}});
        if(!record) {
            throw new NotFoundException('Желание не найдено в списках');
        }

        const shareToken = req.query.token as string | undefined;
        const can = await this.wishlistService.canAccessWishList(userId, record.wishlistId, shareToken);
        if (!can) {
            throw new ForbiddenException('Нет доступа к бронироваю этого желания');
        } 

        return this.wishService.unbookFullWish(wishId, userId, shareToken);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('complete')
    async  complete(@Body() dto: WishIdDto, @Req() req) {
        const userId = req.user.id;
        const wishId = dto.id;
        const record = await this.wishListWishRepository.findOne({where: {wishId}});
        if (!record) {
            throw new NotFoundException('Желание не найдено в списках')
        }

        const isOwner = await this.wishlistService.isOwner(userId, record.wishlistId);
        if (!isOwner) {
            throw new ForbiddenException('Только владелец может завершать желания')
        }
   
        const wl = await this.wishlistService.findByIdWithAccess(record.wishlistId);
        if (!wl) {
            throw new NotFoundException('Список не найден');
        }

        return this.wishService.completeFullWish(wishId, userId);
    }
}