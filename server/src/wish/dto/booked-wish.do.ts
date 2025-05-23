import { ApiProperty } from "@nestjs/swagger";

export class UserInfoDto {
    @ApiProperty() if: number;
    @ApiProperty() login: string;
    @ApiProperty() email: string;
    @ApiProperty({required: false}) fullName?: string;
    @ApiProperty({required: false}) image?: string
}

export class OriginalWishlistDto {
    @ApiProperty() id: number;
    @ApiProperty() name: string;
    @ApiProperty({type: () => UserInfoDto}) owner: UserInfoDto;
}

export class BookedWishDto {
    @ApiProperty() id: number;
    @ApiProperty() name: string;
    @ApiProperty() price: number;
    @ApiProperty({required: false}) image?: string;
    @ApiProperty({required: false}) productLink?: string;
    @ApiProperty() bookedByUserId: number;
    @ApiProperty({type: () => [OriginalWishlistDto]}) wishlists: OriginalWishlistDto;
}