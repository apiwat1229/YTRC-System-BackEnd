import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationGroupsController } from './notification-groups.controller';
import { NotificationGroupsService } from './notification-groups.service';

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [NotificationGroupsController],
    providers: [NotificationGroupsService],
    exports: [NotificationGroupsService],
})
export class NotificationGroupsModule { }
