import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { SoftwareReview } from './entities/software-review.entity';
import { SoftwareComparisonReview } from './entities/software-comparison-review.entity';
import { User } from '../users/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SoftwareReview,
            SoftwareComparisonReview,
            User,
        ]),
    ],
    controllers: [ReviewsController],
    providers: [ReviewsService],
})
export class ReviewsModule {}
