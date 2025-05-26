export class CreateWishDto {
    readonly name: string;
    readonly price: number;
    readonly image?: string;
    readonly productLink?: string;
    readonly listId: number;
}