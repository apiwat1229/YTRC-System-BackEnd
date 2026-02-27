import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSupplierDto {
    @IsString() code: string;
    @IsString() name: string;
    @IsOptional() @IsString() taxId?: string;
    @IsOptional() @IsString() address?: string;
    @IsOptional() @IsString() phone?: string;
    @IsOptional() @IsString() email?: string;
    @IsOptional() @IsNumber() provinceId?: number;
    @IsOptional() @IsNumber() districtId?: number;
    @IsOptional() @IsNumber() subdistrictId?: number;
    @IsOptional() @IsBoolean() isActive?: boolean;
    @IsOptional() @IsString() notes?: string;
    @IsOptional() rubberTypeCodes?: string[];
}
