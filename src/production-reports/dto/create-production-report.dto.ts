import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class CreateProductionReportRowDto {
    @IsString() startTime: string;
    @IsString() palletType: string;
    @IsString() lotNo: string;
    @IsOptional() @IsNumber() weight1?: number;
    @IsOptional() @IsNumber() weight2?: number;
    @IsOptional() @IsNumber() weight3?: number;
    @IsOptional() @IsNumber() weight4?: number;
    @IsOptional() @IsNumber() weight5?: number;
    @IsOptional() @IsNumber() sampleCount?: number;
}

export class CreateProductionReportDto {
    @IsString() dryerName: string;
    @IsString() bookNo: string;
    @IsString() pageNo: string;
    @IsDateString() productionDate: string;
    @IsString() shift: string;
    @IsString() grade: string;
    @IsOptional() @IsNumber() ratioCL?: number;
    @IsOptional() @IsNumber() ratioUSS?: number;
    @IsOptional() @IsNumber() ratioCutting?: number;
    @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => CreateProductionReportRowDto) rows?: CreateProductionReportRowDto[];
    @IsOptional() @IsString() status?: string;
}
