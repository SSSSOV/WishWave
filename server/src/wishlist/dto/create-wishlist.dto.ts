import { ApiProperty } from "@nestjs/swagger";

export class CreateWishlistDto {
    @ApiProperty() name: string;
    @ApiProperty() accesslevelId: number;
    @ApiProperty({required: false, type: 'string'}) description?: string;
    @ApiProperty({required: false, type: 'string', format: 'date'}) eventDate?: string;
}