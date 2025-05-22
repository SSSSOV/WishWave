import { ApiProperty } from "@nestjs/swagger";

export class UpdateFriendStatusDto {
    @ApiProperty() readonly name: string;
}