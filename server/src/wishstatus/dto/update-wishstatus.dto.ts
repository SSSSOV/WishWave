import { ApiProperty } from "@nestjs/swagger";

export class UpdateWishStatusDto {
    @ApiProperty() name: string;
}