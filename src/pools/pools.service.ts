import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePoolDto } from './dto/create-pool.dto';

@Injectable()
export class PoolsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreatePoolDto) {
        return (this.prisma as any).pool.create({ data: dto });
    }

    async findAll(query?: { page?: number; limit?: number; search?: string; status?: string }) {
        const { page = 1, limit = 20, search, status } = query || {};
        const skip = (page - 1) * limit;
        const where: any = {};
        if (status) where.status = status;
        if (search) where.name = { contains: search, mode: 'insensitive' };
        const [data, total] = await Promise.all([
            (this.prisma as any).pool.findMany({ where, skip, take: +limit, orderBy: { createdAt: 'desc' } }),
            (this.prisma as any).pool.count({ where }),
        ]);
        return { data, total, page: +page, limit: +limit };
    }

    async findOne(id: string) {
        const record = await (this.prisma as any).pool.findUnique({ where: { id } });
        if (!record) throw new NotFoundException(`Pool #${id} not found`);
        return record;
    }

    async update(id: string, dto: Partial<CreatePoolDto>) {
        await this.findOne(id);
        return (this.prisma as any).pool.update({ where: { id }, data: dto });
    }

    async remove(id: string) {
        await this.findOne(id);
        return (this.prisma as any).pool.delete({ where: { id } });
    }

    async addItem(poolId: string, itemData: any) {
        await this.findOne(poolId);
        return (this.prisma as any).poolItem.create({ data: { ...itemData, poolId } });
    }

    async removeItem(itemId: string) {
        return (this.prisma as any).poolItem.delete({ where: { id: itemId } });
    }

    async findItems(poolId: string) {
        return (this.prisma as any).poolItem.findMany({ where: { poolId } });
    }
}
