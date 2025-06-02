import { ApiProperty } from "@nestjs/swagger";

export class WishIdDto {
    @ApiProperty() id: number;
}