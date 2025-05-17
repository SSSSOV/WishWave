import { WishService } from './wish.service';
import { CreateWishDto } from './dto/create-wish.dto';
export declare class WishController {
    private wishService;
    constructor(wishService: WishService);
    createWish(dto: CreateWishDto, image: any): void;
}
