import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ITTicketsController } from './it-tickets.controller';
import { ITTicketsService } from './it-tickets.service';

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [ITTicketsController],
    providers: [ITTicketsService],
    exports: [ITTicketsService],
})
export class ITTicketsModule { }
