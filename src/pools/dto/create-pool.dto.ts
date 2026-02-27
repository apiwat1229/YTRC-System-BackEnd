import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePoolDto {
    @IsString() name: string;
    @IsOptional() @IsString() status?: string;
    @IsOptional() @IsString() grade?: string;
    @IsOptional() @IsString() rubberType?: string;
    @IsOptional() @IsNumber() capacity?: number;
}
