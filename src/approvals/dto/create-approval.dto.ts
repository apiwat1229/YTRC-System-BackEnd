import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateApprovalDto {
    @IsString() requestType: string;
    @IsString() entityType: string;
    @IsString() entityId: string;
    @IsString() sourceApp: string;
    @IsString() actionType: string;
    @IsOptional() @IsObject() currentData?: any;
    @IsOptional() @IsObject() proposedData?: any;
    @IsOptional() @IsString() reason?: string;
    @IsOptional() @IsString() priority?: string;
    @IsString() requesterId: string;
}
