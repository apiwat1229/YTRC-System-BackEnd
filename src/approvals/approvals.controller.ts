import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { ApprovalsService } from './approvals.service';
import { CreateApprovalDto } from './dto/create-approval.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('approvals')
export class ApprovalsController {
    constructor(private readonly approvalsService: ApprovalsService) { }

    @Post()
    create(@Body() dto: CreateApprovalDto) {
        return this.approvalsService.create(dto);
    }

    @Get()
    findAll(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('status') status: string,
        @Query('requesterId') requesterId: string,
        @Query('approverId') approverId: string,
    ) {
        return this.approvalsService.findAll({ page, limit, status, requesterId, approverId });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.approvalsService.findOne(id);
    }

    @Post(':id/approve')
    approve(@Param('id') id: string, @Body('approverId') approverId: string, @Body('remark') remark?: string) {
        return this.approvalsService.approve(id, approverId, remark);
    }

    @Post(':id/reject')
    reject(@Param('id') id: string, @Body('approverId') approverId: string, @Body('remark') remark?: string) {
        return this.approvalsService.reject(id, approverId, remark);
    }

    @Post(':id/cancel')
    cancel(@Param('id') id: string, @CurrentUser() user: any) {
        return this.approvalsService.cancel(id, user.id);
    }

    @Get(':id/logs')
    findLogs(@Param('id') id: string) {
        return this.approvalsService.findLogs(id);
    }
}
