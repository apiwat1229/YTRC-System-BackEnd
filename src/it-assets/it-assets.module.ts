import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ITAssetsController } from './it-assets.controller';
import { ITAssetsService } from './it-assets.service';

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [ITAssetsController],
    providers: [ITAssetsService],
    exports: [ITAssetsService],
})
export class ITAssetsModule { }
