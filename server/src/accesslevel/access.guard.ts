import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { WishlistService } from "src/wishlist/wishlist.service";


@Injectable()
export class AccessGuard implements CanActivate {
    constructor(private reflector: Reflector, private readonly wishlistService: WishlistService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const listId = parseInt(request.params.id || request.params.listId);
        const wishlist = await this.wishlistService.findByIdWithAccess(listId);

        if (!wishlist) throw new ForbiddenException('Список не найден');

        switch (wishlist.accesslevels.name) {

            case 'public':
                return true;

            case 'private':
                if(!user || user.id !== wishlist.userId) throw new ForbiddenException('Доступ запрещен');
                return true;

            case "linkOnly":
                return true;

            case "friends":
                return true;

            default:
                return false;
        }
    }
}