import { ApiProperty } from "@nestjs/swagger";
import { WishResponsDto } from "src/wish/dto/wish-response.dto";


export class WishListResponseDto {
    @ApiProperty() id: number;
    @ApiProperty() name: string;
    @ApiProperty({required: false, type: 'string'}) description?: string;
    @ApiProperty({required: false, type: 'string', format: 'date'}) eventDate?: string;
    @ApiProperty() accesslevelId: number;
    @ApiProperty() userId: string;
    @ApiProperty() shareToken?: string;
}