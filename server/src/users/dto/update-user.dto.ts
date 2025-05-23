import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";

export class UpdateUserDto {
    @ApiProperty({required: false}) fullName?: string;
    @ApiProperty({required: false, type: 'string', format: 'binary'}) image?: string;
    @ApiProperty({required: false, format: 'date'}) birthDate?: string;
    @ApiProperty({required: false}) phone?: string;
    @ApiPropertyOptional({enum: ['male', 'female']}) @IsOptional() @IsEnum(['male', 'female']) gender?: 'male' | 'female';
    @ApiProperty({required: false, type: Object, additionalProperties: {type: 'string'}}) socials?: Record<string,string>
}