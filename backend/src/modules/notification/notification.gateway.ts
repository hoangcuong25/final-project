import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  SubscribeMessage,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Notification } from "@prisma/client";
import { UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { SocketAuthMiddleware } from "../auth/middleware/ws-auth.middleware";

interface AuthenticatedSocket extends Socket {
  user: {
    email: string;
  };
}

@WebSocketGateway({
  namespace: "notifications",
  cors: { origin: "*", credentials: true },
})
export class NotificationGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  /**
   * Áp dụng Middleware xác thực Socket.IO
   */
  afterInit(server: Server) {
    server.use(SocketAuthMiddleware(this.jwtService));
    console.log("Notification Gateway Initialized with Auth Middleware");
  }

  /**
   * Phương thức được gọi sau khi client kết nối thành công và đã được xác thực
   */
  handleConnection(client: AuthenticatedSocket) {
    // Middleware đã kiểm tra Auth. Phần này chỉ cần kiểm tra user được gắn
    if (!client.user || !client.user.email) {
      // Trường hợp này chỉ xảy ra nếu Middleware gặp lỗi không ném exception
      client.disconnect(true);
      console.log(
        `Client ${client.id} failed authentication or user info retrieval.`
      );
      return;
    }

    console.log(client.user);
    const userId = client.user.email.toString(); // Lấy ID đã được gắn từ Middleware

    client.join(userId);
    console.log(`Client ${client.id} connected & joined room: ${userId}`);
  }

  /**
   * Hàm này được gọi bởi NotificationService để đẩy thông báo
   * @param userId - ID của người dùng (tên phòng)
   * @param payload - Thông báo đầy đủ từ Prisma
   */
  sendNotificationToUser(userId: string, payload: Notification) {
    // Tối ưu: Đảm bảo userId là string vì Socket.IO room names là string
    const roomName = userId.toString();
    this.server.to(roomName).emit("newNotification", payload);
  }
}
