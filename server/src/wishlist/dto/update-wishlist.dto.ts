import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateWishlistDto } from "./create-wishlist.dto";

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {
    @ApiProperty() id: number;
}