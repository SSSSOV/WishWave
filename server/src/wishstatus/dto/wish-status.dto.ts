import { ApiProperty } from "@nestjs/swagger";


export class WishStatusDto {
    @ApiProperty() id: number;
    @ApiProperty() name: string;
}