import { Controller, Get, Query } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { MasterService } from './master.service';

@Controller('master')
export class MasterController {
    constructor(private readonly service: MasterService) { }

    @Public()
    @Get('provinces')
    findProvinces(@Query('search') search?: string) {
        return this.service.findProvinces(search);
    }

    @Public()
    @Get('districts')
    findDistricts(@Query('provinceId') provinceId?: number, @Query('search') search?: string) {
        return this.service.findDistricts(provinceId, search);
    }

    @Public()
    @Get('subdistricts')
    findSubdistricts(@Query('districtId') districtId?: number, @Query('search') search?: string) {
        return this.service.findSubdistricts(districtId, search);
    }
}
