import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { Wish } from './wish.model';
import { InjectModel } from '@nestjs/sequelize';
import { FileService } from 'src/file/file.service';
import { WishListWish } from 'src/wishlist/wishlist-wish.model';
import { WishStatus } from 'src/wishstatus/wishstatus.model';
import { WishList } from 'src/wishlist/wishlist.model';
import { User } from 'src/users/users.model';
import { WishlistService } from 'src/wishlist/wishlist.service';

@Injectable()
export class WishService {

    constructor(@InjectModel(Wish) private wishRepository: typeof Wish, 
    private fileService: FileService, 
    @InjectModel(WishListWish) private wishListWishRepository: typeof WishListWish,
    @InjectModel(WishStatus) private wishStatusRepository: typeof WishStatus,
    private readonly wishlistService: WishlistService) {}

    async create(dto: CreateWishDto, image: any, listId: number) {
        let fileName: string | null = null;

        if(image) {
            fileName = await this.fileService.createFile(image);
        } else if (dto.image && dto.image.startsWith('http')) {
            fileName = await this.fileService.downloadImage(dto.image);
        }

        const data: any = {...dto};
        if (fileName) {
            data.image = fileName;
        }

        data.wishStatusId = 1;
        const wish = await this.wishRepository.create(data);

        await this.wishListWishRepository.create({wishlistId: listId, wishId: wish.id});

        return wish;
    }

    async findAllByListIds(listIds: number[]): Promise<Wish[]> {
        if (listIds.length === 0) return [];
        
        const links = await this.wishListWishRepository.findAll({where: {wishlistId: listIds}, attributes: ['wishId']});
        const wishIds = Array.from(new Set(links.map(link => link.wishId)));
        if (wishIds.length === 0) {
            return [];
        }

        return this.wishRepository.findAll({where: {id: wishIds}});
    }

    async findById(id: number): Promise<Wish> {
        const wish = await this.wishRepository.findByPk(id);
        if (!wish) {
            throw new NotFoundException(`Желание с id ${id} не было найдено`);
        }
        return wish;
    }

    async update(id: number, dto: Partial<CreateWishDto>, image?: Express.Multer.File): Promise<Wish> {
        const wish = await this.wishRepository.findByPk(id);
        if (!wish) {
            throw new NotFoundException(`Желание с id ${id} не было найдено`);
        }

        const oldImage = wish.image;
        let filename: string | null = null;

        if (image) {
            filename = await this.fileService.createFile(image);
        } else if (dto.image && dto.image.startsWith('http')) {
            filename = await this.fileService.downloadImage(dto.image);
        }

        const updateData: any = {...dto};
        if(filename) {
            updateData.image = filename;
        } else {
            delete updateData.image;
        }

        await wish.update(updateData);
        if (oldImage && filename && oldImage !== filename) {
            await this.fileService.deleteFile(oldImage);
        }

        return wish;
    }

    async delete(id: number): Promise<void> {
        const wish = await this.findById(id);
        const imageToDelete = wish.image;
        await wish.destroy();

        if (imageToDelete) {
            await this.fileService.deleteFile(imageToDelete);
        }
    }

    async bookWish(wishId: number, userId: number): Promise<Wish> {
        const wish = await this.findById(wishId);

        const completed = await this.wishStatusRepository.findOne({where: {name: 'completed'}});
        if (!completed) {
            throw new NotFoundException('Статус "completed" не найден')
        }
        if (wish.wishStatusId === completed.id) {
            throw new BadRequestException(`Желание с id ${wishId} уже завершено и не может быть забронировано`)
        }

        if (wish.bookedByUserId != null) {
            throw new BadRequestException(`Желание с id ${wishId} уже забронировано`);
        }

        wish.wishStatusId = 2;
        wish.bookedByUserId = userId;
        return await wish.save();
    }

    async unbookWish(wishId: number, userId: number): Promise<Wish> {
        const wish = await this.findById(wishId);

        if (wish.bookedByUserId == null) {
            throw new BadRequestException(`Желание с id ${wishId} не забронировано или бронь уже снята`);
        }

        if (wish.bookedByUserId !== userId) {
            throw new BadRequestException(`Вы не можете снять бронь, т.к. не являетесь её владельцем`);
        }

        wish.wishStatusId = 1;
        wish.bookedByUserId = null;
        return await wish.save();
    }

    async getBookedWishes(userId: number): Promise<Wish[]> {
        const wishes = await this.wishRepository.findAll({
            where: {bookedByUserId: userId},
            include: [
                {model: WishStatus, attributes: ['id', 'name']},
                {model: WishList, through: {attributes: []}, 
                include:[
                    {model: User, attributes: ['id', 'login', 'fullName', 'email', 'image']}
                ]}
            ]
        })
        return wishes;
    }

    async completeWish(wishId: number, userId: number): Promise<Wish> {
        const link = await this.wishListWishRepository.findOne({where: {wishId}});
        if (!link) {
            throw new NotFoundException('Желание не найдено ни в одном списке')
        }

        const isOwner = await this.wishlistService.isOwner(userId, link.wishlistId);
        if (!isOwner) {
            throw new ForbiddenException('Только владелец списка может завершать желания')
        }

        const wish = await this.wishRepository.findByPk(wishId);
        if(!wish) {
            throw new NotFoundException(`Желание с id ${wishId} не найдено`)
        }

        const completedStatus = await this.wishStatusRepository.findOne({where: {name: 'completed'}});
        if (!completedStatus) {
            throw new NotFoundException('Статус "completed" не найден ')
        }
        if (wish.wishStatusId === completedStatus.id) {
            throw new BadRequestException('Желание уже завершено')
        }

        wish.bookedByUserId = null;
        wish.wishStatusId = completedStatus.id;
        return wish.save();
    }
}
