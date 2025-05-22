import { ApiProperty } from "@nestjs/swagger";

export class DuplicateWishDto {
    @ApiProperty({description: 'ID списка, в который нужно скопировать'}) targetListId: number;
    @ApiProperty({description: 'ID желания, которое копируем'}) wishId: number;
}