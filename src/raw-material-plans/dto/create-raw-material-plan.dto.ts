import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateRawMaterialPlanDto {
    @IsString() planNo: string;
    @IsString() revisionNo: string;
    @IsString() refProductionNo: string;
    @IsDateString() issuedDate: string;
    @IsString() creator: string;
    @IsOptional() @IsString() checker?: string;
    @IsOptional() @IsString() status?: string;
    @IsOptional() @IsArray() rows?: any[];
    @IsOptional() @IsArray() poolDetails?: any[];
}
