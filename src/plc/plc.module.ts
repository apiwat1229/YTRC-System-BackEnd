import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PlcController } from './plc.controller';
import { PlcGateway } from './plc.gateway';
import { PlcService } from './plc.service';

@Module({
    imports: [AuthModule],
    controllers: [PlcController],
    providers: [PlcService, PlcGateway],
    exports: [PlcService, PlcGateway],
})
export class PlcModule { }
