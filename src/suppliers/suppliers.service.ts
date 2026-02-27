import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';

@Injectable()
export class SuppliersService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateSupplierDto) {
        return (this.prisma as any).supplier.create({ data: dto });
    }

    async findAll(query?: { page?: number; limit?: number; search?: string; isActive?: boolean }) {
        const { page = 1, limit = 20, search, isActive } = query || {};
        const skip = (page - 1) * limit;
        const where: any = { deletedAt: null };
        if (isActive !== undefined) where.isActive = isActive;
        if (search) {
            where.OR = [
                { code: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [data, total] = await Promise.all([
            (this.prisma as any).supplier.findMany({ where, skip, take: +limit, orderBy: { name: 'asc' } }),
            (this.prisma as any).supplier.count({ where }),
        ]);
        return { data, total, page: +page, limit: +limit };
    }

    async findOne(id: string) {
        const record = await (this.prisma as any).supplier.findUnique({ where: { id, deletedAt: null } });
        if (!record) throw new NotFoundException(`Supplier #${id} not found`);
        return record;
    }

    async update(id: string, dto: Partial<CreateSupplierDto>) {
        await this.findOne(id);
        return (this.prisma as any).supplier.update({ where: { id }, data: dto });
    }

    async remove(id: string) {
        await this.findOne(id);
        return (this.prisma as any).supplier.update({ where: { id }, data: { deletedAt: new Date() } });
    }
}
