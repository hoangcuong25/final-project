"use client";

import { useEffect, useRef, useCallback } from "react";
import { io, Socket, ManagerOptions, SocketOptions } from "socket.io-client";
import { toast } from "sonner";
import axiosClient from "@/lib/axiosClient";

const SOCKET_SERVER_URL =
  process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:4000";

const refreshAccessTokenForSocket = async (): Promise<string | null> => {
  try {
    const response = await axiosClient.get(`auth/refresh-token`, {
      withCredentials: true,
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
    localStorage.removeItem("access_token");
    toast.error("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
    window.location.href = "/login";
    return null;
  }
};

const useBaseSocket = (namespace: string): Socket | null => {
  const socketRef = useRef<Socket | null>(null);

  const attemptReconnect = useCallback(
    async (socket: Socket) => {
      console.log(
        `Attempting to refresh token and reconnect to ${namespace}...`
      );

      const newAccessToken = await refreshAccessTokenForSocket();

      if (newAccessToken) {
        console.log("Token refreshed successfully. Reconnecting Socket...");
        socket.io.opts.query = { token: newAccessToken };
        socket.connect();
      } else {
        console.log(
          `Critical: Cannot reconnect ${namespace}, Refresh Token expired.`
        );
      }
    },
    [namespace]
  );

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const options: Partial<ManagerOptions & SocketOptions> = {
      path: "/socket.io",
      query: { token: token },
      transports: ["websocket"],
      reconnection: false,
    };

    const socket = io(`${SOCKET_SERVER_URL}${namespace}`, options);
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log(`Socket connected to ${namespace}:`, socket.id);
    });
    const handleConnectError = (err: any) => {
      console.log(`Socket Connection Error on ${namespace}:`, err.message);

      if (err.message === "TokenExpired") {
        console.log(
          `Access Token expired on ${namespace}. Initiating refresh sequence...`
        );
        socket.disconnect();
        attemptReconnect(socket);
      } else if (err.message.includes("Unauthorized")) {
        localStorage.removeItem("access_token");
        toast.error("Unauthorized connection. Please log in.");
        socket.disconnect();
      }
    };

    socket.on("connect_error", handleConnectError);

    return () => {
      console.log(`Socket ${namespace} disconnecting...`);
      socket.off("connect_error", handleConnectError);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [namespace, attemptReconnect]);

  return socketRef.current;
};

export default useBaseSocket;
