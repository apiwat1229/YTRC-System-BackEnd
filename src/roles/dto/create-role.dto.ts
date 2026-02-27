import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    icon?: string;

    @IsOptional()
    @IsString()
    color?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    permissions?: string[];

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
