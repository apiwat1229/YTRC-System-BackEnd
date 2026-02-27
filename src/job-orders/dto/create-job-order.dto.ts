import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateJobOrderDto {
    @IsString() bookNo: string;
    @IsNumber() no: number;
    @IsString() jobOrderNo: string;
    @IsString() contractNo: string;
    @IsString() grade: string;
    @IsOptional() @IsString() otherGrade?: string;
    @IsNumber() quantityBale: number;
    @IsString() palletType: string;
    @IsNumber() orderQuantity: number;
    @IsOptional() @IsBoolean() palletMarking?: boolean;
    @IsOptional() @IsString() note?: string;
    @IsString() qaName: string;
    @IsDateString() qaDate: string;
}
