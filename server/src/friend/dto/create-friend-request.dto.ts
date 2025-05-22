import { ApiProperty } from "@nestjs/swagger";

export class CreateFriendRequestDto {
    @ApiProperty() readonly targetUserId: number;
}