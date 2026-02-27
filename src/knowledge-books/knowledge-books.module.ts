import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { KnowledgeBooksController } from './knowledge-books.controller';
import { KnowledgeBooksService } from './knowledge-books.service';

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [KnowledgeBooksController],
    providers: [KnowledgeBooksService],
    exports: [KnowledgeBooksService],
})
export class KnowledgeBooksModule { }
