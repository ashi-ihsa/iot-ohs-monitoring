#ifndef NETWORK_MANAGER_H
#define NETWORK_MANAGER_H

#include <WiFi.h>
#include <MQTTClient.h>
#include "Config.h"

class NetworkManager {
private:
    WiFiClient network;
    MQTTClient mqtt;
    unsigned long lastReconnectAttempt = 0;

public:
    NetworkManager();
    void setup();
    void loop();
    bool connect(); // Returns true if connected
    bool isConnected();
    bool publish(const char* topic, String payload);
    void setMessageCallback(MQTTClientCallbackSimple callback);
};

#endif
