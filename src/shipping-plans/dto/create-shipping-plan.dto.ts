import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateShippingPlanDto {
    @IsString() planNo: string;
    @IsOptional() @IsString() customer?: string;
    @IsDateString() planDate: string;
    @IsOptional() @IsString() status?: string;
    @IsOptional() @IsString() remark?: string;
    @IsOptional() @IsArray() items?: any[];
}
