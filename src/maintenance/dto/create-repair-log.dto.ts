import { IsArray, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRepairLogDto {
    @IsString() machineId: string;
    @IsString() machineName: string;
    @IsOptional() @IsDateString() date?: string;
    @IsString() issue: string;
    @IsString() technician: string;
    @IsOptional() parts?: any[];
    @IsOptional() @IsNumber() totalCost?: number;
    @IsOptional() @IsString() status?: string;
    @IsOptional() @IsArray() images?: string[];
}
