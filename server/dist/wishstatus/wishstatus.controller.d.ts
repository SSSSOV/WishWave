import { WishstatusService } from './wishstatus.service';
import { CreateWishStatusDto } from './dto/create-wishstatus.dto';
export declare class WishstatusController {
    private readonly wishStatusService;
    constructor(wishStatusService: WishstatusService);
    create(dto: CreateWishStatusDto): Promise<import("./wishstatus.model").WishStatus>;
}
