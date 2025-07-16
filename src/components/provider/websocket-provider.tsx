import { useSessionStore } from "@/store/use-session-store";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { activeUserSonner } from "../ui/sonner";

type WebSocketContextType = {
  ws: WebSocket | null;
  isConnected: boolean;
  sendMessage: (msg: string) => void;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined,
);

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { session } = useSessionStore();
  const userId = session?.userId;
  const role = session?.role;
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!role) return;

    const ws = new WebSocket(`${import.meta.env.VITE_API_WS_URL}/${role}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (userId && data.userId !== userId && data.type === `${role}_login`) {
        activeUserSonner(`${data.name} is active now`);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onerror = (err) => {
      console.error(`❌ WebSocket (${role}) error`, err);
    };

    return () => {
      ws.close();
    };
  }, [role]);

  const sendMessage = (msg: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(msg);
    } else {
      console.warn("WebSocket not connected");
    }
  };

  return (
    <WebSocketContext.Provider
      value={{ ws: wsRef.current, isConnected, sendMessage }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context)
    throw new Error("useWebSocket must be used within WebSocketProvider");
  return context;
};
