import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateBugReportDto {
    @ApiProperty() title: string;
    @ApiProperty() description: string;
    @ApiPropertyOptional() email?: string;
}