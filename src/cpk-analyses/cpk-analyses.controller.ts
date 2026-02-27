import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PERMISSIONS } from '../auth/constants/permissions';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CpkAnalysesService } from './cpk-analyses.service';
import { CreateCpkAnalysisDto } from './dto/create-cpk-analysis.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('cpk-analyses')
export class CpkAnalysesController {
    constructor(private readonly service: CpkAnalysesService) { }

    @Permissions(PERMISSIONS.CPK_ANALYSIS_CREATE)
    @Post()
    create(@Body() dto: CreateCpkAnalysisDto) { return this.service.create(dto); }

    @Permissions(PERMISSIONS.CPK_ANALYSIS_VIEW)
    @Get()
    findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
        return this.service.findAll({ page, limit });
    }

    @Permissions(PERMISSIONS.CPK_ANALYSIS_VIEW)
    @Get(':id')
    findOne(@Param('id') id: string) { return this.service.findOne(id); }

    @Permissions(PERMISSIONS.CPK_ANALYSIS_EDIT)
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: Partial<CreateCpkAnalysisDto>) { return this.service.update(id, dto); }

    @Permissions(PERMISSIONS.CPK_ANALYSIS_DELETE)
    @Delete(':id')
    remove(@Param('id') id: string) { return this.service.remove(id); }
}
