import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SuppliersService } from './suppliers.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('suppliers')
export class SuppliersController {
    constructor(private readonly suppliersService: SuppliersService) { }

    @Post()
    create(@Body() dto: CreateSupplierDto) {
        return this.suppliersService.create(dto);
    }

    @Get()
    findAll(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('search') search: string,
    ) {
        return this.suppliersService.findAll({ page, limit, search });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.suppliersService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateSupplierDto) {
        return this.suppliersService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.suppliersService.remove(id);
    }
}
