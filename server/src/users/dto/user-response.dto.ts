import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { WishListResponseDto } from "src/wishlist/dto/wishlist-response.dto";

export class UserResponseDto {
    @ApiProperty() id: number;
    @ApiProperty({required: false}) fullname?: string;
    @ApiProperty({required: false}) image?: string;
    @ApiProperty({required: false, format: 'date'}) birthday?: string;
    @ApiProperty({required: false}) phone?: string;
    @ApiProperty({required: false, type: Object, additionalProperties: {type: 'string'}}) socials?: Record<string, string>
    @ApiProperty() login: string;
    @ApiProperty() email: string;
    @ApiProperty() roleId: number;
    @ApiProperty({required: false}) banId?: number;
    @ApiPropertyOptional({enum: ['male', 'female']}) gender?: 'male' | 'female';
}