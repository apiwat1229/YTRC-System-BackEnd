import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateESignatureDto } from './dto/create-e-signature.dto';

@Injectable()
export class ESignaturesService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateESignatureDto) {
        return this.prisma.eSignature.create({ data: dto });
    }

    async findAll(query?: { page?: number; limit?: number }) {
        const page = query?.page || 1;
        const limit = query?.limit || 20;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.eSignature.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
            this.prisma.eSignature.count(),
        ]);
        return { data, total, page, limit };
    }

    async findOne(id: string) {
        const item = await this.prisma.eSignature.findUnique({ where: { id } });
        if (!item) throw new NotFoundException(`ESignature #${id} not found`);
        return item;
    }

    async findByEmployeeId(employeeId: string) {
        return this.prisma.eSignature.findMany({ where: { employeeId }, orderBy: { createdAt: 'desc' } });
    }

    async update(id: string, dto: Partial<CreateESignatureDto>) {
        await this.findOne(id);
        return this.prisma.eSignature.update({ where: { id }, data: dto });
    }

    async remove(id: string) {
        await this.findOne(id);
        await this.prisma.eSignature.delete({ where: { id } });
        return { message: `ESignature #${id} deleted` };
    }
}
