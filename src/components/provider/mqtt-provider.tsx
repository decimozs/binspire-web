import React, { createContext, useContext, useEffect, useState } from "react";
import mqtt from "mqtt";
import type { MqttClient } from "mqtt";

type MqttContextType = {
  client: MqttClient | null;
  isConnected: boolean;
};

const MqttContext = createContext<MqttContextType | undefined>(undefined);

export const MqttProvider = ({ children }: { children: React.ReactNode }) => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const mqttClient = mqtt.connect(
      "wss://a0e0d83595024fddbb960e5184bc3dda.s1.eu.hivemq.cloud:8884/mqtt",
      {
        username: "binspire",
        password: "@D!QsR.TGxb8PDy",
      },
    );
    setClient(mqttClient);

    mqttClient.on("connect", () => {
      console.log("✅ MQTT connected");
      setIsConnected(true);
    });

    mqttClient.on("close", () => {
      console.warn("⚠️ MQTT disconnected");
      setIsConnected(false);
    });

    mqttClient.on("error", (err) => {
      console.error("❌ MQTT error", err);
    });

    return () => {
      mqttClient.end();
    };
  }, []);

  return (
    <MqttContext.Provider value={{ client, isConnected }}>
      {children}
    </MqttContext.Provider>
  );
};

export const useMqtt = () => {
  const context = useContext(MqttContext);
  if (!context) throw new Error("useMqtt must be used within MqttProvider");
  return context;
};
