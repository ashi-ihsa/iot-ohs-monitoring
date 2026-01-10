#ifndef HEARTRATE_SENSOR_H
#define HEARTRATE_SENSOR_H

#include <Arduino.h>

class HeartRateSensor {
public:
    void setup() {
        // Initialize sensor (e.g., Wire.begin() for MAX30100)
        Serial.println("[Sensor] HeartRate Initialized");
    }

    int readBPM() {
        // MOCK DATA: Return random BPM between 60 and 100
        return random(60, 100);
    }
};

#endif
