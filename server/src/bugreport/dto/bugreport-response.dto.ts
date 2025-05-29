import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class OwnerInfoDto {
    @ApiProperty() id: number;
    @ApiProperty({required: false}) fullname?: string;
    @ApiProperty() login: string;
    @ApiProperty({required: false}) image?: string;
}

export class BugReportResponseDto {
    @ApiProperty() id: number;
    @ApiProperty() title: string;
    @ApiProperty() description: string;
    @ApiProperty() email: string;
    @ApiPropertyOptional() userId?: number;
    @ApiProperty() createdAt: string;
    @ApiProperty() updatedAt?: string;
    @ApiProperty({type: () => OwnerInfoDto}) owner?: OwnerInfoDto | null;
}