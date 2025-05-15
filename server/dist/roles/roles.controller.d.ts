import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
export declare class RolesController {
    private roleService;
    constructor(roleService: RolesService);
    create(dto: CreateRoleDto): Promise<import("./roles.model").Role>;
    getByValue(value: string): Promise<import("./roles.model").Role | null>;
}
