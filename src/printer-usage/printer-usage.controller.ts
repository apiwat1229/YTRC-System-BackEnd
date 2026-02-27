import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PERMISSIONS } from '../auth/constants/permissions';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CreatePrinterUsageDto } from './dto/create-printer-usage.dto';
import { PrinterUsageService } from './printer-usage.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('printer-usage')
export class PrinterUsageController {
    constructor(private readonly service: PrinterUsageService) { }

    // Departments
    @Permissions(PERMISSIONS.PRINTER_USAGE_VIEW)
    @Get('departments')
    findDepartments() { return this.service.findDepartments(); }

    @Permissions(PERMISSIONS.PRINTER_USAGE_CREATE)
    @Post('departments')
    createDepartment(@Body('name') name: string, @Body('description') description?: string) { return this.service.createDepartment(name, description); }

    @Permissions(PERMISSIONS.PRINTER_USAGE_EDIT)
    @Patch('departments/:id')
    updateDepartment(@Param('id') id: string, @Body('name') name: string, @Body('description') description?: string) { return this.service.updateDepartment(id, name, description); }

    @Permissions(PERMISSIONS.PRINTER_USAGE_DELETE)
    @Delete('departments/:id')
    removeDepartment(@Param('id') id: string) { return this.service.removeDepartment(id); }

    // Mappings
    @Permissions(PERMISSIONS.PRINTER_USAGE_VIEW)
    @Get('mappings')
    findMappings() { return this.service.findMappings(); }

    @Permissions(PERMISSIONS.PRINTER_USAGE_CREATE)
    @Post('mappings')
    upsertMapping(@Body('userName') userName: string, @Body('departmentId') departmentId: string) { return this.service.upsertMapping(userName, departmentId); }

    @Permissions(PERMISSIONS.PRINTER_USAGE_DELETE)
    @Delete('mappings/:userName')
    removeMapping(@Param('userName') userName: string) { return this.service.removeMapping(userName); }

    // Records
    @Permissions(PERMISSIONS.PRINTER_USAGE_VIEW)
    @Get('records')
    findRecords(@Query('page') page?: number, @Query('limit') limit?: number, @Query('period') period?: string, @Query('departmentId') departmentId?: string) {
        return this.service.findRecords({ page, limit, period, departmentId });
    }

    @Permissions(PERMISSIONS.PRINTER_USAGE_CREATE)
    @Post('records')
    createRecord(@Body() dto: CreatePrinterUsageDto) { return this.service.createRecord(dto); }

    @Permissions(PERMISSIONS.PRINTER_USAGE_CREATE)
    @Post('records/bulk')
    bulkUpsert(@Body() records: CreatePrinterUsageDto[]) { return this.service.bulkUpsert(records); }

    // Stats
    @Permissions(PERMISSIONS.PRINTER_USAGE_VIEW)
    @Get('stats')
    getStats(@Query('period') period?: string) { return this.service.getStats(period); }
}
