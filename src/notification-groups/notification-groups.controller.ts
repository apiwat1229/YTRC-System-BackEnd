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
import { CreateNotificationGroupDto } from './dto/create-notification-group.dto';
import { NotificationGroupsService } from './notification-groups.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('notification-groups')
export class NotificationGroupsController {
    constructor(private readonly service: NotificationGroupsService) { }

    @Permissions(PERMISSIONS.NOTIFICATION_MANAGE)
    @Post()
    create(@Body() dto: CreateNotificationGroupDto) {
        return this.service.create(dto);
    }

    @Permissions(PERMISSIONS.NOTIFICATION_VIEW)
    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Permissions(PERMISSIONS.NOTIFICATION_VIEW)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Permissions(PERMISSIONS.NOTIFICATION_MANAGE)
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: Partial<CreateNotificationGroupDto>) {
        return this.service.update(id, dto);
    }

    @Permissions(PERMISSIONS.NOTIFICATION_MANAGE)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }

    @Permissions(PERMISSIONS.NOTIFICATION_MANAGE)
    @Post(':id/members')
    addMembers(@Param('id') id: string, @Body('userIds') userIds: string[]) {
        return this.service.addMembers(id, userIds);
    }

    @Permissions(PERMISSIONS.NOTIFICATION_MANAGE)
    @Delete(':id/members')
    removeMembers(@Param('id') id: string, @Body('userIds') userIds: string[]) {
        return this.service.removeMembers(id, userIds);
    }
}
