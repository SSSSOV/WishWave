import { Ban } from './ban.model';
import { User } from 'src/users/users.model';
export declare class BanService {
    private banRepository;
    private userRepository;
    constructor(banRepository: typeof Ban, userRepository: typeof User);
    banUser(userId: number, description: string): Promise<{
        message: string;
        ban: Ban;
    }>;
}
