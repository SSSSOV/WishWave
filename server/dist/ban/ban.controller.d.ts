import { BanService } from './ban.service';
import { BanUserDto } from './dto/ban-user.dto';
export declare class BanController {
    private banService;
    constructor(banService: BanService);
    banUser(dto: BanUserDto): Promise<{
        message: string;
        ban: import("./ban.model").Ban;
    }>;
}
