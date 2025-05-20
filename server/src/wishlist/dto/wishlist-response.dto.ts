import { ApiProperty } from "@nestjs/swagger";
import { WishResponsDto } from "src/wish/dto/wish-response.dto";


export class WishListResponseDto {
    @ApiProperty() id: number;
    @ApiProperty() name: string;
    @ApiProperty()  accesslevelId: number;
    @ApiProperty({type: () => [WishResponsDto], description: 'Желания в этом списке'}) wishes: WishResponsDto[];
}