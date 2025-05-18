import { Injectable } from '@nestjs/common';
import { WishStatus } from './wishstatus.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateWishStatusDto } from './dto/create-wishstatus.dto';

@Injectable()
export class WishstatusService {
    constructor(@InjectModel(WishStatus) private wishStatusRepository: typeof WishStatus) {}

    async create(dto: CreateWishStatusDto): Promise<WishStatus> {
        return this.wishStatusRepository.create(dto);
    }


}
