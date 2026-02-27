import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PERMISSIONS } from '../auth/constants/permissions';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CreateShippingPlanDto } from './dto/create-shipping-plan.dto';
import { ShippingPlansService } from './shipping-plans.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('shipping-plans')
export class ShippingPlansController {
    constructor(private readonly service: ShippingPlansService) { }

    @Permissions(PERMISSIONS.SHIPPING_PLAN_CREATE)
    @Post()
    create(@Body() dto: CreateShippingPlanDto) { return this.service.create(dto); }

    @Permissions(PERMISSIONS.SHIPPING_PLAN_VIEW)
    @Get()
    findAll(@Query('page') page?: number, @Query('limit') limit?: number, @Query('status') status?: string) {
        return this.service.findAll({ page, limit, status });
    }

    @Permissions(PERMISSIONS.SHIPPING_PLAN_VIEW)
    @Get('available-pallets')
    findAvailablePallets() { return this.service.findAvailablePallets(); }

    @Permissions(PERMISSIONS.SHIPPING_PLAN_VIEW)
    @Get(':id')
    findOne(@Param('id') id: string) { return this.service.findOne(id); }

    @Permissions(PERMISSIONS.SHIPPING_PLAN_EDIT)
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: Partial<CreateShippingPlanDto>) { return this.service.update(id, dto); }

    @Permissions(PERMISSIONS.SHIPPING_PLAN_DELETE)
    @Delete(':id')
    remove(@Param('id') id: string) { return this.service.remove(id); }
}
