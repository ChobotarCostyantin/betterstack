import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CriteriaService } from './criteria.service';
import { CreateCriterionDto } from './dto/create-criterion.dto';
import { UpdateCriterionDto } from './dto/update-criterion.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { WithRole } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('Criteria')
@Controller('criteria')
@ApiBearerAuth()
export class CriteriaController {
    constructor(private readonly service: CriteriaService) { }

    @Get()
    @ApiOperation({ summary: 'Get all criteria' })
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get criterion by ID' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create new criterion' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @WithRole(Role.ADMIN)
    create(@Body() dto: CreateCriterionDto) {
        return this.service.create(dto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update criterion' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @WithRole(Role.ADMIN)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateCriterionDto,
    ) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete criterion' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @WithRole(Role.ADMIN)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.remove(id);
    }
}
