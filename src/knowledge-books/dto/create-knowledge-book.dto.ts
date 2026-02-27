import { IsArray, IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateKnowledgeBookDto {
    @IsString() title: string;
    @IsOptional() @IsString() description?: string;
    @IsString() category: string;
    @IsString() fileType: string;
    @IsString() filePath: string;
    @IsString() fileName: string;
    @IsNumber() fileSize: number;
    @IsOptional() @IsString() coverImage?: string;
    @IsOptional() @IsString() author?: string;
    @IsString() uploadedBy: string;
    @IsOptional() @IsArray() tags?: string[];
    @IsOptional() @IsBoolean() isPublished?: boolean;
    @IsOptional() @IsDateString() trainingDate?: string;
    @IsOptional() @IsNumber() attendees?: number;
}
