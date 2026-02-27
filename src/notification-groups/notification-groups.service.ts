import {
    Injectable,
    NotFoundException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationGroupDto } from './dto/create-notification-group.dto';

@Injectable()
export class NotificationGroupsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateNotificationGroupDto) {
        const { memberIds, ...data } = dto;
        return this.prisma.notificationGroup.create({
            data: {
                ...data,
                ...(memberIds?.length
                    ? { members: { connect: memberIds.map((id) => ({ id })) } }
                    : {}),
            },
            include: { members: { omit: { password: true } as any } },
        });
    }

    async findAll() {
        return this.prisma.notificationGroup.findMany({
            include: {
                members: { omit: { password: true } as any },
                _count: { select: { members: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const group = await this.prisma.notificationGroup.findUnique({
            where: { id },
            include: { members: { omit: { password: true } as any } },
        });
        if (!group) throw new NotFoundException(`NotificationGroup #${id} not found`);
        return group;
    }

    async update(id: string, dto: Partial<CreateNotificationGroupDto>) {
        await this.findOne(id);
        const { memberIds, ...data } = dto;
        return this.prisma.notificationGroup.update({
            where: { id },
            data: {
                ...data,
                ...(memberIds !== undefined
                    ? { members: { set: memberIds.map((mid) => ({ id: mid })) } }
                    : {}),
            },
            include: { members: { omit: { password: true } as any } },
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        await this.prisma.notificationGroup.delete({ where: { id } });
        return { message: `NotificationGroup #${id} deleted` };
    }

    async addMembers(id: string, userIds: string[]) {
        await this.findOne(id);
        return this.prisma.notificationGroup.update({
            where: { id },
            data: { members: { connect: userIds.map((uid) => ({ id: uid })) } },
            include: { members: { omit: { password: true } as any } },
        });
    }

    async removeMembers(id: string, userIds: string[]) {
        await this.findOne(id);
        return this.prisma.notificationGroup.update({
            where: { id },
            data: { members: { disconnect: userIds.map((uid) => ({ id: uid })) } },
            include: { members: { omit: { password: true } as any } },
        });
    }
}
