import { ApiProperty } from "@nestjs/swagger";

export class OwnerInfoDto {
    @ApiProperty() id: number;
    @ApiProperty() login: string;
    @ApiProperty({required: false}) fullname?: string;
    @ApiProperty({required: false}) image?: string;
}

export class ListInfoDto {
    @ApiProperty() id: number;
    @ApiProperty() name: string;
    @ApiProperty({required: false, format: 'date'}) eventDate?: string;
    @ApiProperty() accessLevelId: number;
}

export class BookedByUserDto {
    @ApiProperty() id: number;
    @ApiProperty() login: string;
    @ApiProperty({required: false}) fullname?: string;
    @ApiProperty({required: false}) image?: string;
}

export class FUllWIshDto {
    @ApiProperty() id: number;
    @ApiProperty() name: string;
    @ApiProperty({required: false}) price?: number;
    @ApiProperty({required: false}) productLink?: string;
    @ApiProperty({required: false}) image?: string;
    @ApiProperty() wishStatusId: number;
    @ApiProperty() createdAt: string;
    @ApiProperty() updatedAt: string;
    @ApiProperty() shareToken?: string;
    @ApiProperty({type: () => OwnerInfoDto}) owner: OwnerInfoDto;
    @ApiProperty({type: () => ListInfoDto}) list: ListInfoDto;
    @ApiProperty({type: () => BookedByUserDto, required:false}) bookedByUser?: BookedByUserDto | null;
}