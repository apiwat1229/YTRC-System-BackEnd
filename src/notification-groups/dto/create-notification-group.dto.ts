import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateNotificationGroupDto {
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
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    memberIds?: string[];
}
