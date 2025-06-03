import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/sequelize"
import { Op } from "sequelize"
import { AccessLevel } from "src/accesslevel/accesslevel.model"
import { User } from "src/users/users.model"
import { Wish } from "src/wish/wish.model"
import { WishList } from "src/wishlist/wishlist.model"

@Injectable()
export class RecommendationService {
  constructor(
    @InjectModel(Wish) private readonly wishRepository: typeof Wish,
    @InjectModel(WishList) private readonly wishListRepository: typeof WishList,
    @InjectModel(AccessLevel) private readonly lvlRepository: typeof AccessLevel,
    @InjectModel(User) private readonly userRepository: typeof User
  ) {}

  private computeAge(birthDate: string): number {
    const [y, m, d] = birthDate.split("-").map(Number)
    const diff = Date.now() - new Date(y, m - 1, d).getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
  }

  async getRecomendation(userId?: number): Promise<Wish[]> {
    const publicLevel = await this.lvlRepository.findOne({ where: { name: "public" } });
    const publicId = publicLevel?.id;
    if (!publicId) {
      return [];
    }

    if (userId) {
      const user = await this.userRepository.findByPk(userId, {
        attributes: ["birthDate", "gender"],
      });
      if (user?.birthDate && user.gender) {
        const age = this.computeAge(user.birthDate);
        const minAge = age - 5;
        const maxAge = age + 5;

        const now = new Date();
        const minDate = new Date(now);
        const maxDate = new Date(now);
        minDate.setFullYear(now.getFullYear() - maxAge);
        maxDate.setFullYear(now.getFullYear() - minAge);

        const recs = await this.wishRepository.findAll({
          subQuery: false,
          include: [
            {
              model: WishList,
              as: "wishlists",
              through: { attributes: [] },
              attributes: [],
              where: {
                accesslevelId: publicId,

                '$wishlists.user.gender$': user.gender,
                '$wishlists.user.birthDate$': { [Op.between]: [minDate, maxDate] },
              },
            },
          ],
          order: [["createdAt", "DESC"]],
          limit: 30,
        });

        if (recs.length) {
          return recs;
        }
      }
    }

    return this.wishRepository.findAll({
      subQuery: false,
      include: [
        {
          model: WishList,
          as: "wishlists",
          through: { attributes: [] },
          attributes: [],
          where: { accesslevelId: publicId },
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 30,
    });
  }
}
