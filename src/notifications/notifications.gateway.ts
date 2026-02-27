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

@WebSocketGateway({
    cors: { origin: '*' },
    namespace: '/notifications',
})
export class NotificationsGateway
    implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server!: Server;

    private readonly logger = new Logger(NotificationsGateway.name);
    private userSocketMap = new Map<string, string[]>();

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
        for (const [userId, sockets] of this.userSocketMap.entries()) {
            const updated = sockets.filter((s) => s !== client.id);
            if (updated.length === 0) {
                this.userSocketMap.delete(userId);
            } else {
                this.userSocketMap.set(userId, updated);
            }
        }
    }

    @SubscribeMessage('join')
    handleJoin(
        @MessageBody() data: { userId: string },
        @ConnectedSocket() client: Socket,
    ) {
        if (!data?.userId) return;
        const existing = this.userSocketMap.get(data.userId) || [];
        this.userSocketMap.set(data.userId, [...existing, client.id]);
        client.join(`user:${data.userId}`);
        this.logger.log(`User ${data.userId} joined room`);
    }

    sendToUser(userId: string, event: string, payload: any) {
        this.server.to(`user:${userId}`).emit(event, payload);
    }

    broadcastNotification(notification: any) {
        this.sendToUser(notification.userId, 'notification', notification);
    }
}
