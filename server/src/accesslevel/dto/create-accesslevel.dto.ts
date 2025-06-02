import { ApiProperty } from "@nestjs/swagger";

export class CreateAccessLevelDto {
    @ApiProperty() name: string;
}