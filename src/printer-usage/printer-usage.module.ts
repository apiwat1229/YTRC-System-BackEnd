import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PrinterUsageController } from './printer-usage.controller';
import { PrinterUsageService } from './printer-usage.service';

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [PrinterUsageController],
    providers: [PrinterUsageService],
    exports: [PrinterUsageService],
})
export class PrinterUsageModule { }
