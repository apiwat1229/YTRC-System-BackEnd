import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateITTicketDto } from './dto/create-it-ticket.dto';

@Injectable()
export class ITTicketsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateITTicketDto) {
        return this.prisma.iTTicket.create({ data: dto as any, include: { requester: { omit: { password: true } as any } } });
    }

    async findAll(query?: { page?: number; limit?: number; search?: string; status?: string; requesterId?: string }) {
        const page = query?.page || 1;
        const limit = query?.limit || 20;
        const skip = (page - 1) * limit;
        const where: any = {};
        if (query?.search) where.OR = [{ title: { contains: query.search, mode: 'insensitive' } }, { ticketNo: { contains: query.search, mode: 'insensitive' } }];
        if (query?.status) where.status = query.status;
        if (query?.requesterId) where.requesterId = query.requesterId;
        const [data, total] = await Promise.all([
            this.prisma.iTTicket.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { requester: { omit: { password: true } as any }, assignee: { omit: { password: true } as any } } }),
            this.prisma.iTTicket.count({ where }),
        ]);
        return { data, total, page, limit };
    }

    async findOne(id: string) {
        const item = await this.prisma.iTTicket.findUnique({ where: { id }, include: { requester: { omit: { password: true } as any }, assignee: { omit: { password: true } as any }, comments: { include: { user: { omit: { password: true } as any } } }, asset: true } });
        if (!item) throw new NotFoundException(`ITTicket #${id} not found`);
        return item;
    }

    async update(id: string, dto: Partial<CreateITTicketDto>) {
        await this.findOne(id);
        return this.prisma.iTTicket.update({ where: { id }, data: dto as any });
    }

    async remove(id: string) {
        await this.findOne(id);
        await this.prisma.iTTicket.delete({ where: { id } });
        return { message: `ITTicket #${id} deleted` };
    }

    async addComment(ticketId: string, userId: string, content: string) {
        await this.findOne(ticketId);
        return this.prisma.ticketComment.create({ data: { ticketId, userId, content } });
    }

    async findComments(ticketId: string) {
        return this.prisma.ticketComment.findMany({ where: { ticketId }, include: { user: { omit: { password: true } as any } }, orderBy: { createdAt: 'asc' } });
    }

    async assign(ticketId: string, assigneeId: string) {
        await this.findOne(ticketId);
        return this.prisma.iTTicket.update({ where: { id: ticketId }, data: { assigneeId, status: 'InProgress' } });
    }

    async resolve(ticketId: string) {
        await this.findOne(ticketId);
        return this.prisma.iTTicket.update({ where: { id: ticketId }, data: { status: 'Resolved', resolvedAt: new Date() } });
    }
}
