import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductionReportDto } from './dto/create-production-report.dto';

@Injectable()
export class ProductionReportsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateProductionReportDto) {
        const { rows, ...data } = dto;
        const report = await this.prisma.productionReport.create({
            data: {
                ...data,
                productionDate: new Date(data.productionDate),
                ...(rows?.length
                    ? { rows: { createMany: { data: rows } } }
                    : {}),
            },
            include: { rows: true },
        });
        return report;
    }

    async findAll(query?: { page?: number; limit?: number; search?: string; status?: string }) {
        const page = query?.page || 1;
        const limit = query?.limit || 20;
        const skip = (page - 1) * limit;
        const where: any = {};
        if (query?.search) where.OR = [{ bookNo: { contains: query.search, mode: 'insensitive' } }, { dryerName: { contains: query.search, mode: 'insensitive' } }];
        if (query?.status) where.status = query.status;
        const [data, total] = await Promise.all([
            this.prisma.productionReport.findMany({ where, skip, take: limit, orderBy: { productionDate: 'desc' }, include: { _count: { select: { rows: true } } } }),
            this.prisma.productionReport.count({ where }),
        ]);
        return { data, total, page, limit };
    }

    async findOne(id: string) {
        const item = await this.prisma.productionReport.findUnique({ where: { id }, include: { rows: { orderBy: { startTime: 'asc' } } } });
        if (!item) throw new NotFoundException(`ProductionReport #${id} not found`);
        return item;
    }

    async update(id: string, dto: Partial<CreateProductionReportDto>) {
        await this.findOne(id);
        const { rows, ...data } = dto;
        const updateData: any = { ...data };
        if (data.productionDate) updateData.productionDate = new Date(data.productionDate);
        return this.prisma.productionReport.update({ where: { id }, data: updateData, include: { rows: true } });
    }

    async remove(id: string) {
        await this.findOne(id);
        await this.prisma.productionReport.delete({ where: { id } });
        return { message: `ProductionReport #${id} deleted` };
    }

    async addRow(reportId: string, rowData: any) {
        await this.findOne(reportId);
        return this.prisma.productionReportRow.create({ data: { ...rowData, reportId } });
    }

    async updateRow(rowId: string, data: any) {
        return this.prisma.productionReportRow.update({ where: { id: rowId }, data });
    }

    async removeRow(rowId: string) {
        await this.prisma.productionReportRow.delete({ where: { id: rowId } });
        return { message: 'Row deleted' };
    }
}
