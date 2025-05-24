import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

export enum FriendResponseAction {
    ACCEPT = 'accept',
    REJECT = 'reject'
}

export class RespondFriendRequestDto {
    @ApiProperty({enum: FriendResponseAction})
    @IsEnum(FriendResponseAction)
    readonly action: FriendResponseAction;
}