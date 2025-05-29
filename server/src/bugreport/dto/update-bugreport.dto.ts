import { ApiProperty } from "@nestjs/swagger";

export class UpdateBugReportDto {
    @ApiProperty() title?: string | null;
    @ApiProperty() description?: string | null;
    @ApiProperty() email?: string | null;
}