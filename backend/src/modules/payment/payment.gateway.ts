import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { SocketAuthMiddleware } from "../auth/middleware/ws-auth.middleware";

interface AuthenticatedSocket extends Socket {
  user: {
    email: string;
  };
}

@WebSocketGateway({
  namespace: "payments",
  cors: { origin: "*", credentials: true },
})
export class PaymentGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  afterInit(server: Server) {
    server.use(SocketAuthMiddleware(this.jwtService));
    console.log("Payment Gateway Initialized with Auth Middleware");
  }

  handleConnection(client: AuthenticatedSocket) {
    if (!client.user || !client.user.email) {
      client.disconnect(true);
      return;
    }

    const email = client.user.email.toString();
    client.join(`payment-${email}`);
    console.log(
      `Payment Client ${client.id} connected & joined room: ${email}`
    );
  }

  handleDisconnect(client: AuthenticatedSocket) {
    const email = client.user.email.toString();
    client.leave(`payment-${email}`);
    console.log(
      `Payment Client ${client.id} disconnected & left room: ${email}`
    );
  }

  sendPaymentSuccess(email: string, payload: any) {
    console.log("run 12");
    this.server.to(`payment-${email}`).emit("paymentSuccess", payload);
  }
}
