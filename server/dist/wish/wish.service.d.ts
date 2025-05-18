import { CreateWishDto } from './dto/create-wish.dto';
import { Wish } from './wish.model';
import { FileService } from 'src/file/file.service';
import { WishListWish } from 'src/wishlist/wishlist-wish.model';
export declare class WishService {
    private wishRepository;
    private fileService;
    private wishListWishRepository;
    constructor(wishRepository: typeof Wish, fileService: FileService, wishListWishRepository: typeof WishListWish);
    create(dto: CreateWishDto, image: any, listId: number): Promise<Wish>;
    getAll(): Promise<Wish[]>;
    findById(id: number): Promise<Wish>;
    update(id: number, dto: Partial<CreateWishDto>): Promise<Wish>;
    delete(id: number): Promise<void>;
    bookWish(wishId: number, userId: number): Promise<Wish>;
    unbookWish(wishId: number, userId: number): Promise<Wish>;
}
