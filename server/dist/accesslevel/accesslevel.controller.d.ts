import { AccesslevelService } from './accesslevel.service';
export declare class AccesslevelController {
    private readonly accessLevelService;
    constructor(accessLevelService: AccesslevelService);
    createLevel(name: string): Promise<import("./accesslevel.model").AccessLevel>;
}
