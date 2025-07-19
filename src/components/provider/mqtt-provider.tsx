import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import mqtt, { type MqttClient } from "mqtt";

type MqttContextType = {
  client: MqttClient | null;
  isConnected: boolean;
  error: Error | null;
};

const MqttContext = createContext<MqttContextType | undefined>(undefined);

export const MqttProvider = ({ children }: { children: React.ReactNode }) => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const clientRef = useRef<MqttClient | null>(null);

  useEffect(() => {
    if (clientRef.current && clientRef.current.connected) return;

    const mqttClient = mqtt.connect(
      "wss://a0e0d83595024fddbb960e5184bc3dda.s1.eu.hivemq.cloud:8884/mqtt",
      {
        username: "binspire",
        password: "@D!QsR.TGxb8PDy",
        connectTimeout: 5000,
        reconnectPeriod: 3000,
        rejectUnauthorized: false,
        keepalive: 30,
        clean: true,
        clientId: `mqttjs_${Math.random().toString(16).substr(2, 8)}`,
      },
    );

    clientRef.current = mqttClient;
    setClient(mqttClient);

    mqttClient.on("connect", () => {
      console.log("✅ MQTT connected");
      setIsConnected(true);
      setError(null);
    });

    mqttClient.on("close", () => {
      console.warn("⚠️ MQTT disconnected");
      setIsConnected(false);
    });

    mqttClient.on("reconnect", () => {
      console.log("🔁 MQTT reconnecting...");
    });

    mqttClient.on("error", (err) => {
      console.error("❌ MQTT error", err);
      setError(err);
    });

    mqttClient.on("offline", () => {
      console.warn("🔴 MQTT offline");
      setIsConnected(false);
    });

    const pingInterval = setInterval(() => {
      if (mqttClient.connected) {
        mqttClient.publish("ping", "ping", { qos: 0, retain: false });
      }
    }, 20000);

    return () => {
      clearInterval(pingInterval);
      if (clientRef.current?.connected) {
        clientRef.current.end(true);
      }
    };
  }, []);

  return (
    <MqttContext.Provider value={{ client, isConnected, error }}>
      {children}
    </MqttContext.Provider>
  );
};

export const useMqtt = () => {
  const context = useContext(MqttContext);
  if (!context) throw new Error("useMqtt must be used within MqttProvider");
  return context;
};
