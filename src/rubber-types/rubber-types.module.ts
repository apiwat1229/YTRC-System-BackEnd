import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { RubberTypesController } from './rubber-types.controller';
import { RubberTypesService } from './rubber-types.service';

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [RubberTypesController],
    providers: [RubberTypesService],
    exports: [RubberTypesService],
})
export class RubberTypesModule { }
