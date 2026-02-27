import { PartialType } from '@nestjs/mapped-types';
import { CreateRubberTypeDto } from './create-rubber-type.dto';

export class UpdateRubberTypeDto extends PartialType(CreateRubberTypeDto) { }
