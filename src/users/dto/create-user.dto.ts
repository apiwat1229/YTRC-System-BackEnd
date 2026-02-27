import {
    IsBoolean,
    IsEmail,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    email!: string;

    @IsOptional()
    @IsString()
    username?: string;

    @IsString()
    @MinLength(6)
    password!: string;

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsString()
    displayName?: string;

    @IsOptional()
    @IsString()
    role?: string;

    @IsOptional()
    @IsString()
    department?: string;

    @IsOptional()
    @IsString()
    position?: string;

    @IsOptional()
    @IsString()
    employeeId?: string;

    @IsOptional()
    @IsString()
    site?: string;

    @IsOptional()
    @IsString()
    pinCode?: string;

    @IsOptional()
    @IsBoolean()
    forceChangePassword?: boolean;

    @IsOptional()
    @IsString()
    roleId?: string;
}
