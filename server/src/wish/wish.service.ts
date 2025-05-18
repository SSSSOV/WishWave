import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { Wish } from './wish.model';
import { InjectModel } from '@nestjs/sequelize';
import { FileService } from 'src/file/file.service';
import { WishStatus } from 'src/wishstatus/wishstatus.model';

@Injectable()
export class WishService {

    constructor(@InjectModel(Wish) private wishRepository: typeof Wish, private fileService: FileService) {}

    async create(dto: CreateWishDto, image: any) {
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
        return wish;
    }

    async getAll() {
        return await this.wishRepository.findAll();
    }

    async findById(id: number): Promise<Wish> {
        const wish = await this.wishRepository.findByPk(id);
        if (!wish) {
            throw new NotFoundException(`Желание с id ${id} не было найдено`);
        }
        return wish;
    }

    async update(id: number, dto: Partial<CreateWishDto>): Promise<Wish> {
               const wish = await this.wishRepository.findByPk(id);
        if (!wish) {
            throw new NotFoundException(`Желание с id ${id} не было найдено`);
        }
        await wish.update(dto);
        return wish;
    }

    async delete(id: number): Promise<void> {
        const wish = await this.findById(id);
        await wish.destroy();
    }

    async bookWish(wishId: number, userId: number): Promise<Wish> {
        const wish = await this.findById(wishId);

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
}
