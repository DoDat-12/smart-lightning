#include <WiFi.h>
#include <Firebase_ESP_Client.h> // FIrebase Arduino Client Library for ESP8266 and ESP32
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

#define LED 22
#define LDR 35

// Wifi Information
#define WIFI_SSID "DCE-Office"
#define WIFI_PASSWORD "kythumati"
// DCE-Office
// kythumati

// Realtime Database
#define API_KEY "AIzaSyAbAGV70x8WRn7F5VUeY42ORStAUcarZxQ"
#define DATABASE_URL "https://smart-lightning-f2539-default-rtdb.asia-southeast1.firebasedatabase.app/"
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

const int freq = 5000;
unsigned long sendDataPrevMillis = 0;
bool signUp = false;
bool autoControl = false;

// functions
void connectToWifi();
void connectToFirebase();
void configListener();
void autoControlling(bool autoControl);
void sendingData();

void setup()
{
  pinMode(LED, OUTPUT);
  Serial.begin(115200);

  connectToWifi();
  connectToFirebase();
}

void loop()
{
  configListener();
  autoControlling(autoControl);
  sendingData();
}

void connectToWifi()
{
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("\nConnecting to Wifi");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(300);
  }
  // connected
  Serial.print("\nWiFi connected with IP: ");
  Serial.println(WiFi.localIP());
}

void connectToFirebase()
{
  // Connecting
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  if (Firebase.signUp(&config, &auth, "", ""))
  {
    Serial.println("Connected to Firebase");
    signUp = true;
  }
  else
    Serial.printf("%s\n", config.signer.signupError.message.c_str());

  config.token_status_callback = tokenStatusCallback;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // Database init - disconnect with all users
  if (Firebase.ready() && signUp && sendDataPrevMillis == 0)
  {
    if (Firebase.RTDB.setInt(&fbdo, "led01/mode", 0) &&
        Firebase.RTDB.setInt(&fbdo, "led01/status", 0) &&
        Firebase.RTDB.setInt(&fbdo, "led01/intensity", 0))
      Serial.print("Setup device successfully");
    else
      Serial.print(fbdo.errorReason());
  }
}

void configListener()
{
  if (Firebase.ready() && signUp &&
      (millis() - sendDataPrevMillis > freq || sendDataPrevMillis == 0))
  {
    if (Firebase.RTDB.getInt(&fbdo, "led01/mode"))
    {
      int mode = fbdo.intData();
      if (mode == 0)
      {
        digitalWrite(LED, LOW);
        printf("\nled01 mode: OFF");
        autoControl = false;
      }
      else if (mode == 1)
      {
        digitalWrite(LED, HIGH);
        printf("\nled01 mode: ON");
        autoControl = false;
      }
      else if (mode == 2)
      {
        autoControl = true;
        printf("\nled01 mode: AUTO");
      }
    }
  }
  else
    printf("Firebase disconnected");
}

void autoControlling(bool autoControl)
{
  if (autoControl)
  {
    int intensity = analogRead(LDR);
    if (intensity > 1000)
      digitalWrite(LED, HIGH);
    else
      digitalWrite(LED, LOW);
  }
}

void sendingData()
{
  if (Firebase.ready() && signUp &&
      (millis() - sendDataPrevMillis > freq || sendDataPrevMillis == 0) &&
      Firebase.RTDB.setInt(&fbdo, "led01/intensity", analogRead(LDR)))
  {
    Firebase.RTDB.setInt(&fbdo, "led01/status", digitalRead(LED));
  }
}
