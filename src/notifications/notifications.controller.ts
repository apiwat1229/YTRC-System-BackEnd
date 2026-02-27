import {
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Query,
    UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly service: NotificationsService) { }

    @Get()
    findForUser(
        @CurrentUser() user: any,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('status') status?: string,
    ) {
        return this.service.findForUser(user.id, { page, limit, status });
    }

    @Get('unread-count')
    countUnread(@CurrentUser() user: any) {
        return this.service.countUnread(user.id);
    }

    @Patch(':id/read')
    markAsRead(@Param('id') id: string, @CurrentUser() user: any) {
        return this.service.markAsRead(id, user.id);
    }

    @Patch('read-all')
    markAllAsRead(@CurrentUser() user: any) {
        return this.service.markAllAsRead(user.id);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.service.deleteNotification(id);
    }

    @Get('settings')
    getSettings() {
        return this.service.getSettings();
    }
}
