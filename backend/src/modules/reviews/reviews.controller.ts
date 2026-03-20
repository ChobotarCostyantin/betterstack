import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    ParseIntPipe,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiOkResponse,
    ApiCreatedResponse,
    ApiQuery,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { Authenticated } from '@common/decorators/authenticated.decorator';
import { Role } from '@common/enums/role.enum';
import { SuccessResponseDto } from '@common/dto/success-response.dto';
import { DataOf } from '@common/dto/response.dto';
import {
    SoftwareReviewResponseDto,
    CreateSoftwareReviewDto,
    UpdateSoftwareReviewDto,
    CreateSoftwareComparisonReviewDto,
    UpdateSoftwareComparisonReviewDto,
} from './dto/reviews.dto';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Get('software/:slug')
    @ApiOperation({ summary: 'Get a software review by its slug' })
    @ApiOkResponse({ type: DataOf(SoftwareReviewResponseDto) })
    getSoftwareReviewBySlug(@Param('slug') slug: string) {
        return this.reviewsService.getSoftwareReviewBySlug(slug);
    }

    @Post('software')
    @Authenticated(Role.AUTHOR)
    @ApiOperation({ summary: 'Create a software review' })
    @ApiCreatedResponse({ type: DataOf(SoftwareReviewResponseDto) })
    createSoftwareReview(@Body() dto: CreateSoftwareReviewDto) {
        return this.reviewsService.createSoftwareReview(dto);
    }

    @Put('software/:id')
    @Authenticated(Role.AUTHOR)
    @ApiOperation({ summary: 'Update a software review' })
    @ApiOkResponse({ type: DataOf(SuccessResponseDto) })
    updateSoftwareReview(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateSoftwareReviewDto,
    ) {
        return this.reviewsService.updateSoftwareReview(id, dto);
    }

    @Delete('software/:id')
    @Authenticated(Role.AUTHOR)
    @ApiOperation({ summary: 'Delete a software review' })
    @ApiOkResponse({ type: DataOf(SuccessResponseDto) })
    deleteSoftwareReview(@Param('id', ParseIntPipe) id: number) {
        return this.reviewsService.deleteSoftwareReview(id);
    }

    @Get('comparison')
    @ApiOperation({ summary: 'Get a software comparison review' })
    @ApiQuery({ name: 'slugA', required: true })
    @ApiQuery({ name: 'slugB', required: true })
    @ApiOkResponse({ type: DataOf(SoftwareReviewResponseDto) })
    getSoftwareComparisonReview(
        @Query('slugA') slugA: string,
        @Query('slugB') slugB: string,
    ) {
        return this.reviewsService.getSoftwareComparisonReview(slugA, slugB);
    }

    @Post('comparison')
    @Authenticated(Role.AUTHOR)
    @ApiOperation({ summary: 'Create a software comparison review' })
    @ApiCreatedResponse({ type: DataOf(SoftwareReviewResponseDto) })
    createSoftwareComparisonReview(
        @Body() dto: CreateSoftwareComparisonReviewDto,
    ) {
        return this.reviewsService.createSoftwareComparisonReview(dto);
    }

    @Put('comparison/:id')
    @Authenticated(Role.AUTHOR)
    @ApiOperation({ summary: 'Update a software comparison review' })
    @ApiOkResponse({ type: DataOf(SuccessResponseDto) })
    updateSoftwareComparisonReview(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateSoftwareComparisonReviewDto,
    ) {
        return this.reviewsService.updateSoftwareComparisonReview(id, dto);
    }

    @Delete('comparison/:id')
    @Authenticated(Role.AUTHOR)
    @ApiOperation({ summary: 'Delete a software comparison review' })
    @ApiOkResponse({ type: DataOf(SuccessResponseDto) })
    deleteSoftwareComparisonReview(@Param('id', ParseIntPipe) id: number) {
        return this.reviewsService.deleteSoftwareComparisonReview(id);
    }
}
