import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsArray()
    permissions?: string[];

    @IsOptional()
    preferences?: any;

    @IsOptional()
    @IsString()
    avatar?: string;
}
