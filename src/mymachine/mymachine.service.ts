import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MymachineService {
    constructor(private prisma: PrismaService) { }

    async getMyMachines(department?: string) {
        const where: any = {};
        if (department) where.location = { contains: department, mode: 'insensitive' };
        return this.prisma.machine.findMany({ where, include: { _count: { select: { repairs: true } } }, orderBy: { name: 'asc' } });
    }

    async getMyRepairLogs(query?: { page?: number; limit?: number; machineId?: string }) {
        const page = query?.page || 1;
        const limit = query?.limit || 20;
        const skip = (page - 1) * limit;
        const where: any = {};
        if (query?.machineId) where.machineId = query.machineId;
        const [data, total] = await Promise.all([
            this.prisma.repairLog.findMany({ where, skip, take: limit, orderBy: { date: 'desc' }, include: { machine: true } }),
            this.prisma.repairLog.count({ where }),
        ]);
        return { data, total, page, limit };
    }
}
