import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PERMISSIONS } from '../auth/constants/permissions';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { PlcGateway } from './plc.gateway';
import { PlcService } from './plc.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('plc')
export class PlcController {
    constructor(
        private readonly service: PlcService,
        private readonly gateway: PlcGateway,
    ) { }

    @Permissions(PERMISSIONS.PLC_VIEW)
    @Get('status')
    getStatus() {
        return this.service.getStatus();
    }

    @Permissions(PERMISSIONS.PLC_CONTROL)
    @Post('data')
    pushData(@Body() data: any) {
        const saved = this.service.setData(data);
        this.gateway.broadcastPlcData(saved);
        return saved;
    }
}
