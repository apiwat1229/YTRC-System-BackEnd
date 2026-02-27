import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCpkAnalysisDto } from './dto/create-cpk-analysis.dto';

@Injectable()
export class CpkAnalysesService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateCpkAnalysisDto) {
        return this.prisma.cpkAnalysis.create({ data: dto });
    }

    async findAll(query?: { page?: number; limit?: number }) {
        const page = query?.page || 1;
        const limit = query?.limit || 20;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.cpkAnalysis.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
            this.prisma.cpkAnalysis.count(),
        ]);
        return { data, total, page, limit };
    }

    async findOne(id: string) {
        const item = await this.prisma.cpkAnalysis.findUnique({ where: { id } });
        if (!item) throw new NotFoundException(`CpkAnalysis #${id} not found`);
        return item;
    }

    async update(id: string, dto: Partial<CreateCpkAnalysisDto>) {
        await this.findOne(id);
        return this.prisma.cpkAnalysis.update({ where: { id }, data: dto });
    }

    async remove(id: string) {
        await this.findOne(id);
        await this.prisma.cpkAnalysis.delete({ where: { id } });
        return { message: `CpkAnalysis #${id} deleted` };
    }
}
