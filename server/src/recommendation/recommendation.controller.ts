import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { OptionalJwtAuthGuard } from 'src/auth/optional-jwt-auth.guard';

@Controller('recommendation')
export class RecommendationController {
    constructor(private readonly recommendationService: RecommendationService) {}

    @UseGuards(OptionalJwtAuthGuard)
    @Get()
    async getRecomendations(@Req() req) {
        const userId = req.user?.id;
        const wishes = await this.recommendationService.getRecomendation(userId);

        for (let i = wishes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [wishes[i], wishes[j]] = [wishes[j], wishes[i]];
        }

        return wishes.map(w => ({id: w.id, name: w.name, image: w.image, price: w.price, productLink: w.productLink, createdAt: w.createdAt.toISOString()}));
    }
}
