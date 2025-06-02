import { ApiProperty } from "@nestjs/swagger";
import { WishStatusDto } from "src/wishstatus/dto/wish-status.dto";


export class WishResponsDto {
    @ApiProperty() id: number;
    @ApiProperty() name: string;
    @ApiProperty({required: false}) price?: number;
    @ApiProperty({required: false}) productLink?: string;
    @ApiProperty({required: false}) image?: string; 
    @ApiProperty() userId: number;
    @ApiProperty({type: () => WishStatusDto}) status: WishStatusDto;
    @ApiProperty({required: false}) bookedbyUserId?: number;
}