import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PERMISSIONS } from '../auth/constants/permissions';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CreateJobOrderDto } from './dto/create-job-order.dto';
import { JobOrdersService } from './job-orders.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('job-orders')
export class JobOrdersController {
    constructor(private readonly service: JobOrdersService) { }

    @Permissions(PERMISSIONS.JOB_ORDER_CREATE)
    @Post()
    create(@Body() dto: CreateJobOrderDto) { return this.service.create(dto); }

    @Permissions(PERMISSIONS.JOB_ORDER_VIEW)
    @Get()
    findAll(@Query('page') page?: number, @Query('limit') limit?: number, @Query('search') search?: string) {
        return this.service.findAll({ page, limit, search });
    }

    @Permissions(PERMISSIONS.JOB_ORDER_VIEW)
    @Get(':id')
    findOne(@Param('id') id: string) { return this.service.findOne(id); }

    @Permissions(PERMISSIONS.JOB_ORDER_EDIT)
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: Partial<CreateJobOrderDto>) { return this.service.update(id, dto); }

    @Permissions(PERMISSIONS.JOB_ORDER_DELETE)
    @Delete(':id')
    remove(@Param('id') id: string) { return this.service.remove(id); }

    @Permissions(PERMISSIONS.JOB_ORDER_EDIT)
    @Post(':id/close')
    closeJob(@Param('id') id: string, @Body('productionName') productionName: string, @Body('productionDate') productionDate: string) {
        return this.service.closeJob(id, productionName, productionDate);
    }

    @Permissions(PERMISSIONS.JOB_ORDER_VIEW)
    @Get(':id/logs')
    findLogs(@Param('id') id: string) { return this.service.findLogs(id); }

    @Permissions(PERMISSIONS.JOB_ORDER_CREATE)
    @Post(':id/logs')
    addLog(@Param('id') id: string, @Body() logData: any) { return this.service.addLog(id, logData); }
}
