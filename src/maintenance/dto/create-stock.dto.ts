import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMaintenanceStockDto {
    @IsOptional() @IsString() code?: string;
    @IsString() name: string;
    @IsOptional() @IsString() nameTH?: string;
    @IsOptional() @IsString() nameEN?: string;
    @IsOptional() @IsString() category?: string;
    @IsOptional() @IsString() location?: string;
    @IsOptional() @IsString() glCode?: string;
    @IsOptional() @IsNumber() qty?: number;
    @IsOptional() @IsNumber() price?: number;
    @IsString() unit: string;
    @IsOptional() @IsNumber() minQty?: number;
    @IsOptional() @IsString() description?: string;
}
