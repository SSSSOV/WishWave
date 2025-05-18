import { WishService } from './wish.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { Wish } from './wish.model';
export declare class WishController {
    private wishService;
    constructor(wishService: WishService);
    createWish(dto: CreateWishDto, image: any): Promise<Wish>;
    getAllWishes(): Promise<Wish[]>;
    getWIshById(id: number): Promise<Wish>;
    updateWish(id: number, dto: Partial<CreateWishDto>): Promise<Wish>;
    deleteWish(id: number): Promise<void>;
    bookWish(wishId: number, req: any): Promise<Wish>;
    unbookWish(wishId: number, req: any): Promise<Wish>;
}
