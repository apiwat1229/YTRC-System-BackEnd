import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService) { }

    async findForUser(
        userId: string,
        query?: { page?: number; limit?: number; status?: string },
    ) {
        const page = query?.page || 1;
        const limit = query?.limit || 20;
        const skip = (page - 1) * limit;
        const where: any = { userId };
        if (query?.status) where.status = query.status;

        const [data, total] = await Promise.all([
            this.prisma.notification.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.notification.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async markAsRead(id: string, userId: string) {
        const n = await this.prisma.notification.findFirst({
            where: { id, userId },
        });
        if (!n) throw new NotFoundException('Notification not found');
        return this.prisma.notification.update({
            where: { id },
            data: { status: 'READ' },
        });
    }

    async markAllAsRead(userId: string) {
        await this.prisma.notification.updateMany({
            where: { userId, status: 'UNREAD' },
            data: { status: 'READ' },
        });
        return { message: 'All notifications marked as read' };
    }

    async countUnread(userId: string) {
        const count = await this.prisma.notification.count({
            where: { userId, status: 'UNREAD' },
        });
        return { count };
    }

    async create(data: {
        title: string;
        message: string;
        type?: string;
        userId: string;
        sourceApp: string;
        actionType: string;
        entityId?: string;
        actionUrl?: string;
        metadata?: any;
        approvalRequestId?: string;
        approvalStatus?: string;
    }) {
        return this.prisma.notification.create({ data: data as any });
    }

    async getSettings() {
        return this.prisma.notificationSetting.findMany();
    }

    async upsertSetting(sourceApp: string, actionType: string, data: any) {
        return this.prisma.notificationSetting.upsert({
            where: { sourceApp_actionType: { sourceApp, actionType } },
            create: { sourceApp, actionType, ...data },
            update: data,
        });
    }

    async deleteNotification(id: string) {
        const n = await this.prisma.notification.findUnique({ where: { id } });
        if (!n) throw new NotFoundException('Notification not found');
        await this.prisma.notification.delete({ where: { id } });
        return { message: 'Notification deleted' };
    }
}
