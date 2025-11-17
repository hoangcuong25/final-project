import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  ConnectedSocket,
  SubscribeMessage,
  MessageBody,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Notification } from "@prisma/client";

@WebSocketGateway({
  namespace: "notifications", // namespace riêng cho thông báo
  cors: { origin: "*" },
})
export class NotificationGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client ${client.id} connected to NOTIFICATIONS`);
  }

  // Khi client kết nối, họ cần gửi 'subscribe' với userId của họ
  @SubscribeMessage("subscribe")
  handleSubscribe(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket
  ) {
    if (!userId) return;
    // Chúng ta cho client tham gia một "phòng" có tên là User ID của họ
    client.join(userId);
    console.log(`Client ${client.id} subscribed to user ${userId}`);
  }

  /**
   * Hàm này được gọi bởi NotificationService để đẩy thông báo
   * @param userId - ID của người dùng (tên phòng)
   * @param payload - Thông báo đầy đủ từ Prisma
   */
  sendNotificationToUser(userId: string, payload: Notification) {
    // Gửi sự kiện 'newNotification' đến "phòng" có tên là userId
    this.server.to(userId).emit("newNotification", payload);
  }
}
 