import { WishList } from './wishlist.model';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
export declare class WishlistService {
    private wishListRepository;
    constructor(wishListRepository: typeof WishList);
    create(dto: CreateWishlistDto, userId: number): Promise<WishList>;
    getAllByUser(userId: number): Promise<WishList[]>;
}
