import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { DuplicateWishDto } from './dto/duplicate-wish.dto';
import { WishListResponseDto } from './dto/wishlist-response.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Wish } from 'src/wish/wish.model';
import { WishListWish } from './wishlist-wish.model';
import { User } from 'src/users/users.model';
import { WishList } from './wishlist.model';

@Controller('wishlist')
export class WishlistController {
    constructor(private readonly wishListService: WishlistService, @InjectModel(Wish) private readonly wishRepository: typeof Wish, @InjectModel(WishListWish) private readonly linkRepository: typeof WishListWish) {}
    
    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() dto: CreateWishlistDto, @Req() req): Promise<WishListResponseDto> {
        const userId = req.user.id;
        const list = await this.wishListService.create(dto, userId);
        const withOwner = await list.reload({include: [{model: User, as: 'user', attributes: ['id', 'fullname', 'login', 'image']}]})
        const plain = withOwner.get({plain: true}) as any;
        const response: WishListResponseDto = {id: plain.id, name: plain.name, accesslevelId: plain.accesslevelId, description: plain.description, eventDate: plain.eventDate, userId: plain.userId, shareToken: plain.shareToken, owner: {
            id: plain.user.id, fullname: plain.user.fullname, login: plain.user.login, image: plain.user.image
        }};

        return response;
    }

    @UseGuards(JwtAuthGuard)
    @Get('all')
    async getAllWishlistAdm(@Req() req, @Query('page') page = '1', @Query('limit') limit = '20'): Promise<{data: Partial<WishList>[]; page: number; perPage: number; total: number; totalPages: number}>  {
        if (req.user.roles?.value !== 'admin') {
            throw new ForbiddenException('У вас нет прав, чтобы посмотреть все списки')
        }
            
        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const perPage = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
        const {rows, count} = await this.wishListService.getAllWishlistAdm(pageNum, perPage);
    
        const data = rows.map((wl) => {return(wl.get({plain: true}) as any) as Partial<WishList>});
    
        return {data, page: pageNum, perPage, total: count, totalPages: Math.ceil(count/perPage)};
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll(@Query('userId') ownerId: number | null, @Req() req) {
        const viewerId = req.user.id;
        const targetUserId = ownerId ?? viewerId;
        if (ownerId && isNaN(targetUserId)) {
            throw new BadRequestException('Query-param "userId" должен быть числом');
        }
        const lists = await this.wishListService.getAccessibleWishes(viewerId, targetUserId);
        return lists.map(l => {const p: any = l.get({plain: true}); 
            return {id: p.id, name: p.name, accessLevelId: p.accesslevelId, description: p.description, eventDate: p.eventDate, shareToken: p.shareToken, owner: {
                id: p.user.id, fullname: p.user.fullname, login: p.user.login, image: p.user.image
            }}})
    }

    @UseGuards(JwtAuthGuard)
    @Patch('duplicate')
    async duplicateWish(@Body() dto: DuplicateWishDto, @Req() req): Promise<any> {
        const userId = req.user.id;
        const cloned = await this.wishListService.duplicate(userId, dto.wishId, dto.targetListId);
        const plainCloned = cloned.get({plain: true}) as any;
        const fullWish = await this.wishRepository.findByPk(plainCloned.id, {include: [{
            model: User, as: 'bookedByUser', attributes: ['id', 'fullname', 'login', 'image']}]});
        const w = fullWish?.get({plain: true}) as any;
        const wl = await this.wishListService.getFullById(userId, dto.targetListId, undefined);
        if (!wl) {
            throw new NotFoundException('Список не нйаден')
        }

        const p = wl.get({plain: true}) as any;
        const owner = {id: p.user.id, fullname: p.user.fullname, login: p.user.login, image: p.user.image};
        const booked = w.bookedByUser ? {id: w.bookedByUser.id, fullname: w.bookedByUser.fullname, login: w.bookedByUser.login, image: w.bookedByUser.image} : null;
        const list = {id: p.id, name: p.name, eventDate: p.eventDate, accessLevelId: p.accesslevel.id}

        return {id: w.id, name: w.name, price: w.price, productLink: w.productLink, image: w.image, wishStatusId: w.wishStatusId, bookedByUser: booked, createdAt: w.createdAt, updatedAt: w.updatedAt, shareToken: p.shareToken, owner, list}
    }

    @UseGuards(JwtAuthGuard)
    @Patch()
    async update(@Body() dto: UpdateWishlistDto, @Req() req): Promise<WishListResponseDto> {
        const userId = req.user.id;
        const {id, ...data} = dto;
        if (!(await this.wishListService.isOwner(userId, id))) {
            throw new ForbiddenException('Только владелец может редактировать список')
        }

        const updated = await this.wishListService.update(id,data);
        const withOwner = await updated.reload({include: [{model: User, as: 'user', attributes: ['id', 'fullname', 'login', 'image']}]});
        const plain = withOwner.get({plain:true}) as any;

        const response: WishListResponseDto = {id: plain.id, name: plain.name, accesslevelId: plain.accesslevelId, description: plain.description, eventDate: plain.eventDate, userId: plain.userId, shareToken: plain.shareToken, owner: {
            id: plain.user.id, fullname: plain.user.fullname, login: plain.user.login, image: plain.user.image
        }};

        return response;
    }

    @UseGuards(JwtAuthGuard)
    @Patch('copy')
    async copyWish(@Body() dto: DuplicateWishDto, @Req() req): Promise<any> {
        const userId = req.user.id;
        const {wishId, targetListId} = dto;
        await this.wishListService.copyToList(userId, wishId,targetListId);
        const fullWish = await this.wishRepository.findByPk(wishId, {include: [{
            model: User, as: 'bookedByUser', attributes: ['id', 'fullname', 'login', 'image']}]});
        const w = fullWish?.get({plain: true}) as any;
        const wish = await this.wishRepository.findByPk(wishId)
        if (!wish) {
            throw new NotFoundException(`Желание с id ${wishId} не найдено`)
        }

        const wl = await this.wishListService.getFullById(userId, targetListId);
        if (!wl) {
            throw new NotFoundException(`Список с id ${targetListId} не найден`)
        }
        const p = wl.get({plain: true}) as any;

        const owner = {id: p.user.id, fullname: p.user.fullname, login: p.user.login, image: p.user.image};
        const booked = w.bookedByUser ? {id: w.bookedByUser.id, fullname: w.bookedByUser.fullname, login: w.bookedByUser.login, image: w.bookedByUser.image} : null;
        const list = {id: p.id, name: p.name, eventDate: p.eventDate, accessLevelId: p.accesslevel.id}

        return {id: w.id, name: w.name, price: w.price, productLink: w.productLink, image: w.image, wishStatusId: w.wishStatusId, bookedByUser: booked, createdAt: w.createdAt, updatedAt: w.updatedAt, shareToken: p.shareToken, owner, list}
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<{message: string}> {
        const userId = req.user.id;
        if (!(await this.wishListService.isOwner(userId, id))) {
            throw new ForbiddenException('Только владелец может удалить список')
        }
        return this.wishListService.remove(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOne(@Param('id') id: number, @Req() req, @Query('token') token?: string) {
        const viewer = req.user;
        const viewerId = req.user.id as number;
        const isAdmin = viewer.roles?.value === 'admin';
        if (isAdmin) {
            const wl = await this.wishListService.getFullById(viewerId, id, token, true);
            if (!wl) {
                throw new NotFoundException('Список не найден');
            }

            const p = wl.get({ plain: true }) as any;
            const owner = {id: p.user.id,fullname: p.user.fullname,login: p.user.login,image: p.user.image};

            return {id: p.id,name: p.name,accessLevelId: p.accesslevelId,description: p.description,eventDate: p.eventDate,shareToken: p.shareToken,owner};
        }

        const wl = await this.wishListService.getFullById(viewerId, id, token);
        if (!wl) {
            throw new NotFoundException('Список не найден')
        }
        
        const p = wl.get({plain: true}) as any;
        const owner = {id: p.user.id, fullname: p.user.fullname, login: p.user.login, image: p.user.image};
        const wishes = (p.wishes || []).map((w: any) => ({id: w.id, name: w.name, price: w.price, productLink: w.productLink, image: w.image, wishStatusId: w.wishstatus?.id ?? w.wishStatusId, bookedByUser: w.bookedByUser ? {
            id: w.bookedByUser.id, fullname: w.bookedByUser.fullname, login: w.bookedByUser.login, image: w.bookedByUser.image
        }: null}));

        return {id: p.id, name: p.name, accessLevelId: p.accesslevelId, description: p.description, eventDate: p.eventDate, shareToken: p.shareToken, owner, wishes};
    }

}
