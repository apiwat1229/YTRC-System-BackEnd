import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MasterService {
    constructor(private prisma: PrismaService) { }

    async findProvinces(search?: string) {
        const where: any = {};
        if (search) where.OR = [{ name_th: { contains: search, mode: 'insensitive' } }, { name_en: { contains: search, mode: 'insensitive' } }];
        return this.prisma.province.findMany({ where, orderBy: { name_th: 'asc' } });
    }

    async findDistricts(provinceId?: number, search?: string) {
        const where: any = {};
        if (provinceId) where.provinceId = Number(provinceId);
        if (search) where.OR = [{ name_th: { contains: search, mode: 'insensitive' } }, { name_en: { contains: search, mode: 'insensitive' } }];
        return this.prisma.district.findMany({ where, orderBy: { name_th: 'asc' } });
    }

    async findSubdistricts(districtId?: number, search?: string) {
        const where: any = {};
        if (districtId) where.districtId = Number(districtId);
        if (search) where.OR = [{ name_th: { contains: search, mode: 'insensitive' } }, { name_en: { contains: search, mode: 'insensitive' } }];
        return this.prisma.subdistrict.findMany({ where, orderBy: { name_th: 'asc' } });
    }
}
