import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { AnalyticsService } from './analytics.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get('booking-stats')
    getBookingStats(@Query('dateFrom') dateFrom?: string, @Query('dateTo') dateTo?: string) {
        return this.analyticsService.getBookingStats(dateFrom, dateTo);
    }

    @Get('user-stats')
    getUserStats() {
        return this.analyticsService.getUserStats();
    }

    @Get('job-order-stats')
    getJobOrderStats() {
        return this.analyticsService.getJobOrderStats();
    }

    @Get('supplier-stats')
    getSupplierStats() {
        return this.analyticsService.getSupplierStats();
    }
}
