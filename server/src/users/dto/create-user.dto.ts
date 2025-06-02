import { ApiProperty } from "@nestjs/swagger";
import { MinLength } from "class-validator";

export class createUserDto {
    @ApiProperty() @MinLength(1) login: string;
    @ApiProperty() @MinLength(1) password: string;
    @ApiProperty() @MinLength(1) email: string;
}