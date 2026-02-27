import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { JobOrdersController } from './job-orders.controller';
import { JobOrdersService } from './job-orders.service';

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [JobOrdersController],
    providers: [JobOrdersService],
    exports: [JobOrdersService],
})
export class JobOrdersModule { }
