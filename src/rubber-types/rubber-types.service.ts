import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRubberTypeDto } from './dto/create-rubber-type.dto';
import { UpdateRubberTypeDto } from './dto/update-rubber-type.dto';

@Injectable()
export class RubberTypesService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateRubberTypeDto) {
        return (this.prisma as any).rubberType.create({ data: dto });
    }

    async findAll(query?: { page?: number; limit?: number; search?: string }) {
        const { page = 1, limit = 20, search } = query || {};
        const skip = (page - 1) * limit;
        const where: any = { deletedAt: null };
        if (search) {
            where.OR = [
                { code: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [data, total] = await Promise.all([
            (this.prisma as any).rubberType.findMany({ where, skip, take: +limit, orderBy: { code: 'asc' } }),
            (this.prisma as any).rubberType.count({ where }),
        ]);
        return { data, total, page: +page, limit: +limit };
    }

    async findOne(id: string) {
        const record = await (this.prisma as any).rubberType.findUnique({ where: { id, deletedAt: null } });
        if (!record) throw new NotFoundException(`RubberType #${id} not found`);
        return record;
    }

    async update(id: string, dto: UpdateRubberTypeDto) {
        await this.findOne(id);
        return (this.prisma as any).rubberType.update({ where: { id }, data: dto });
    }

    async remove(id: string) {
        await this.findOne(id);
        return (this.prisma as any).rubberType.update({ where: { id }, data: { deletedAt: new Date() } });
    }
}
