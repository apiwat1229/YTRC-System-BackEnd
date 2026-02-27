import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CpkAnalysesController } from './cpk-analyses.controller';
import { CpkAnalysesService } from './cpk-analyses.service';

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [CpkAnalysesController],
    providers: [CpkAnalysesService],
    exports: [CpkAnalysesService],
})
export class CpkAnalysesModule { }
