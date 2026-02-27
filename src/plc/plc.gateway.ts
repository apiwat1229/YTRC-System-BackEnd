import { Logger } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PlcService } from './plc.service';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/plc' })
export class PlcGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server!: Server;

    private readonly logger = new Logger(PlcGateway.name);

    constructor(private plcService: PlcService) { }

    handleConnection(client: Socket) {
        this.logger.log(`PLC client connected: ${client.id}`);
        client.emit('plc-status', this.plcService.getStatus());
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`PLC client disconnected: ${client.id}`);
    }

    @SubscribeMessage('plc-data')
    handleData(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
        const saved = this.plcService.setData(data);
        this.server.emit('plc-update', saved);
        return saved;
    }

    broadcastPlcData(data: any) {
        this.server.emit('plc-update', data);
    }
}
