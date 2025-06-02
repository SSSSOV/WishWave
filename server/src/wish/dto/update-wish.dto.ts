import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateWishDto } from "./create-wish.dto";

export class UpdateWishDto extends PartialType(CreateWishDto) {
    @ApiProperty() id: number;
    @ApiProperty({required: false}) name?: string;
    @ApiProperty({required: false}) price?: number;
    @ApiProperty({required: false}) productLink?: string;
    @ApiProperty({required: false}) image?: string;
}