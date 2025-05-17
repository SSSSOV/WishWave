import { createUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    create(userDto: createUserDto): Promise<import("./users.model").User>;
    getAll(): Promise<import("./users.model").User[]>;
    delete(id: number): Promise<{
        message: string;
    }>;
    updateUser(id: string, dto: Partial<createUserDto>): Promise<import("./users.model").User>;
}
