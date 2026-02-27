import { PartialType } from '@nestjs/mapped-types';
import { CreateRepairLogDto } from './create-repair-log.dto';

export class UpdateRepairLogDto extends PartialType(CreateRepairLogDto) { }
