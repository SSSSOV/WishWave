import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccessLevel } from 'src/accesslevel/accesslevel.model';
import { User } from 'src/users/users.model';
import { Wish } from 'src/wish/wish.model';
import { WishList } from 'src/wishlist/wishlist.model';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        SequelizeModule.forFeature([Wish, WishList, AccessLevel, User]),
        AuthModule
    ],
    providers: [RecommendationService],
    exports: [RecommendationService],
    controllers: [RecommendationController]
})
export class RecommendationModule {}
