import { WishlistService } from './wishlist.service';
import { CreateWishDto } from 'src/wish/dto/create-wish.dto';
export declare class WishlistController {
    private readonly wishListService;
    constructor(wishListService: WishlistService);
    create(dto: CreateWishDto, req: any): Promise<import("./wishlist.model").WishList>;
    getAll(req: any): Promise<import("./wishlist.model").WishList[]>;
}
