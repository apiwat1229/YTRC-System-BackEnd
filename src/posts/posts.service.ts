import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreatePostDto) {
        return (this.prisma as any).post.create({ data: dto });
    }

    async findAll(query?: { page?: number; limit?: number; search?: string }) {
        const { page = 1, limit = 20, search } = query || {};
        const skip = (page - 1) * limit;
        const where: any = {};
        if (search) where.title = { contains: search, mode: 'insensitive' };
        const [data, total] = await Promise.all([
            (this.prisma as any).post.findMany({ where, skip, take: +limit, orderBy: { createdAt: 'desc' } }),
            (this.prisma as any).post.count({ where }),
        ]);
        return { data, total, page: +page, limit: +limit };
    }

    async findOne(id: string) {
        const record = await (this.prisma as any).post.findUnique({ where: { id } });
        if (!record) throw new NotFoundException(`Post #${id} not found`);
        return record;
    }

    async update(id: string, dto: UpdatePostDto) {
        await this.findOne(id);
        return (this.prisma as any).post.update({ where: { id }, data: dto });
    }

    async remove(id: string) {
        await this.findOne(id);
        return (this.prisma as any).post.delete({ where: { id } });
    }
}
