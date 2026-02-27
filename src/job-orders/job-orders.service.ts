import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobOrderDto } from './dto/create-job-order.dto';

@Injectable()
export class JobOrdersService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateJobOrderDto) {
        return this.prisma.jobOrder.create({ data: { ...dto, qaDate: new Date(dto.qaDate) } });
    }

    async findAll(query?: { page?: number; limit?: number; search?: string }) {
        const page = query?.page || 1;
        const limit = query?.limit || 20;
        const skip = (page - 1) * limit;
        const where: any = {};
        if (query?.search) where.OR = [{ jobOrderNo: { contains: query.search, mode: 'insensitive' } }, { contractNo: { contains: query.search, mode: 'insensitive' } }];
        const [data, total] = await Promise.all([
            this.prisma.jobOrder.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { _count: { select: { logs: true } } } }),
            this.prisma.jobOrder.count({ where }),
        ]);
        return { data, total, page, limit };
    }

    async findOne(id: string) {
        const item = await this.prisma.jobOrder.findUnique({ where: { id }, include: { logs: { orderBy: { date: 'asc' } } } });
        if (!item) throw new NotFoundException(`JobOrder #${id} not found`);
        return item;
    }

    async update(id: string, dto: Partial<CreateJobOrderDto>) {
        await this.findOne(id);
        const data: any = { ...dto };
        if (data.qaDate) data.qaDate = new Date(data.qaDate);
        return this.prisma.jobOrder.update({ where: { id }, data });
    }

    async remove(id: string) {
        await this.findOne(id);
        await this.prisma.jobOrder.delete({ where: { id } });
        return { message: `JobOrder #${id} deleted` };
    }

    async closeJob(id: string, productionName: string, productionDate: string) {
        await this.findOne(id);
        return this.prisma.jobOrder.update({ where: { id }, data: { isClosed: true, productionName, productionDate: new Date(productionDate) } });
    }

    async addLog(jobOrderId: string, logData: any) {
        await this.findOne(jobOrderId);
        return this.prisma.jobOrderLog.create({ data: { ...logData, jobOrderId, date: new Date(logData.date) } });
    }

    async findLogs(jobOrderId: string) {
        return this.prisma.jobOrderLog.findMany({ where: { jobOrderId }, orderBy: { date: 'asc' } });
    }
}
