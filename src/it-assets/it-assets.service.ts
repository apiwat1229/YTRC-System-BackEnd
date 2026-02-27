import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateITAssetDto } from './dto/create-it-asset.dto';

@Injectable()
export class ITAssetsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateITAssetDto) {
        return this.prisma.iTAsset.create({ data: dto as any });
    }

    async findAll(query?: { page?: number; limit?: number; search?: string; category?: string }) {
        const page = query?.page || 1;
        const limit = query?.limit || 20;
        const skip = (page - 1) * limit;
        const where: any = {};
        if (query?.search) {
            where.OR = [
                { name: { contains: query.search, mode: 'insensitive' } },
                { code: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        if (query?.category) where.category = query.category;
        const [data, total] = await Promise.all([
            this.prisma.iTAsset.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
            this.prisma.iTAsset.count({ where }),
        ]);
        return { data, total, page, limit };
    }

    async findOne(id: string) {
        const item = await this.prisma.iTAsset.findUnique({ where: { id } });
        if (!item) throw new NotFoundException(`ITAsset #${id} not found`);
        return item;
    }

    async update(id: string, dto: Partial<CreateITAssetDto>) {
        await this.findOne(id);
        return this.prisma.iTAsset.update({ where: { id }, data: dto as any });
    }

    async remove(id: string) {
        await this.findOne(id);
        await this.prisma.iTAsset.delete({ where: { id } });
        return { message: `ITAsset #${id} deleted` };
    }

    async adjustStock(id: string, qty: number) {
        const item = await this.findOne(id);
        return this.prisma.iTAsset.update({
            where: { id },
            data: { stock: item.stock + qty },
        });
    }
}
