import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateITTicketDto {
    @IsString() ticketNo: string;
    @IsString() title: string;
    @IsOptional() @IsString() description?: string;
    @IsString() category: string;
    @IsOptional() @IsString() priority?: string;
    @IsOptional() @IsString() location?: string;
    @IsString() requesterId: string;
    @IsOptional() @IsBoolean() isAssetRequest?: boolean;
    @IsOptional() @IsString() assetId?: string;
    @IsOptional() @IsNumber() quantity?: number;
    @IsOptional() @IsDateString() expectedDate?: string;
}
