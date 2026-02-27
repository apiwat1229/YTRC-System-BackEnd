import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PERMISSIONS } from '../auth/constants/permissions';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CreateITAssetDto } from './dto/create-it-asset.dto';
import { ITAssetsService } from './it-assets.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('it-assets')
export class ITAssetsController {
    constructor(private readonly service: ITAssetsService) { }

    @Permissions(PERMISSIONS.IT_ASSET_CREATE)
    @Post()
    create(@Body() dto: CreateITAssetDto) { return this.service.create(dto); }

    @Permissions(PERMISSIONS.IT_ASSET_VIEW)
    @Get()
    findAll(@Query('page') page?: number, @Query('limit') limit?: number, @Query('search') search?: string, @Query('category') category?: string) {
        return this.service.findAll({ page, limit, search, category });
    }

    @Permissions(PERMISSIONS.IT_ASSET_VIEW)
    @Get(':id')
    findOne(@Param('id') id: string) { return this.service.findOne(id); }

    @Permissions(PERMISSIONS.IT_ASSET_EDIT)
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: Partial<CreateITAssetDto>) { return this.service.update(id, dto); }

    @Permissions(PERMISSIONS.IT_ASSET_DELETE)
    @Delete(':id')
    remove(@Param('id') id: string) { return this.service.remove(id); }

    @Permissions(PERMISSIONS.IT_ASSET_EDIT)
    @Post(':id/adjust-stock')
    adjustStock(@Param('id') id: string, @Body('qty') qty: number) { return this.service.adjustStock(id, qty); }
}
