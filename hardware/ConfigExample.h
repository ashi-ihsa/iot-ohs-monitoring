#ifndef CONFIG_H
#define CONFIG_H

// --- WiFi Configuration ---
const char WIFI_SSID[] = "your_wifi_name";          // REPLACE WITH YOUR SSID
const char WIFI_PASSWORD[] = "your_wifi_password";  // REPLACE WITH YOUR PASSWORD

// --- MQTT Configuration ---
const char MQTT_BROKER_ADDRESS[] = "your_mqtt_broker_address";
const int MQTT_PORT = 1883;
const char MQTT_CLIENT_ID[] = "your_client_id"; 
const char MQTT_USERNAME[] = "your_username";
const char MQTT_PASSWORD[] = "your_password";

// --- Topics ---
// Telemetry: Published periodically (Heart Rate, Location)
const char MQTT_TOPIC_TELEMETRY[] = "your_topic_name";

// Alerts: Published immediately on event (Fall Detected)
const char MQTT_TOPIC_ALERT[] = "your_topic_name";

// Subscribe: For incoming commands
const char MQTT_TOPIC_SUBSCRIBE[] = "your_topic_name";

// --- Intervals ---
const int PUBLISH_INTERVAL_MS = 5000;

#endif
