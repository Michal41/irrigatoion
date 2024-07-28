#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

const String sensorName = "alternate";
const String ssid = "Tyrion 2.4";
const String password = "123456789";
const char* host = "192.168.55.14";
const int port = 3000;

const int numReadings = 30;
const int sendingInterval = 1000;

int inputPin1 = A0;
int inputPin2 = D0;

int readings1[numReadings]; // the readings from the first analog input
int readings2[numReadings]; // the readings from the second analog input

int readIndex1 = 0; // the index of the current reading for the first input
int readIndex2 = 0; // the index of the current reading for the second input

int total1 = 0; // the running total for the first input
int total2 = 0; // the running total for the second input

int average1 = 0; // the average for the first input
int average2 = 0; // the average for the second input

WiFiClient wifiClient; // Create a WiFiClient object

void setup() {
  Serial.begin(115200); // Serial connection
  WiFi.begin(ssid, password); // WiFi connection

  while (WiFi.status() != WL_CONNECTED) { // Wait for the WiFi connection completion
    delay(500);
    Serial.println("Waiting for connection");
  }

  for (int thisReading = 0; thisReading < numReadings; thisReading++) {
    readings1[thisReading] = 0;
    readings2[thisReading] = 0;
  }
}

void loop() {
  int currentReading1 = analogRead(inputPin1);
  currentReading1 = 1023 - currentReading1; // Invert the reading for the resistance-based sensor
  calculateAverage(currentReading1, "A0", readings1, total1, readIndex1, average1);

  int currentReading2 = analogRead(inputPin2);
  calculateAverage(currentReading2, "D0", readings2, total2, readIndex2, average2);

  delay(sendingInterval / numReadings);
}

void calculateAverage(int currentReading, String pin, int readings[], int &total, int &readIndex, int &average) {
  total = total - readings[readIndex];
  readings[readIndex] = currentReading;
  total = total + readings[readIndex];
  readIndex++;
  
  if (readIndex >= numReadings) {
    average = total / numReadings;
    Serial.println("Average for " + pin + ": " + average);
    postData(average, pin);
    readIndex = 0;
  }
}

void postData(int data, String pin) {
  if (WiFi.status() == WL_CONNECTED) { // Check WiFi connection status
    HTTPClient http; // Declare object of class HTTPClient

    String url = "http://" + String(host) + ":" + String(port) + "/measurement/" + sensorName + pin;
    http.begin(wifiClient, url); // Specify request destination
    http.addHeader("Content-Type", "application/json"); // Specify content-type header
    http.POST("{\"capacity\": \"" + String(data) + "\"}"); // Send the request
    http.end(); // Close connection
  } else {
    Serial.println("Error in WiFi connection");
  }
}