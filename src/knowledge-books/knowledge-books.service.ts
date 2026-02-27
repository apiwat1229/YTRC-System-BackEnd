import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKnowledgeBookDto } from './dto/create-knowledge-book.dto';

@Injectable()
export class KnowledgeBooksService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateKnowledgeBookDto) {
        const data: any = { ...dto };
        if (data.trainingDate) data.trainingDate = new Date(data.trainingDate);
        return this.prisma.knowledgeBook.create({ data });
    }

    async findAll(query?: { page?: number; limit?: number; search?: string; category?: string }) {
        const page = query?.page || 1;
        const limit = query?.limit || 20;
        const skip = (page - 1) * limit;
        const where: any = { isPublished: true };
        if (query?.search) where.OR = [{ title: { contains: query.search, mode: 'insensitive' } }, { description: { contains: query.search, mode: 'insensitive' } }];
        if (query?.category) where.category = query.category;
        const [data, total] = await Promise.all([
            this.prisma.knowledgeBook.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { uploader: { omit: { password: true } as any } } }),
            this.prisma.knowledgeBook.count({ where }),
        ]);
        return { data, total, page, limit };
    }

    async findOne(id: string) {
        const item = await this.prisma.knowledgeBook.findUnique({ where: { id }, include: { uploader: { omit: { password: true } as any } } });
        if (!item) throw new NotFoundException(`KnowledgeBook #${id} not found`);
        return item;
    }

    async update(id: string, dto: Partial<CreateKnowledgeBookDto>) {
        await this.findOne(id);
        const data: any = { ...dto };
        if (data.trainingDate) data.trainingDate = new Date(data.trainingDate);
        return this.prisma.knowledgeBook.update({ where: { id }, data });
    }

    async remove(id: string) {
        await this.findOne(id);
        await this.prisma.knowledgeBook.delete({ where: { id } });
        return { message: `KnowledgeBook #${id} deleted` };
    }

    async recordView(bookId: string, userId: string) {
        await this.findOne(bookId);
        await this.prisma.bookView.create({ data: { bookId, userId } });
        return this.prisma.knowledgeBook.update({ where: { id: bookId }, data: { views: { increment: 1 } } });
    }

    async download(bookId: string) {
        await this.findOne(bookId);
        return this.prisma.knowledgeBook.update({ where: { id: bookId }, data: { downloads: { increment: 1 } } });
    }
}
