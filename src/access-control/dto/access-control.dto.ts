import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpsertAppPermissionDto {
    @IsString()
    userId: string;

    @IsString()
    appName: string;

    @IsArray()
    @IsString({ each: true })
    actions: string[];
}

export class UpdateAppPermissionDto {
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    actions?: string[];
}
