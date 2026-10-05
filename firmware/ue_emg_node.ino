/**
 * Project BioVolt: Under-Earth Electro-Microbial Grid (UE-EMG)
 * Subterranean ESP32 Firmware Node (ue_emg_node.ino)
 */

#include <Arduino.h>

const int PIN_BIO_ANODE_OCV = 34;
const int PIN_BEDROCK_TEMP = 35;
const int PIN_ISOLATION_RELAY = 26;

float ocvCriticalThreshold = 0.350;
float bedrockTempNominal = 15.0;

void setup() {
  Serial.begin(115200);
  pinMode(PIN_ISOLATION_RELAY, OUTPUT);
  digitalWrite(PIN_ISOLATION_RELAY, LOW); // Connected
  Serial.println("[UE-EMG NODE ONLINE]: Subterranean Node Initialized (15C Baseline)");
}

void loop() {
  int rawOcv = analogRead(PIN_BIO_ANODE_OCV);
  float voltage = (rawOcv / 4095.0) * 3.3 * (0.8 / 3.3); // Scaled
  
  if (voltage < ocvCriticalThreshold) {
    Serial.printf("[ALERT]: CRITICAL_BIO_DROP Detected! OCV=%.3fV < %.3fV\\n", voltage, ocvCriticalThreshold);
  }
  
  delay(1000);
}
