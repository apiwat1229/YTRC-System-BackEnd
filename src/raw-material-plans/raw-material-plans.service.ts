import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRawMaterialPlanDto } from './dto/create-raw-material-plan.dto';

@Injectable()
export class RawMaterialPlansService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateRawMaterialPlanDto) {
        const { rows, poolDetails, ...data } = dto;
        return this.prisma.rawMaterialPlan.create({
            data: {
                ...data,
                issuedDate: new Date(data.issuedDate),
                ...(rows?.length ? { rows: { createMany: { data: rows.map((r: any) => ({ ...r, date: new Date(r.date) })) } } } : {}),
                ...(poolDetails?.length ? { poolDetails: { createMany: { data: poolDetails } } } : {}),
            },
            include: { rows: true, poolDetails: true },
        });
    }

    async findAll(query?: { page?: number; limit?: number; status?: string }) {
        const page = query?.page || 1;
        const limit = query?.limit || 20;
        const skip = (page - 1) * limit;
        const where: any = {};
        if (query?.status) where.status = query.status;
        const [data, total] = await Promise.all([
            this.prisma.rawMaterialPlan.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
            this.prisma.rawMaterialPlan.count({ where }),
        ]);
        return { data, total, page, limit };
    }

    async findOne(id: string) {
        const item = await this.prisma.rawMaterialPlan.findUnique({ where: { id }, include: { rows: { orderBy: { date: 'asc' } }, poolDetails: true } });
        if (!item) throw new NotFoundException(`RawMaterialPlan #${id} not found`);
        return item;
    }

    async update(id: string, dto: Partial<CreateRawMaterialPlanDto>) {
        await this.findOne(id);
        const { rows, poolDetails, ...data } = dto;
        const updateData: any = { ...data };
        if (data.issuedDate) updateData.issuedDate = new Date(data.issuedDate);
        return this.prisma.rawMaterialPlan.update({ where: { id }, data: updateData, include: { rows: true, poolDetails: true } });
    }

    async remove(id: string) {
        await this.findOne(id);
        await this.prisma.rawMaterialPlan.delete({ where: { id } });
        return { message: `RawMaterialPlan #${id} deleted` };
    }
}
