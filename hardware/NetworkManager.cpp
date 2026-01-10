#include "NetworkManager.h"

NetworkManager::NetworkManager() : mqtt(512) { // Increase buffer size for larger JSONs if needed
}

void NetworkManager::setup() {
    Serial.println("[Network] Initializing...");
    
    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    
    mqtt.begin(MQTT_BROKER_ADDRESS, MQTT_PORT, network);
    
    Serial.print("[Network] Connecting to WiFi");
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\n[Network] WiFi Configured.");
}

void NetworkManager::loop() {
    mqtt.loop();
    
    // Auto-reconnect logic
    if (!mqtt.connected()) {
        if (millis() - lastReconnectAttempt > 1000) {
            Serial.print("[Network] MQTT Disconnected. Reconnecting...");
            if (connect()) {
                 lastReconnectAttempt = 0;
            } else {
                 lastReconnectAttempt = millis();
            }
        }
    }
}

bool NetworkManager::connect() {
    if (WiFi.status() != WL_CONNECTED) {
         Serial.println("[Network] WiFi not connected!");
         return false;
    }

    // Try to connect to MQTT
    if (mqtt.connect(MQTT_CLIENT_ID, MQTT_USERNAME, MQTT_PASSWORD)) {
        Serial.println("\n[Network] MQTT Connected!");
        mqtt.subscribe(MQTT_TOPIC_SUBSCRIBE);
        return true;
    } else {
        Serial.print(".");
        return false;
    }
}

bool NetworkManager::isConnected() {
    return mqtt.connected();
}

bool NetworkManager::publish(const char* topic, String payload) {
    if (mqtt.connected()) {
        return mqtt.publish(topic, payload);
    }
    return false;
}

void NetworkManager::setMessageCallback(MQTTClientCallbackSimple callback) {
    mqtt.onMessage(callback);
}
