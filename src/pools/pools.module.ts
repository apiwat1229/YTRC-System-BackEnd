import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PoolsController } from './pools.controller';
import { PoolsService } from './pools.service';

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [PoolsController],
    providers: [PoolsService],
    exports: [PoolsService],
})
export class PoolsModule { }
