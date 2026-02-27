import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMachineDto } from './dto/create-machine.dto';
import { CreateRepairLogDto } from './dto/create-repair-log.dto';
import { CreateMaintenanceStockDto } from './dto/create-stock.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { UpdateRepairLogDto } from './dto/update-repair-log.dto';
import { UpdateMaintenanceStockDto } from './dto/update-stock.dto';

@Injectable()
export class MaintenanceService {
    constructor(private readonly prisma: PrismaService) { }

    // Machines
    async createMachine(dto: CreateMachineDto) {
        return (this.prisma as any).machine.create({ data: dto });
    }

    async findAllMachines(query?: { search?: string; status?: string }) {
        const { search, status } = query || {};
        const where: any = {};
        if (status) where.status = status;
        if (search) where.name = { contains: search, mode: 'insensitive' };
        return (this.prisma as any).machine.findMany({ where, orderBy: { name: 'asc' } });
    }

    async findOneMachine(id: string) {
        const record = await (this.prisma as any).machine.findUnique({ where: { id } });
        if (!record) throw new NotFoundException(`Machine #${id} not found`);
        return record;
    }

    async updateMachine(id: string, dto: UpdateMachineDto) {
        await this.findOneMachine(id);
        return (this.prisma as any).machine.update({ where: { id }, data: dto });
    }

    async removeMachine(id: string) {
        await this.findOneMachine(id);
        return (this.prisma as any).machine.delete({ where: { id } });
    }

    // Repair Logs
    async createRepairLog(dto: CreateRepairLogDto) {
        return (this.prisma as any).repairLog.create({ data: dto });
    }

    async findRepairLogs(query?: { machineId?: string; status?: string; page?: number; limit?: number }) {
        const { machineId, status, page = 1, limit = 20 } = query || {};
        const where: any = {};
        if (machineId) where.machineId = machineId;
        if (status) where.status = status;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            (this.prisma as any).repairLog.findMany({ where, skip, take: +limit, orderBy: { createdAt: 'desc' } }),
            (this.prisma as any).repairLog.count({ where }),
        ]);
        return { data, total, page: +page, limit: +limit };
    }

    async findOneRepairLog(id: string) {
        const record = await (this.prisma as any).repairLog.findUnique({ where: { id } });
        if (!record) throw new NotFoundException(`RepairLog #${id} not found`);
        return record;
    }

    async updateRepairLog(id: string, dto: UpdateRepairLogDto) {
        await this.findOneRepairLog(id);
        return (this.prisma as any).repairLog.update({ where: { id }, data: dto });
    }

    async removeRepairLog(id: string) {
        await this.findOneRepairLog(id);
        return (this.prisma as any).repairLog.delete({ where: { id } });
    }

    // Stock
    async createStock(dto: CreateMaintenanceStockDto) {
        return (this.prisma as any).maintenanceStock.create({ data: dto });
    }

    async findAllStock(query?: { search?: string; category?: string; page?: number; limit?: number }) {
        const { search, category, page = 1, limit = 20 } = query || {};
        const where: any = {};
        if (category) where.category = category;
        if (search) where.name = { contains: search, mode: 'insensitive' };
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            (this.prisma as any).maintenanceStock.findMany({ where, skip, take: +limit, orderBy: { name: 'asc' } }),
            (this.prisma as any).maintenanceStock.count({ where }),
        ]);
        return { data, total, page: +page, limit: +limit };
    }

    async findOneStock(id: string) {
        const record = await (this.prisma as any).maintenanceStock.findUnique({ where: { id } });
        if (!record) throw new NotFoundException(`Stock #${id} not found`);
        return record;
    }

    async updateStock(id: string, dto: UpdateMaintenanceStockDto) {
        await this.findOneStock(id);
        return (this.prisma as any).maintenanceStock.update({ where: { id }, data: dto });
    }

    async removeStock(id: string) {
        await this.findOneStock(id);
        return (this.prisma as any).maintenanceStock.delete({ where: { id } });
    }

    async adjustStock(id: string, qty: number) {
        const stock = await this.findOneStock(id);
        return (this.prisma as any).maintenanceStock.update({ where: { id }, data: { qty: (stock.qty || 0) + qty } });
    }

    // GL Codes
    async findAllGLCodes() {
        return (this.prisma as any).gLCode.findMany({ orderBy: { code: 'asc' } });
    }

    async createGLCode(data: any) {
        return (this.prisma as any).gLCode.create({ data });
    }

    async updateGLCode(id: string, data: any) {
        return (this.prisma as any).gLCode.update({ where: { id }, data });
    }

    async removeGLCode(id: string) {
        return (this.prisma as any).gLCode.delete({ where: { id } });
    }

    // Stock Categories
    async findAllStockCategories() {
        return (this.prisma as any).stockCategory.findMany({ orderBy: { name: 'asc' } });
    }

    async createStockCategory(data: any) {
        return (this.prisma as any).stockCategory.create({ data });
    }

    async updateStockCategory(id: string, data: any) {
        return (this.prisma as any).stockCategory.update({ where: { id }, data });
    }

    async removeStockCategory(id: string) {
        return (this.prisma as any).stockCategory.delete({ where: { id } });
    }

    // Storage Locations
    async findAllStorageLocations() {
        return (this.prisma as any).storageLocation.findMany({ orderBy: { name: 'asc' } });
    }

    async createStorageLocation(data: any) {
        return (this.prisma as any).storageLocation.create({ data });
    }

    async updateStorageLocation(id: string, data: any) {
        return (this.prisma as any).storageLocation.update({ where: { id }, data });
    }

    async removeStorageLocation(id: string) {
        return (this.prisma as any).storageLocation.delete({ where: { id } });
    }
}
