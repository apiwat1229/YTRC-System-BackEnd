import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CreateRubberTypeDto } from './dto/create-rubber-type.dto';
import { UpdateRubberTypeDto } from './dto/update-rubber-type.dto';
import { RubberTypesService } from './rubber-types.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('rubber-types')
export class RubberTypesController {
    constructor(private readonly rubberTypesService: RubberTypesService) { }

    @Post()
    create(@Body() dto: CreateRubberTypeDto) {
        return this.rubberTypesService.create(dto);
    }

    @Get()
    findAll(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('search') search: string,
    ) {
        return this.rubberTypesService.findAll({ page, limit, search });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.rubberTypesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateRubberTypeDto) {
        return this.rubberTypesService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.rubberTypesService.remove(id);
    }
}
