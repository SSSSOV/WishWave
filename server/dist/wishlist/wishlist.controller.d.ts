import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
export declare class WishlistController {
    private readonly wishListService;
    constructor(wishListService: WishlistService);
    create(dto: CreateWishlistDto, req: any): Promise<import("./wishlist.model").WishList>;
    getAll(req: any): Promise<import("./wishlist.model").WishList[]>;
}
