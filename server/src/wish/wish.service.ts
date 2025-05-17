import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { Wish } from './wish.model';
import { InjectModel } from '@nestjs/sequelize';
import { FileService } from 'src/file/file.service';

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

        const wish = await this.wishRepository.create(data);
        return wish;
    }

}
