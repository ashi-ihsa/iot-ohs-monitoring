import mqtt from "mqtt";
import { io } from "socket.io-client";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
dotenvExpand.expand(dotenv.config());

// Connect to Backend (Socket Hub)
const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Connected to Backend Socket Hub");
});

const client = mqtt.connect(process.env.MQTT_BROKER);
console.log(`Connecting to broker: ${process.env.MQTT_BROKER}`);

client.on("connect", () => {
  console.log("Connected to MQTT broker");
  client.subscribe("test/topic");
});

client.on("message", (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message}`);
  // Forward to Backend
  socket.emit("device-data", {
    topic: topic,
    message: message.toString(),
    timestamp: new Date().toISOString()
  });
});
