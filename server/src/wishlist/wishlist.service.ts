import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WishList } from './wishlist.model';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { Wish } from 'src/wish/wish.model';

@Injectable()
export class WishlistService {
    constructor(@InjectModel(WishList) private wishListRepository: typeof WishList) {}

    async create(dto: CreateWishlistDto, userId: number) {
        return await this.wishListRepository.create({...dto, userId});
    }

    async getAllByUser(userId: number) {
        return await this.wishListRepository.findAll({where: {userId}, include: [{model: Wish, through: {attributes: []}}]});
    }

    async findByIdWithAccess(id: number) {
        return await this.wishListRepository.findByPk(id, {include: ['accesslevels']});
    }
}
