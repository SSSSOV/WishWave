import { User } from './users.model';
import { createUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: typeof User);
    createUser(dto: createUserDto): Promise<User>;
    getAllUsers(): Promise<User[]>;
}
