import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PERMISSIONS } from '../auth/constants/permissions';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CreateRawMaterialPlanDto } from './dto/create-raw-material-plan.dto';
import { RawMaterialPlansService } from './raw-material-plans.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('raw-material-plans')
export class RawMaterialPlansController {
    constructor(private readonly service: RawMaterialPlansService) { }

    @Permissions(PERMISSIONS.RAW_MATERIAL_PLAN_CREATE)
    @Post()
    create(@Body() dto: CreateRawMaterialPlanDto) { return this.service.create(dto); }

    @Permissions(PERMISSIONS.RAW_MATERIAL_PLAN_VIEW)
    @Get()
    findAll(@Query('page') page?: number, @Query('limit') limit?: number, @Query('status') status?: string) {
        return this.service.findAll({ page, limit, status });
    }

    @Permissions(PERMISSIONS.RAW_MATERIAL_PLAN_VIEW)
    @Get(':id')
    findOne(@Param('id') id: string) { return this.service.findOne(id); }

    @Permissions(PERMISSIONS.RAW_MATERIAL_PLAN_EDIT)
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: Partial<CreateRawMaterialPlanDto>) { return this.service.update(id, dto); }

    @Permissions(PERMISSIONS.RAW_MATERIAL_PLAN_DELETE)
    @Delete(':id')
    remove(@Param('id') id: string) { return this.service.remove(id); }
}
