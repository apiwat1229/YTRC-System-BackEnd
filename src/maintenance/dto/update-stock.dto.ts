import { PartialType } from '@nestjs/mapped-types';
import { CreateMaintenanceStockDto } from './create-stock.dto';

export class UpdateMaintenanceStockDto extends PartialType(CreateMaintenanceStockDto) { }
