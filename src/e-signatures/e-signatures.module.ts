import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ESignaturesController } from './e-signatures.controller';
import { ESignaturesService } from './e-signatures.service';

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [ESignaturesController],
    providers: [ESignaturesService],
    exports: [ESignaturesService],
})
export class ESignaturesModule { }
