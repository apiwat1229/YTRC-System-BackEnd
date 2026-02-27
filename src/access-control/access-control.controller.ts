import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import { PERMISSIONS } from '../auth/constants/permissions';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { AccessControlService } from './access-control.service';
import { UpsertAppPermissionDto } from './dto/access-control.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('access-control')
export class AccessControlController {
    constructor(private readonly service: AccessControlService) { }

    @Permissions(PERMISSIONS.ACCESS_CONTROL_MANAGE)
    @Post()
    upsert(@Body() dto: UpsertAppPermissionDto) {
        return this.service.upsert(dto);
    }

    @Permissions(PERMISSIONS.ACCESS_CONTROL_VIEW)
    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Permissions(PERMISSIONS.ACCESS_CONTROL_VIEW)
    @Get('user/:userId')
    findByUser(@Param('userId') userId: string) {
        return this.service.findByUser(userId);
    }

    @Permissions(PERMISSIONS.ACCESS_CONTROL_VIEW)
    @Get('user/:userId/app/:appName')
    findByUserAndApp(
        @Param('userId') userId: string,
        @Param('appName') appName: string,
    ) {
        return this.service.findByUserAndApp(userId, appName);
    }

    @Permissions(PERMISSIONS.ACCESS_CONTROL_MANAGE)
    @Delete('user/:userId/app/:appName')
    remove(
        @Param('userId') userId: string,
        @Param('appName') appName: string,
    ) {
        return this.service.remove(userId, appName);
    }
}
