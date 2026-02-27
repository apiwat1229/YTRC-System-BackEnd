import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBookingDto {
    @IsNumber() queueNo: number;
    @IsString() bookingCode: string;
    @IsDateString() date: string;
    @IsString() startTime: string;
    @IsString() endTime: string;
    @IsOptional() @IsString() slot?: string;
    @IsString() supplierId: string;
    @IsString() supplierCode: string;
    @IsString() supplierName: string;
    @IsOptional() @IsString() truckType?: string;
    @IsOptional() @IsString() truckRegister?: string;
    @IsString() rubberType: string;
    @IsOptional() @IsString() lotNo?: string;
    @IsOptional() @IsNumber() estimatedWeight?: number;
    @IsString() recorder: string;
    @IsOptional() @IsString() note?: string;
    @IsOptional() @IsString() status?: string;
}
