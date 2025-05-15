import { createUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    create(userDto: createUserDto): Promise<import("./users.model").User>;
    getAll(): Promise<import("./users.model").User[]>;
}
