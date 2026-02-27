import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductionReportsController } from './production-reports.controller';
import { ProductionReportsService } from './production-reports.service';

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [ProductionReportsController],
    providers: [ProductionReportsService],
    exports: [ProductionReportsService],
})
export class ProductionReportsModule { }
