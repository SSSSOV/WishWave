import { ApiProperty } from "@nestjs/swagger";

export class WishGetDto {
    @ApiProperty() id: number;
    @ApiProperty({required: false}) token?: string;
}