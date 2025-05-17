import { CreateWishDto } from './dto/create-wish.dto';
import { Wish } from './wish.model';
import { FileService } from 'src/file/file.service';
export declare class WishService {
    private wishRepository;
    private fileService;
    constructor(wishRepository: typeof Wish, fileService: FileService);
    create(dto: CreateWishDto, image: any): Promise<Wish>;
}
