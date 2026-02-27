import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { MymachineController } from './mymachine.controller';
import { MymachineService } from './mymachine.service';

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [MymachineController],
    providers: [MymachineService],
    exports: [MymachineService],
})
export class MymachineModule { }
