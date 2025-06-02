import { ApiProperty } from "@nestjs/swagger";

export class FriendResponseDto {
    @ApiProperty() id: number;
    @ApiProperty() login: string;
    @ApiProperty() email: string;
    @ApiProperty({required: false}) fullName?: string;
    @ApiProperty({required: false}) image?: string; 
    @ApiProperty({required: false}) birthDate?: string;
    @ApiProperty({required: false}) phone?: string;
    @ApiProperty({required: false}) socials?: string;
    @ApiProperty({required: false}) gender?: string
}