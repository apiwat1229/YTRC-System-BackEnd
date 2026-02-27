import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShippingPlanDto } from './dto/create-shipping-plan.dto';

@Injectable()
export class ShippingPlansService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateShippingPlanDto) {
        const { items, ...data } = dto;
        return this.prisma.shippingPlan.create({
            data: {
                ...data,
                planDate: new Date(data.planDate),
                ...(items?.length ? { items: { createMany: { data: items } } } : {}),
            },
            include: { items: { include: { row: true } } },
        });
    }

    async findAll(query?: { page?: number; limit?: number; status?: string }) {
        const page = query?.page || 1;
        const limit = query?.limit || 20;
        const skip = (page - 1) * limit;
        const where: any = {};
        if (query?.status) where.status = query.status;
        const [data, total] = await Promise.all([
            this.prisma.shippingPlan.findMany({ where, skip, take: limit, orderBy: { planDate: 'desc' }, include: { _count: { select: { items: true } } } }),
            this.prisma.shippingPlan.count({ where }),
        ]);
        return { data, total, page, limit };
    }

    async findOne(id: string) {
        const item = await this.prisma.shippingPlan.findUnique({ where: { id }, include: { items: { include: { row: { include: { report: true } } } } } });
        if (!item) throw new NotFoundException(`ShippingPlan #${id} not found`);
        return item;
    }

    async update(id: string, dto: Partial<CreateShippingPlanDto>) {
        await this.findOne(id);
        const { items, ...data } = dto;
        const updateData: any = { ...data };
        if (data.planDate) updateData.planDate = new Date(data.planDate);
        return this.prisma.shippingPlan.update({ where: { id }, data: updateData, include: { items: true } });
    }

    async remove(id: string) {
        await this.findOne(id);
        await this.prisma.shippingPlan.delete({ where: { id } });
        return { message: `ShippingPlan #${id} deleted` };
    }

    async findAvailablePallets() {
        const usedRowIds = await this.prisma.shippingPlanItem.findMany({ select: { rowId: true, palletNo: true } });
        const usedSet = new Set(usedRowIds.map((u) => `${u.rowId}:${u.palletNo}`));

        const rows = await this.prisma.productionReportRow.findMany({
            include: { report: { select: { id: true, productionDate: true, grade: true, shift: true, bookNo: true, pageNo: true } } },
        });

        const available = rows.flatMap((row) => {
            const pallets = [1, 2, 3, 4, 5].filter((p) => {
                const weightKey = `weight${p}` as keyof typeof row;
                return row[weightKey] != null && !usedSet.has(`${row.id}:${p}`);
            });
            return pallets.map((p) => ({ rowId: row.id, palletNo: p, row }));
        });

        return available;
    }
}
