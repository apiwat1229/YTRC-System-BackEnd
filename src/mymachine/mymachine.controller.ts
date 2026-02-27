import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MymachineService } from './mymachine.service';

@UseGuards(JwtAuthGuard)
@Controller('mymachine')
export class MymachineController {
    constructor(private readonly service: MymachineService) { }

    @Get('machines')
    getMyMachines(@CurrentUser() user: any) {
        return this.service.getMyMachines(user.department);
    }

    @Get('repair-logs')
    getMyRepairLogs(@CurrentUser() user: any, @Query('page') page?: number, @Query('limit') limit?: number, @Query('machineId') machineId?: string) {
        return this.service.getMyRepairLogs({ page, limit, machineId });
    }
}
