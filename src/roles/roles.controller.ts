import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { PERMISSIONS } from '../auth/constants/permissions';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Permissions(PERMISSIONS.ROLE_CREATE)
    @Post()
    create(@Body() dto: CreateRoleDto) {
        return this.rolesService.create(dto);
    }

    @Permissions(PERMISSIONS.ROLE_VIEW)
    @Get()
    findAll() {
        return this.rolesService.findAll();
    }

    @Permissions(PERMISSIONS.ROLE_VIEW)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.rolesService.findOne(id);
    }

    @Permissions(PERMISSIONS.ROLE_EDIT)
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
        return this.rolesService.update(id, dto);
    }

    @Permissions(PERMISSIONS.ROLE_DELETE)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.rolesService.remove(id);
    }
}
