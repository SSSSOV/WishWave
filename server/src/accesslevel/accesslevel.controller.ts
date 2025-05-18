import { Body, Controller, Post } from '@nestjs/common';
import { AccesslevelService } from './accesslevel.service';

@Controller('accesslevel')
export class AccesslevelController {
    constructor(private readonly accessLevelService: AccesslevelService) {}

    @Post()
    async createLevel(@Body('name') name: string) {
        return this.accessLevelService.create(name);
    }
}
