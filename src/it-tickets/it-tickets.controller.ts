import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PERMISSIONS } from '../auth/constants/permissions';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CreateITTicketDto } from './dto/create-it-ticket.dto';
import { ITTicketsService } from './it-tickets.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('it-tickets')
export class ITTicketsController {
    constructor(private readonly service: ITTicketsService) { }

    @Permissions(PERMISSIONS.IT_TICKET_CREATE)
    @Post()
    create(@Body() dto: CreateITTicketDto) { return this.service.create(dto); }

    @Permissions(PERMISSIONS.IT_TICKET_VIEW)
    @Get()
    findAll(@Query('page') page?: number, @Query('limit') limit?: number, @Query('search') search?: string, @Query('status') status?: string) {
        return this.service.findAll({ page, limit, search, status });
    }

    @Permissions(PERMISSIONS.IT_TICKET_VIEW)
    @Get(':id')
    findOne(@Param('id') id: string) { return this.service.findOne(id); }

    @Permissions(PERMISSIONS.IT_TICKET_EDIT)
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: Partial<CreateITTicketDto>) { return this.service.update(id, dto); }

    @Permissions(PERMISSIONS.IT_TICKET_DELETE)
    @Delete(':id')
    remove(@Param('id') id: string) { return this.service.remove(id); }

    @Get(':id/comments')
    findComments(@Param('id') id: string) { return this.service.findComments(id); }

    @Post(':id/comments')
    addComment(@Param('id') id: string, @CurrentUser() user: any, @Body('content') content: string) {
        return this.service.addComment(id, user.id, content);
    }

    @Permissions(PERMISSIONS.IT_TICKET_EDIT)
    @Post(':id/assign')
    assign(@Param('id') id: string, @Body('assigneeId') assigneeId: string) { return this.service.assign(id, assigneeId); }

    @Permissions(PERMISSIONS.IT_TICKET_EDIT)
    @Post(':id/resolve')
    resolve(@Param('id') id: string) { return this.service.resolve(id); }
}
