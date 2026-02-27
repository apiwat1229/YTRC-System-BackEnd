import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateITAssetDto {
    @IsString() code: string;
    @IsString() name: string;
    @IsString() category: string;
    @IsOptional() @IsNumber() stock?: number;
    @IsOptional() @IsNumber() minStock?: number;
    @IsOptional() @IsString() location?: string;
    @IsOptional() @IsString() description?: string;
    @IsOptional() @IsNumber() price?: number;
    @IsOptional() @IsDateString() receivedDate?: string;
    @IsOptional() @IsString() receiver?: string;
    @IsOptional() @IsString() serialNumber?: string;
    @IsOptional() @IsString() barcode?: string;
}
