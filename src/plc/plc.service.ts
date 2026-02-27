import { Injectable } from '@nestjs/common';

@Injectable()
export class PlcService {
    private latestData: any = {};

    getStatus() {
        return { status: 'online', data: this.latestData, timestamp: new Date() };
    }

    setData(data: any) {
        this.latestData = { ...data, updatedAt: new Date() };
        return this.latestData;
    }
}
