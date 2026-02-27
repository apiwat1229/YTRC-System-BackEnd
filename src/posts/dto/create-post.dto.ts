import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
    @IsString() title: string;
    @IsOptional() @IsString() content?: string;
    @IsOptional() @IsBoolean() published?: boolean;
    @IsString() authorId: string;
}
