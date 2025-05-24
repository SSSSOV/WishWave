import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class CancelFriendRequestDto {
    @ApiProperty()
    @IsInt()
    readonly requestId: number;
}