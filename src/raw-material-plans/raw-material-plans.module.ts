import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { RawMaterialPlansController } from './raw-material-plans.controller';
import { RawMaterialPlansService } from './raw-material-plans.service';

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [RawMaterialPlansController],
    providers: [RawMaterialPlansService],
    exports: [RawMaterialPlansService],
})
export class RawMaterialPlansModule { }
