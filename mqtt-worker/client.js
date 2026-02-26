import mqtt from "mqtt";
import { io } from "socket.io-client";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import pg from "pg";

dayjs.extend(utc);
dayjs.extend(timezone);
dotenvExpand.expand(dotenv.config());

const pool = new pg.Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT),
});

const socket = io(process.env.BACKEND_URL);
socket.on("connect", () => console.log("Connected to Backend Socket Hub"));

const client = mqtt.connect(process.env.MQTT_BROKER);
console.log(`Connecting to broker: ${process.env.MQTT_BROKER}`);

client.on("connect", () => {
  const uniqueId = process.env.UNIQUE_ID;
  console.log(`Connected. Subscribing with Unique ID: ${uniqueId}`);
  client.subscribe([`${uniqueId}/+/telemetry`, `${uniqueId}/+/alert`]);
});

client.on("message", (topic, message) => {
  const payloadStr = message.toString();
  const [, deviceId, type] = topic.split('/');
  if (!deviceId || !type) return;

  const timestamp = dayjs().tz(process.env.TIMEZONE).format("YYYY-MM-DD HH:mm:ssZ");

  socket.emit("device-data", { topic, message: payloadStr, timestamp });

  try {
    const { longitude, latitude, heartrate, spo2 } = JSON.parse(payloadStr);

    if (type === 'telemetry') {
      pool.query(
        'INSERT INTO telemetries ("deviceId", timestamp, longitude, latitude, heartrate, spo2) VALUES ($1, $2, $3, $4, $5, $6)',
        [deviceId, timestamp, longitude, latitude, heartrate, spo2]
      ).catch(err => console.error("DB Error (telemetry):", err.message));
      console.log ("Telemetry data inserted into database");
    } else if (type === 'alert') {
      pool.query(
        'INSERT INTO alerts ("deviceId", timestamp, longitude, latitude) VALUES ($1, $2, $3, $4)',
        [deviceId, timestamp, longitude, latitude]
      ).catch(err => console.error("DB Error (alert):", err.message));
      console.log("Alert data inserted into database");
    }
  } catch (error) {
    console.error("Payload parse error:", error.message);
  }
});
