import { ApiProperty } from "@nestjs/swagger";

export class OwnerInfoDto {
    @ApiProperty() id: number;
    @ApiProperty() login: number;
    @ApiProperty({required: false}) fullname?: string;
    @ApiProperty() image?: string;
}

export class WishListResponseDto {
    @ApiProperty() id: number;
    @ApiProperty() name: string;
    @ApiProperty({required: false, type: 'string'}) description?: string;
    @ApiProperty({required: false, type: 'string', format: 'date'}) eventDate?: string;
    @ApiProperty() accesslevelId: number;
    @ApiProperty() userId: string;
    @ApiProperty() shareToken?: string;
    @ApiProperty({type: () => OwnerInfoDto}) owner: OwnerInfoDto;
}