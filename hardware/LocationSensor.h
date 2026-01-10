#ifndef LOCATION_SENSOR_H
#define LOCATION_SENSOR_H

#include <Arduino.h>

struct GeoLocation {
    float latitude;
    float longitude;
};

class LocationSensor {
public:
    void setup() {
        // Initialize GPS (e.g., Serial1.begin(9600))
        Serial.println("[Sensor] GPS Initialized");
    }

    GeoLocation readLocation() {
        // MOCK DATA: Return fixed coordinate with slight jitter
        GeoLocation loc;
        loc.latitude = -6.2088 + (random(-100, 100) / 100000.0);
        loc.longitude = 106.8456 + (random(-100, 100) / 100000.0);
        return loc;
    }
};

#endif
