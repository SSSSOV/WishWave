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
      if (!publicLevel) {
        return [];
      }
      const publicId = publicLevel.id;

      const DESIRED_COUNT = 30;

      const result: Wish[] = [];

      const usedWishIds = new Set<number>();

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

          const strictMatch = await this.wishRepository.findAll({
            subQuery: false,
            include: [
              {
                model: WishList,
                as: "wishlists",
                through: { attributes: [] },
                attributes: [],
                where: { accesslevelId: publicId },
                required: true,
                include: [
                  {
                    model: User,
                    as: "user",
                    attributes: [],
                    where: {
                      gender: user.gender,
                      birthDate: { [Op.between]: [minDate, maxDate] },
                    },
                    required: true,
                  },
                ],
              },
            ],
            order: [["createdAt", "DESC"]],
            limit: DESIRED_COUNT,
          });

          strictMatch.forEach((w) => {
            result.push(w);
            usedWishIds.add(w.id);
          });

          if (result.length >= DESIRED_COUNT) {
            return result.slice(0, DESIRED_COUNT);
          }

          const remainingAfterStep1 = DESIRED_COUNT - result.length;
          if (remainingAfterStep1 > 0) {
            const genderOnly = await this.wishRepository.findAll({
              subQuery: false,
              include: [
                {
                  model: WishList,
                  as: "wishlists",
                  through: { attributes: [] },
                  attributes: [],
                  where: { accesslevelId: publicId },
                  required: true,
                  include: [
                    {
                      model: User,
                      as: "user",
                      attributes: [],
                      where: {
                        gender: user.gender,
                      },
                      required: true,
                    },
                  ],
                },
              ],
              where: {
                id: { [Op.notIn]: Array.from(usedWishIds) },
              },
              order: [["createdAt", "DESC"]],
              limit: remainingAfterStep1,
            });

            genderOnly.forEach((w) => {
              result.push(w);
              usedWishIds.add(w.id);
            });

            if (result.length >= DESIRED_COUNT) {
              return result.slice(0, DESIRED_COUNT);
            }
          }


          const remainingAfterStep2 = DESIRED_COUNT - result.length;
          if (remainingAfterStep2 > 0) {
            const ageOnly = await this.wishRepository.findAll({
              subQuery: false,
              include: [
                {
                  model: WishList,
                  as: "wishlists",
                  through: { attributes: [] },
                  attributes: [],
                  where: { accesslevelId: publicId },
                  required: true,
                  include: [
                    {
                      model: User,
                      as: "user",
                      attributes: [],
                      where: {
                        birthDate: { [Op.between]: [minDate, maxDate] },
                      },
                      required: true,
                    },
                  ],
                },
              ],
              where: {
                id: { [Op.notIn]: Array.from(usedWishIds) },
              },
              order: [["createdAt", "DESC"]],
              limit: remainingAfterStep2,
            });

            ageOnly.forEach((w) => {
              result.push(w);
              usedWishIds.add(w.id);
            });

            if (result.length >= DESIRED_COUNT) {
              return result.slice(0, DESIRED_COUNT);
            }
          }
        }
      }

      const remainingAfterStep3 = DESIRED_COUNT - result.length;
      if (remainingAfterStep3 > 0) {
        const fillWithAnyPublic = await this.wishRepository.findAll({
          subQuery: false,
          include: [
            {
              model: WishList,
              as: "wishlists",
              through: { attributes: [] },
              attributes: [],
              where: { accesslevelId: publicId },
              required: true,
            },
          ],
          where: {
            id: { [Op.notIn]: Array.from(usedWishIds) },
          },
          order: [["createdAt", "DESC"]],
          limit: remainingAfterStep3,
        });

        fillWithAnyPublic.forEach((w) => {
          result.push(w);
          usedWishIds.add(w.id);
        });
      }

    return result.slice(0, DESIRED_COUNT);
  }

}
