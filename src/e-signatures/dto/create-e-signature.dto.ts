import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateESignatureDto {
    @IsString() employeeId: string;
    @IsString() signature: string;
    @IsOptional() @IsBoolean() status?: boolean;
}
