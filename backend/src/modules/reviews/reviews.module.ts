import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { AuthorDetails } from './entities/author-details.entity';
import { SoftwareReview } from './entities/software-review.entity';
import { SoftwareComparisonReview } from './entities/software-comparison-review.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AuthorDetails,
            SoftwareReview,
            SoftwareComparisonReview,
        ]),
    ],
    controllers: [ReviewsController],
    providers: [ReviewsService],
})
export class ReviewsModule {}
