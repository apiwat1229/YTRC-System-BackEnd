import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ShippingPlansController } from './shipping-plans.controller';
import { ShippingPlansService } from './shipping-plans.service';

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [ShippingPlansController],
    providers: [ShippingPlansService],
    exports: [ShippingPlansService],
})
export class ShippingPlansModule { }
