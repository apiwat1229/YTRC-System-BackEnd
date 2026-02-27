import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PERMISSIONS } from '../auth/constants/permissions';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CreateProductionReportDto } from './dto/create-production-report.dto';
import { ProductionReportsService } from './production-reports.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('production-reports')
export class ProductionReportsController {
    constructor(private readonly service: ProductionReportsService) { }

    @Permissions(PERMISSIONS.PRODUCTION_REPORT_CREATE)
    @Post()
    create(@Body() dto: CreateProductionReportDto) { return this.service.create(dto); }

    @Permissions(PERMISSIONS.PRODUCTION_REPORT_VIEW)
    @Get()
    findAll(@Query('page') page?: number, @Query('limit') limit?: number, @Query('search') search?: string, @Query('status') status?: string) {
        return this.service.findAll({ page, limit, search, status });
    }

    @Permissions(PERMISSIONS.PRODUCTION_REPORT_VIEW)
    @Get(':id')
    findOne(@Param('id') id: string) { return this.service.findOne(id); }

    @Permissions(PERMISSIONS.PRODUCTION_REPORT_EDIT)
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: Partial<CreateProductionReportDto>) { return this.service.update(id, dto); }

    @Permissions(PERMISSIONS.PRODUCTION_REPORT_DELETE)
    @Delete(':id')
    remove(@Param('id') id: string) { return this.service.remove(id); }

    @Permissions(PERMISSIONS.PRODUCTION_REPORT_CREATE)
    @Post(':id/rows')
    addRow(@Param('id') id: string, @Body() rowData: any) { return this.service.addRow(id, rowData); }

    @Permissions(PERMISSIONS.PRODUCTION_REPORT_EDIT)
    @Patch('rows/:rowId')
    updateRow(@Param('rowId') rowId: string, @Body() data: any) { return this.service.updateRow(rowId, data); }

    @Permissions(PERMISSIONS.PRODUCTION_REPORT_DELETE)
    @Delete('rows/:rowId')
    removeRow(@Param('rowId') rowId: string) { return this.service.removeRow(rowId); }
}
