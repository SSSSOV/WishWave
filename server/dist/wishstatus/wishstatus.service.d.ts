import { WishStatus } from './wishstatus.model';
import { CreateWishStatusDto } from './dto/create-wishstatus.dto';
export declare class WishstatusService {
    private wishStatusRepository;
    constructor(wishStatusRepository: typeof WishStatus);
    create(dto: CreateWishStatusDto): Promise<WishStatus>;
}
