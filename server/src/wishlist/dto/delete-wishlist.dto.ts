import { ApiProperty } from "@nestjs/swagger";

export class DeleteWishlistDto {
    @ApiProperty() id: number;
}