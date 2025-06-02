import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";

export class UpdateUserDto {
  @ApiProperty({ required: false }) fullname?: string | null;
  @ApiProperty({ required: false, type: "string", format: "binary" }) image?: string | null;
  @ApiProperty({ required: false, format: "date" }) birthDate?: string | null;
  @ApiProperty({ required: false }) phone?: string | null;
  @ApiPropertyOptional({ enum: ["male", "female"] }) @IsOptional() @IsEnum(["male", "female"]) gender?: "male" | "female" | null;
  @ApiProperty({ required: false, type: Object, additionalProperties: { type: "string" } }) socials?: Record<string, string> | null;
}
