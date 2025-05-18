import { AccessLevel } from './accesslevel.model';
export declare class AccesslevelService {
    private accessLevelRepository;
    constructor(accessLevelRepository: typeof AccessLevel);
    create(name: string): Promise<AccessLevel>;
}
