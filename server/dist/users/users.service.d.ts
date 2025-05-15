import { User } from './users.model';
import { createUserDto } from './dto/create-user.dto';
import { RolesService } from 'src/roles/roles.service';
export declare class UsersService {
    private userRepository;
    private roleService;
    constructor(userRepository: typeof User, roleService: RolesService);
    createUser(dto: createUserDto): Promise<User>;
    getAllUsers(): Promise<User[]>;
}
