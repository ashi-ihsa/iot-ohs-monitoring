#include <ArduinoJson.h>
#include "Config.h"
#include "NetworkManager.h"
#include "HeartRateSensor.h"
#include "LocationSensor.h"
#include "FallDetector.h"

// --- Modules ---
NetworkManager networkMgr;
HeartRateSensor hrSensor;
LocationSensor locSensor;
FallDetector fallDetector;

// --- Timing ---
unsigned long lastTelemetryTime = 0;

void setup() {
  Serial.begin(9600);
  
  // Initialize Modules
  networkMgr.setup();
  hrSensor.setup();
  locSensor.setup();
  fallDetector.setup();
  
  // Set MQTT Callback
  networkMgr.setMessageCallback(messageHandler);
}

void loop() {
  // 1. Maintain Network
  networkMgr.loop();

  // 2. Check for Critical Events (Fall Detection) - Priority
  if (fallDetector.checkFall()) {
      sendAlert("FALL_DETECTED");
  }

  // 3. Periodic Telemetry (Heart Rate + Location)
  if (millis() - lastTelemetryTime > PUBLISH_INTERVAL_MS) {
      sendTelemetry();
      lastTelemetryTime = millis();
  }
}

void sendTelemetry() {
  // Create "One Big JSON" for telemetry
  StaticJsonDocument<512> doc;
  
  doc["timestamp"] = millis();
  
  // Heart Rate Data
  doc["hr"] = hrSensor.readBPM();
  
  // Location Data
  GeoLocation loc = locSensor.readLocation();
  JsonObject locObj = doc.createNestedObject("location");
  locObj["lat"] = loc.latitude;
  locObj["lon"] = loc.longitude;
  
  // Serialize and Publish
  String payload;
  serializeJson(doc, payload);
  
  Serial.println("[Main] Publishing Telemetry...");
  networkMgr.publish(MQTT_TOPIC_TELEMETRY, payload);
}

void sendAlert(String alertType) {
  StaticJsonDocument<256> doc;
  
  doc["timestamp"] = millis();
  doc["type"] = "ALERT";
  doc["message"] = alertType;
  doc["priority"] = "HIGH";
  
  String payload;
  serializeJson(doc, payload);
  
  Serial.println("[Main] !!! Sending ALERT !!!");
  networkMgr.publish(MQTT_TOPIC_ALERT, payload);
}

void messageHandler(String &topic, String &payload) {
  Serial.println("[Main] Received: " + topic + " - " + payload);
}