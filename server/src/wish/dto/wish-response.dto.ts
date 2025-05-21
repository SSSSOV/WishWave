import { ApiProperty } from "@nestjs/swagger";
import { WishStatusDto } from "src/wishstatus/dto/wish-status.dto";


export class WishResponsDto {
    @ApiProperty() id: number;
    @ApiProperty() name: string;
    @ApiProperty() price: number;
    @ApiProperty({required: false}) image?: string; 
    @ApiProperty({required: false}) productLink?: string;

    @ApiProperty({type: () => WishStatusDto, description: 'Статус желания'})
    status: WishStatusDto;

    @ApiProperty({required: false, description: 'ID пользователя, который забронировал желание'})
    bookedbyUserId?: number;
}