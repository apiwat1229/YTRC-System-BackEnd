import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertAppPermissionDto } from './dto/access-control.dto';

@Injectable()
export class AccessControlService {
    constructor(private prisma: PrismaService) { }

    async upsert(dto: UpsertAppPermissionDto) {
        return this.prisma.userAppPermission.upsert({
            where: { userId_appName: { userId: dto.userId, appName: dto.appName } },
            create: { userId: dto.userId, appName: dto.appName, actions: dto.actions },
            update: { actions: dto.actions },
        });
    }

    async findByUser(userId: string) {
        return this.prisma.userAppPermission.findMany({ where: { userId } });
    }

    async findByUserAndApp(userId: string, appName: string) {
        return this.prisma.userAppPermission.findUnique({
            where: { userId_appName: { userId, appName } },
        });
    }

    async remove(userId: string, appName: string) {
        const existing = await this.prisma.userAppPermission.findUnique({
            where: { userId_appName: { userId, appName } },
        });
        if (!existing) throw new NotFoundException('Permission not found');
        await this.prisma.userAppPermission.delete({
            where: { userId_appName: { userId, appName } },
        });
        return { message: 'Permission removed' };
    }

    async findAll() {
        return this.prisma.userAppPermission.findMany({
            include: { user: { omit: { password: true } as any } },
        });
    }
}
