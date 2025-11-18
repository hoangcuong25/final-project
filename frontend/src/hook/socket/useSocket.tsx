"use client";

import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { toast } from "sonner";
import { addNewNotification } from "@/store/notificationsSlice";
import axiosClient from "@/lib/axiosClient";

interface RealtimeNotification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const SOCKET_SERVER_URL =
  process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:4000";

// --- Hàm Refresh Token chuyên dụng cho Socket ---
const refreshAccessTokenForSocket = async (): Promise<string | null> => {
  try {
    // Gọi API refresh-token
    const response = await axiosClient.get(`auth/refresh-token`, {
      withCredentials: true,
      // Đánh dấu để Interceptor bỏ qua, tránh vòng lặp refresh vô hạn
      skipAuthRefresh: true,
    } as any);

    const newAccessToken = response.data.data;
    if (newAccessToken) {
      localStorage.setItem("access_token", newAccessToken);
      return newAccessToken;
    }
    return null;
  } catch (refreshError) {
    console.error("Token refresh failed via Socket handler");
    // Nếu refresh token thất bại, coi như phiên hết hạn
    localStorage.removeItem("access_token");
    toast.error("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
    window.location.href = "/login";
    return null;
  }
};

const useSocket = () => {
  const dispatch = useDispatch<AppDispatch>();
  const socketRef = useRef<Socket | null>(null);

  // 1. Logic tự động kết nối lại (Reconnection Logic)
  const attemptReconnect = useCallback(async (socket: Socket) => {
    console.log("Attempting to refresh token and reconnect...");

    const newAccessToken = await refreshAccessTokenForSocket();

    if (newAccessToken) {
      console.log("Token refreshed successfully. Reconnecting Socket...");

      // Cập nhật query token trước khi gọi connect()
      socket.io.opts.query = { token: newAccessToken };

      // Bắt đầu quá trình kết nối lại
      socket.connect();
    } else {
      // Refresh thất bại (Refresh Token hết hạn)
      console.log("Critical: Cannot reconnect, Refresh Token expired.");
    }
  }, []);

  useEffect(() => {
    // 2. Thiết lập kết nối
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const socket = io(`${SOCKET_SERVER_URL}/notifications`, {
      path: "/socket.io",
      query: {
        token: token,
      },
      transports: ["websocket"],
      // Tắt tự động kết nối lại để kiểm soát quá trình này
      reconnection: false,
    });

    socketRef.current = socket;

    // 3. Xử lý các sự kiện chính
    socket.on("connect", () => {
      console.log("Socket connected successfully:", socket.id);
    });

    // BẮT LỖI TỪ BACKEND KHI TOKEN HẾT HẠN
    socket.on("connect_error", (err) => {
      console.log("Socket Connection Error:", err.message);

      // Kiểm tra lỗi chuyên biệt do Middleware Backend trả về
      if (err.message === "TokenExpired") {
        console.log("Access Token expired. Initiating refresh sequence...");

        // Ngắt kết nối hiện tại để làm sạch
        socket.disconnect();

        // Bắt đầu quá trình Refresh và Reconnect
        attemptReconnect(socket);
      } else if (err.message.includes("Unauthorized")) {
        // Xử lý các lỗi xác thực khác
        localStorage.removeItem("access_token");
        toast.error("Unauthorized connection. Please log in.");
        socket.disconnect();
      }
    });

    // 4. Lắng nghe sự kiện thông báo realtime
    socket.on("newNotification", (data: RealtimeNotification) => {
      console.log("Received new notification:", data);

      const notification = {
        ...data,
        userId: (data as any).userId ?? 0,
      };

      dispatch(addNewNotification(notification as any));

      toast.info(`🔔 ${data.title}`, {
        description: data.message,
        duration: 5000,
        action: {
          label: "Xem",
          onClick: () => (window.location.href = "/notifications"),
        },
      });
    });

    // 5. Cleanup
    return () => {
      console.log("Socket disconnecting...");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [dispatch, attemptReconnect]);

  return socketRef.current;
};

export default useSocket;
