import { ApiProperty } from "@nestjs/swagger";
import { MinLength } from "class-validator";

export class ChangePasswordDto {
    @ApiProperty() @MinLength(1) oldPassword: string;
    @ApiProperty() @MinLength(1) newPassword: string;
}

export class AdminChangePasswordDto {
    @ApiProperty() @MinLength(1) newPassword: string;
}