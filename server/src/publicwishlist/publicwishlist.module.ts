import { Module } from '@nestjs/common';
import { PublicwishlistService } from './publicwishlist.service';
import { PublicwishlistController } from './publicwishlist.controller';
import { WishlistModule } from 'src/wishlist/wishlist.module';
import { WishModule } from 'src/wish/wish.module';
import { FileModule } from 'src/file/file.module';

@Module({
  providers: [PublicwishlistService],
  controllers: [PublicwishlistController],
  imports: [
    WishlistModule,
    WishModule,
    FileModule
  ]
})
export class PublicwishlistModule {}
