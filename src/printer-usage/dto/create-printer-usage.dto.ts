import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePrinterUsageDto {
    @IsDateString() period: string;
    @IsString() userName: string;
    @IsOptional() @IsString() departmentId?: string;
    @IsOptional() @IsString() serialNo?: string;
    @IsOptional() @IsNumber() printBW?: number;
    @IsOptional() @IsNumber() printColor?: number;
    @IsOptional() @IsNumber() copyBW?: number;
    @IsOptional() @IsNumber() copyColor?: number;
    @IsOptional() @IsNumber() total?: number;
}
