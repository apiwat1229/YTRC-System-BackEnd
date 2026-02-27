import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateBookingDto) {
        return (this.prisma as any).booking.create({ data: dto });
    }

    async findAll(query?: { page?: number; limit?: number; search?: string; status?: string; date?: string; supplierId?: string }) {
        const { page = 1, limit = 20, search, status, date, supplierId } = query || {};
        const skip = (page - 1) * limit;
        const where: any = { deletedAt: null };
        if (status) where.status = status;
        if (supplierId) where.supplierId = supplierId;
        if (date) where.date = new Date(date);
        if (search) {
            where.OR = [
                { bookingCode: { contains: search, mode: 'insensitive' } },
                { supplierName: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [data, total] = await Promise.all([
            (this.prisma as any).booking.findMany({ where, skip, take: +limit, orderBy: { createdAt: 'desc' } }),
            (this.prisma as any).booking.count({ where }),
        ]);
        return { data, total, page: +page, limit: +limit };
    }

    async findOne(id: string) {
        const record = await (this.prisma as any).booking.findUnique({ where: { id, deletedAt: null } });
        if (!record) throw new NotFoundException(`Booking #${id} not found`);
        return record;
    }

    async update(id: string, dto: UpdateBookingDto) {
        await this.findOne(id);
        return (this.prisma as any).booking.update({ where: { id }, data: dto });
    }

    async remove(id: string) {
        await this.findOne(id);
        return (this.prisma as any).booking.update({ where: { id }, data: { deletedAt: new Date() } });
    }

    async approve(id: string, userId: string) {
        await this.findOne(id);
        return (this.prisma as any).booking.update({ where: { id }, data: { status: 'APPROVED', approvedBy: userId, approvedAt: new Date() } });
    }

    async checkin(id: string, userId: string) {
        await this.findOne(id);
        return (this.prisma as any).booking.update({ where: { id }, data: { status: 'CHECKED_IN', checkedInBy: userId, checkedInAt: new Date() } });
    }

    async addLabSample(bookingId: string, sampleData: any) {
        await this.findOne(bookingId);
        return (this.prisma as any).labSample.create({ data: { ...sampleData, bookingId } });
    }

    async updateLabSample(sampleId: string, data: any) {
        return (this.prisma as any).labSample.update({ where: { id: sampleId }, data });
    }

    async findLabSamples(bookingId: string) {
        return (this.prisma as any).labSample.findMany({ where: { bookingId } });
    }
}
