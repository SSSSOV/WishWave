import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class BugReportResponseDto {
    @ApiProperty() id: number;
    @ApiProperty() title: string;
    @ApiProperty() description: string;
    @ApiProperty() email: string;
    @ApiPropertyOptional() userId?: number;
    @ApiProperty() createdAt: string;
    @ApiProperty() updatedAt?: string;
}