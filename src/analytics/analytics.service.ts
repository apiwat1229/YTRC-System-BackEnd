import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
    constructor(private readonly prisma: PrismaService) { }

    async getBookingStats(dateFrom?: string, dateTo?: string) {
        const where: any = {};
        if (dateFrom || dateTo) {
            where.date = {};
            if (dateFrom) where.date.gte = new Date(dateFrom);
            if (dateTo) where.date.lte = new Date(dateTo);
        }
        const [byStatus, bySupplier, total] = await Promise.all([
            (this.prisma as any).booking.groupBy({
                by: ['status'],
                where,
                _count: { id: true },
            }),
            (this.prisma as any).booking.groupBy({
                by: ['supplierId', 'supplierName'],
                where,
                _count: { id: true },
            }),
            (this.prisma as any).booking.count({ where }),
        ]);
        return { byStatus, bySupplier, total };
    }

    async getUserStats() {
        const [byRole, byDepartment, total] = await Promise.all([
            (this.prisma as any).user.groupBy({ by: ['role'], _count: { id: true } }),
            (this.prisma as any).user.groupBy({ by: ['department'], _count: { id: true } }),
            (this.prisma as any).user.count(),
        ]);
        return { byRole, byDepartment, total };
    }

    async getJobOrderStats() {
        const [byStatus, totals] = await Promise.all([
            (this.prisma as any).jobOrder.groupBy({ by: ['status'], _count: { id: true } }),
            (this.prisma as any).jobOrder.aggregate({
                _sum: { quantityBale: true, orderQuantity: true },
                _count: { id: true },
            }),
        ]);
        return { byStatus, totals };
    }

    async getSupplierStats() {
        const byRubberType = await (this.prisma as any).supplier.groupBy({
            by: ['rubberType'],
            where: { deletedAt: null },
            _count: { id: true },
        });
        const total = await (this.prisma as any).supplier.count({ where: { deletedAt: null } });
        return { byRubberType, total };
    }
}
