import { IsOptional, IsString } from 'class-validator';

export class CreateMachineDto {
    @IsString() name: string;
    @IsOptional() @IsString() model?: string;
    @IsOptional() @IsString() location?: string;
    @IsOptional() @IsString() status?: string;
}
