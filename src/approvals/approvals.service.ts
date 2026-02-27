import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApprovalDto } from './dto/create-approval.dto';

@Injectable()
export class ApprovalsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateApprovalDto) {
        return this.prisma.approvalRequest.create({ data: dto as any });
    }

    async findAll(query?: { page?: number; limit?: number; status?: string; requesterId?: string; approverId?: string }) {
        const { page = 1, limit = 20, status, requesterId, approverId } = query || {};
        const skip = (page - 1) * limit;
        const where: any = {};
        if (status) where.status = status;
        if (requesterId) where.requesterId = requesterId;
        if (approverId) where.approverId = approverId;
        const [data, total] = await Promise.all([
            this.prisma.approvalRequest.findMany({ where, skip, take: +limit, orderBy: { submittedAt: 'desc' } }),
            this.prisma.approvalRequest.count({ where }),
        ]);
        return { data, total, page: +page, limit: +limit };
    }

    async findOne(id: string) {
        const record = await this.prisma.approvalRequest.findUnique({ where: { id } });
        if (!record) throw new NotFoundException(`ApprovalRequest #${id} not found`);
        return record;
    }

    async approve(id: string, approverId: string, remark?: string) {
        await this.findOne(id);
        const updated = await this.prisma.approvalRequest.update({
            where: { id },
            data: { status: 'APPROVED', approverId, updatedAt: new Date() } as any,
        });
        await this.prisma.approvalLog.create({
            data: { approvalRequestId: id, action: 'APPROVED', actorId: approverId, remark } as any,
        });
        return updated;
    }

    async reject(id: string, approverId: string, remark?: string) {
        await this.findOne(id);
        const updated = await this.prisma.approvalRequest.update({
            where: { id },
            data: { status: 'REJECTED', approverId, updatedAt: new Date() } as any,
        });
        await this.prisma.approvalLog.create({
            data: { approvalRequestId: id, action: 'REJECTED', actorId: approverId, remark } as any,
        });
        return updated;
    }

    async cancel(id: string, userId: string) {
        await this.findOne(id);
        const updated = await this.prisma.approvalRequest.update({
            where: { id },
            data: { status: 'CANCELLED', updatedAt: new Date() } as any,
        });
        await this.prisma.approvalLog.create({
            data: { approvalRequestId: id, action: 'CANCELLED', actorId: userId } as any,
        });
        return updated;
    }

    async findLogs(approvalRequestId: string) {
        return this.prisma.approvalLog.findMany({
            where: { approvalRequestId },
            orderBy: { createdAt: 'asc' },
        } as any);
    }
}
