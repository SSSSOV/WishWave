import { ApiProperty } from "@nestjs/swagger";

export class UpdateAccessLevelDto {
    @ApiProperty() name: string;
}