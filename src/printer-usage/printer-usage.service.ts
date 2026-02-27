import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrinterUsageDto } from './dto/create-printer-usage.dto';

@Injectable()
export class PrinterUsageService {
    constructor(private prisma: PrismaService) { }

    // Departments
    async findDepartments() {
        return this.prisma.printerDepartment.findMany({ orderBy: { name: 'asc' }, include: { _count: { select: { userMappings: true, usageRecords: true } } } });
    }

    async createDepartment(name: string, description?: string) {
        return this.prisma.printerDepartment.create({ data: { name, description } });
    }

    async updateDepartment(id: string, name: string, description?: string) {
        return this.prisma.printerDepartment.update({ where: { id }, data: { name, description } });
    }

    async removeDepartment(id: string) {
        await this.prisma.printerDepartment.delete({ where: { id } });
        return { message: 'Department deleted' };
    }

    // User Mappings
    async findMappings() {
        return this.prisma.printerUserMapping.findMany({ include: { department: true }, orderBy: { userName: 'asc' } });
    }

    async upsertMapping(userName: string, departmentId: string) {
        return this.prisma.printerUserMapping.upsert({
            where: { userName },
            create: { userName, departmentId },
            update: { departmentId },
            include: { department: true },
        });
    }

    async removeMapping(userName: string) {
        await this.prisma.printerUserMapping.delete({ where: { userName } });
        return { message: 'Mapping removed' };
    }

    // Records
    async findRecords(query?: { page?: number; limit?: number; period?: string; departmentId?: string }) {
        const page = query?.page || 1;
        const limit = query?.limit || 50;
        const skip = (page - 1) * limit;
        const where: any = {};
        if (query?.period) where.period = new Date(query.period);
        if (query?.departmentId) where.departmentId = query.departmentId;
        const [data, total] = await Promise.all([
            this.prisma.printerUsageRecord.findMany({ where, skip, take: limit, orderBy: { period: 'desc' }, include: { department: true } }),
            this.prisma.printerUsageRecord.count({ where }),
        ]);
        return { data, total, page, limit };
    }

    async createRecord(dto: CreatePrinterUsageDto) {
        return this.prisma.printerUsageRecord.create({ data: { ...dto, period: new Date(dto.period) } as any });
    }

    async bulkUpsert(records: CreatePrinterUsageDto[]) {
        const results = await Promise.all(
            records.map((record) =>
                this.prisma.printerUsageRecord.upsert({
                    where: { period_userName_serialNo: { period: new Date(record.period), userName: record.userName, serialNo: record.serialNo || 'unknown' } },
                    create: { ...record, period: new Date(record.period), serialNo: record.serialNo || 'unknown' } as any,
                    update: { ...record, period: new Date(record.period), serialNo: record.serialNo || 'unknown' } as any,
                }),
            ),
        );
        return { count: results.length, records: results };
    }

    async getStats(period?: string) {
        const where: any = {};
        if (period) where.period = new Date(period);
        return this.prisma.printerUsageRecord.groupBy({
            by: ['departmentId'],
            where,
            _sum: { printBW: true, printColor: true, copyBW: true, copyColor: true, total: true },
            orderBy: { _sum: { total: 'desc' } },
        });
    }
}
