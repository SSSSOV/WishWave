import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BugReport } from 'src/bugreport/bugreport.model';
import { User } from 'src/users/users.model';
import { Wish } from 'src/wish/wish.model';
import { WishList } from 'src/wishlist/wishlist.model';

@Injectable()
export class StatsService {
    constructor (
        @InjectModel(BugReport) private readonly bugReportRepo: typeof BugReport,
        @InjectModel(Wish) private readonly wishRepo: typeof Wish,
        @InjectModel(WishList) private readonly wishListRepo: typeof WishList,
        @InjectModel(User) private readonly userRepo: typeof User,
    ) {}

    async getTotals(): Promise<{bugReports: number; wishes: number; wishLists: number; users: number}> {
        const [bugReports, wishes, wishLists, users] = await Promise.all([ this.bugReportRepo.count(), this.wishRepo.count(), this.wishListRepo.count(), this.userRepo.count()]);

        return {bugReports, wishes, wishLists, users};
    }
}
