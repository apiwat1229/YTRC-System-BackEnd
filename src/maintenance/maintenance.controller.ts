import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CreateMachineDto } from './dto/create-machine.dto';
import { CreateRepairLogDto } from './dto/create-repair-log.dto';
import { CreateMaintenanceStockDto } from './dto/create-stock.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { UpdateRepairLogDto } from './dto/update-repair-log.dto';
import { UpdateMaintenanceStockDto } from './dto/update-stock.dto';
import { MaintenanceService } from './maintenance.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('maintenance')
export class MaintenanceController {
    constructor(private readonly maintenanceService: MaintenanceService) { }

    // Machines
    @Post('machines')
    createMachine(@Body() dto: CreateMachineDto) {
        return this.maintenanceService.createMachine(dto);
    }

    @Get('machines')
    findAllMachines(@Query('search') search?: string, @Query('status') status?: string) {
        return this.maintenanceService.findAllMachines({ search, status });
    }

    @Get('machines/:id')
    findOneMachine(@Param('id') id: string) {
        return this.maintenanceService.findOneMachine(id);
    }

    @Patch('machines/:id')
    updateMachine(@Param('id') id: string, @Body() dto: UpdateMachineDto) {
        return this.maintenanceService.updateMachine(id, dto);
    }

    @Delete('machines/:id')
    removeMachine(@Param('id') id: string) {
        return this.maintenanceService.removeMachine(id);
    }

    // Repair Logs
    @Post('repair-logs')
    createRepairLog(@Body() dto: CreateRepairLogDto) {
        return this.maintenanceService.createRepairLog(dto);
    }

    @Get('repair-logs')
    findRepairLogs(
        @Query('machineId') machineId?: string,
        @Query('status') status?: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.maintenanceService.findRepairLogs({ machineId, status, page, limit });
    }

    @Get('repair-logs/:id')
    findOneRepairLog(@Param('id') id: string) {
        return this.maintenanceService.findOneRepairLog(id);
    }

    @Patch('repair-logs/:id')
    updateRepairLog(@Param('id') id: string, @Body() dto: UpdateRepairLogDto) {
        return this.maintenanceService.updateRepairLog(id, dto);
    }

    @Delete('repair-logs/:id')
    removeRepairLog(@Param('id') id: string) {
        return this.maintenanceService.removeRepairLog(id);
    }

    // Stock
    @Post('stock')
    createStock(@Body() dto: CreateMaintenanceStockDto) {
        return this.maintenanceService.createStock(dto);
    }

    @Get('stock')
    findAllStock(
        @Query('search') search?: string,
        @Query('category') category?: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.maintenanceService.findAllStock({ search, category, page, limit });
    }

    @Get('stock/:id')
    findOneStock(@Param('id') id: string) {
        return this.maintenanceService.findOneStock(id);
    }

    @Patch('stock/:id')
    updateStock(@Param('id') id: string, @Body() dto: UpdateMaintenanceStockDto) {
        return this.maintenanceService.updateStock(id, dto);
    }

    @Delete('stock/:id')
    removeStock(@Param('id') id: string) {
        return this.maintenanceService.removeStock(id);
    }

    @Post('stock/:id/adjust')
    adjustStock(@Param('id') id: string, @Body('qty') qty: number) {
        return this.maintenanceService.adjustStock(id, qty);
    }

    // GL Codes
    @Get('gl-codes')
    findAllGLCodes() {
        return this.maintenanceService.findAllGLCodes();
    }

    @Post('gl-codes')
    createGLCode(@Body() data: any) {
        return this.maintenanceService.createGLCode(data);
    }

    @Patch('gl-codes/:id')
    updateGLCode(@Param('id') id: string, @Body() data: any) {
        return this.maintenanceService.updateGLCode(id, data);
    }

    @Delete('gl-codes/:id')
    removeGLCode(@Param('id') id: string) {
        return this.maintenanceService.removeGLCode(id);
    }

    // Stock Categories
    @Get('stock-categories')
    findAllStockCategories() {
        return this.maintenanceService.findAllStockCategories();
    }

    @Post('stock-categories')
    createStockCategory(@Body() data: any) {
        return this.maintenanceService.createStockCategory(data);
    }

    @Patch('stock-categories/:id')
    updateStockCategory(@Param('id') id: string, @Body() data: any) {
        return this.maintenanceService.updateStockCategory(id, data);
    }

    @Delete('stock-categories/:id')
    removeStockCategory(@Param('id') id: string) {
        return this.maintenanceService.removeStockCategory(id);
    }

    // Storage Locations
    @Get('storage-locations')
    findAllStorageLocations() {
        return this.maintenanceService.findAllStorageLocations();
    }

    @Post('storage-locations')
    createStorageLocation(@Body() data: any) {
        return this.maintenanceService.createStorageLocation(data);
    }

    @Patch('storage-locations/:id')
    updateStorageLocation(@Param('id') id: string, @Body() data: any) {
        return this.maintenanceService.updateStorageLocation(id, data);
    }

    @Delete('storage-locations/:id')
    removeStorageLocation(@Param('id') id: string) {
        return this.maintenanceService.removeStorageLocation(id);
    }
}
