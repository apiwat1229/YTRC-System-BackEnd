import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateRubberTypeDto {
    @IsString() code: string;
    @IsString() name: string;
    @IsOptional() @IsString() description?: string;
    @IsOptional() @IsString() category?: string;
    @IsOptional() @IsBoolean() is_active?: boolean;
}
