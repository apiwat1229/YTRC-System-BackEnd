import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @Post()
    create(@Body() dto: CreateBookingDto) {
        return this.bookingsService.create(dto);
    }

    @Get()
    findAll(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('search') search: string,
        @Query('status') status: string,
        @Query('date') date: string,
        @Query('supplierId') supplierId: string,
    ) {
        return this.bookingsService.findAll({ page, limit, search, status, date, supplierId });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bookingsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateBookingDto) {
        return this.bookingsService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.bookingsService.remove(id);
    }

    @Post(':id/approve')
    approve(@Param('id') id: string, @CurrentUser() user: any) {
        return this.bookingsService.approve(id, user.id);
    }

    @Post(':id/checkin')
    checkin(@Param('id') id: string, @CurrentUser() user: any) {
        return this.bookingsService.checkin(id, user.id);
    }

    @Post(':id/lab-samples')
    addLabSample(@Param('id') id: string, @Body() sampleData: any) {
        return this.bookingsService.addLabSample(id, sampleData);
    }

    @Patch('/lab-samples/:sampleId')
    updateLabSample(@Param('sampleId') sampleId: string, @Body() data: any) {
        return this.bookingsService.updateLabSample(sampleId, data);
    }

    @Get(':id/lab-samples')
    findLabSamples(@Param('id') id: string) {
        return this.bookingsService.findLabSamples(id);
    }
}
