import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiProperty({ required: false }) fullname?: string;
  @ApiProperty({ required: false, type: "string", format: "binary" }) image?: string;
  @ApiProperty({ required: false, format: "date" }) birthDate?: string;
  @ApiProperty({ required: false }) phone?: string;
  @ApiProperty({ required: false, type: Object, additionalProperties: { type: "string" } })
  socials?: Record<string, string>;
}
