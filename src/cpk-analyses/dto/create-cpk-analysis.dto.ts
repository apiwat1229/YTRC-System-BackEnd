import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCpkAnalysisDto {
    @IsString() title: string;
    @IsNumber() lsl: number;
    @IsNumber() usl: number;
    @IsNumber() subgroupSize: number;
    @IsArray() @IsNumber({}, { each: true }) dataPoints: number[];
    @IsOptional() @IsString() note?: string;
    @IsOptional() @IsString() recordedBy?: string;
}
