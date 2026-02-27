import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CreatePoolDto } from './dto/create-pool.dto';
import { PoolsService } from './pools.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('pools')
export class PoolsController {
    constructor(private readonly poolsService: PoolsService) { }

    @Post()
    create(@Body() dto: CreatePoolDto) {
        return this.poolsService.create(dto);
    }

    @Get()
    findAll(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('search') search: string,
        @Query('status') status: string,
    ) {
        return this.poolsService.findAll({ page, limit, search, status });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.poolsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: Partial<CreatePoolDto>) {
        return this.poolsService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.poolsService.remove(id);
    }

    @Post(':id/items')
    addItem(@Param('id') id: string, @Body() itemData: any) {
        return this.poolsService.addItem(id, itemData);
    }

    @Delete('items/:itemId')
    removeItem(@Param('itemId') itemId: string) {
        return this.poolsService.removeItem(itemId);
    }

    @Get(':id/items')
    findItems(@Param('id') id: string) {
        return this.poolsService.findItems(id);
    }
}
