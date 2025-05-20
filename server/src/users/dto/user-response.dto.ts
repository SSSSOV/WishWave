import { ApiProperty } from "@nestjs/swagger";
import { WishListResponseDto } from "src/wishlist/dto/wishlist-response.dto";


export class UserResponseDto {
    @ApiProperty() id: number;
    @ApiProperty({required: false}) full_name: string;
    @ApiProperty() login: string;
    @ApiProperty() email: string;
    @ApiProperty() roleId: number;
    @ApiProperty({required: false}) banId: number;
    @ApiProperty({type: () => [WishListResponseDto], description: 'Списки желаний пользователя'}) wishlists: WishListResponseDto[];

}