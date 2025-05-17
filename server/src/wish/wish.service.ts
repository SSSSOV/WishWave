import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { Wish } from './wish.model';
import { InjectModel } from '@nestjs/sequelize';
import { FileService } from 'src/file/file.service';

@Injectable()
export class WishService {

    constructor(@InjectModel(Wish) private wishRepository: typeof Wish, private fileService: FileService) {}

    async create(dto: CreateWishDto, image: any) {
        const fileName = await this.fileService.createFile(image);
        const wish = await this.wishRepository.create({...dto, image: fileName})
        return wish;
    }

}
