import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PERMISSIONS } from '../auth/constants/permissions';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CreateESignatureDto } from './dto/create-e-signature.dto';
import { ESignaturesService } from './e-signatures.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('e-signatures')
export class ESignaturesController {
    constructor(private readonly service: ESignaturesService) { }

    @Permissions(PERMISSIONS.E_SIGNATURE_CREATE)
    @Post()
    create(@Body() dto: CreateESignatureDto) { return this.service.create(dto); }

    @Permissions(PERMISSIONS.E_SIGNATURE_VIEW)
    @Get()
    findAll(@Query('page') page?: number, @Query('limit') limit?: number) { return this.service.findAll({ page, limit }); }

    @Permissions(PERMISSIONS.E_SIGNATURE_VIEW)
    @Get('by-employee/:employeeId')
    findByEmployee(@Param('employeeId') employeeId: string) { return this.service.findByEmployeeId(employeeId); }

    @Permissions(PERMISSIONS.E_SIGNATURE_VIEW)
    @Get(':id')
    findOne(@Param('id') id: string) { return this.service.findOne(id); }

    @Permissions(PERMISSIONS.E_SIGNATURE_EDIT)
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: Partial<CreateESignatureDto>) { return this.service.update(id, dto); }

    @Permissions(PERMISSIONS.E_SIGNATURE_DELETE)
    @Delete(':id')
    remove(@Param('id') id: string) { return this.service.remove(id); }
}
