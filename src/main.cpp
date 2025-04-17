/*************************************************************
  Download latest ERa library here:
    https://github.com/eoh-jsc/era-lib/releases/latest
    https://www.arduino.cc/reference/en/libraries/era
    https://registry.platformio.org/libraries/eoh-ltd/ERa/installation

    ERa website:                https://e-ra.io
    ERa blog:                   https://iotasia.org
    ERa forum:                  https://forum.eoh.io
    Follow us:                  https://www.fb.com/EoHPlatform
 *************************************************************/

// Enable debug console
#define ERA_DEBUG

/* Define MQTT host */
#define DEFAULT_MQTT_HOST "mqtt1.eoh.io"

// You should get Auth Token in the ERa App or ERa Dashboard
#define ERA_AUTH_TOKEN "17c955f0-c03f-49ea-a776-37bb90038cb1"

/* Define setting button */
// #define BUTTON_PIN              0

#if defined(BUTTON_PIN)
    // Active low (false), Active high (true)
    #define BUTTON_INVERT       false
    #define BUTTON_HOLD_TIMEOUT 5000UL

    // This directive is used to specify whether the configuration should be erased.
    // If it's set to true, the configuration will be erased.
    #define ERA_ERASE_CONFIG    false
#endif

#include "DHT.h"
#include <Arduino.h>
#include <ERa.hpp>
#include <Automation/ERaSmart.hpp>
#include <Time/ERaEspTime.hpp>
#define DHTPIN 4
#define LED_PIN  2
#define DHTTYPE DHT22
#define ECHO_PIN 4
#define PWM_CHANNEL 0
#define PWM_FREQ 5000
#define PWM_RESOLUTION 8
DHT dht(DHTPIN, DHTTYPE);

const char ssid[] = "MTA_IOT";
const char pass[] = "aebinhphuoc";
ERaEspTime syncTime;
ERaTimer timer;
ERaSmart smart(ERa, syncTime);
WiFiClient mbTcpClient;



// Tạo chân ảo Virtual Pin trên Era
ERA_WRITE(V0) {
    int value = param.getInt();
    digitalWrite(4, value);
    ERa.virtualWrite(V0, digitalRead(4));
}
ERA_WRITE(V1) {
    int value = param.getInt();
    digitalWrite(4, value);
    ERa.virtualWrite(V1, digitalRead(4));
}
ERA_WRITE(V2) {

    int value = param.getInt();
    Serial.print("Received value on V2: ");
    Serial.println(value);
    int pwmValue = map(value, 0, 100, 0, 255);
    analogWrite(LED_PIN, pwmValue);
}
#if defined(BUTTON_PIN)
    #include <ERa/ERaButton.hpp>

    ERaButton button;

    #if ERA_VERSION_NUMBER >= ERA_VERSION_VAL(1, 2, 0)
        static void eventButton(uint8_t pin, ButtonEventT event) {
            if (event != ButtonEventT::BUTTON_ON_HOLD) {
                return;
            }
            ERa.switchToConfig(ERA_ERASE_CONFIG);
            (void)pin;
        }
    #else
        static void eventButton(ButtonEventT event) {
            if (event != ButtonEventT::BUTTON_ON_HOLD) {
                return;
            }
            ERa.switchToConfig(ERA_ERASE_CONFIG);
        }
    #endif

    #if defined(ESP32)
        #include <pthread.h>

        pthread_t pthreadButton;

        static void* handlerButton(void* args) {
            for (;;) {
                button.run();
                ERaDelay(10);
            }
            pthread_exit(NULL);
        }

        void initButton() {
            pinMode(BUTTON_PIN, INPUT);
            button.setButton(BUTTON_PIN, digitalRead, eventButton,
                            BUTTON_INVERT).onHold(BUTTON_HOLD_TIMEOUT);
            pthread_create(&pthreadButton, NULL, handlerButton, NULL);
        }
    #elif defined(ESP8266)
        #include <Ticker.h>

        Ticker ticker;

        static void handlerButton() {
            button.run();
        }

        void initButton() {
            pinMode(BUTTON_PIN, INPUT);
            button.setButton(BUTTON_PIN, digitalRead, eventButton,
                            BUTTON_INVERT).onHold(BUTTON_HOLD_TIMEOUT);
            ticker.attach_ms(100, handlerButton);
        }
    #elif defined(ARDUINO_AMEBA)
        #include <GTimer.h>

        const uint32_t timerIdButton {0};

        static void handlerButton(uint32_t data) {
            button.run();
            (void)data;
        }

        void initButton() {
            pinMode(BUTTON_PIN, INPUT);
            button.setButton(BUTTON_PIN, digitalReadArduino, eventButton,
                            BUTTON_INVERT).onHold(BUTTON_HOLD_TIMEOUT);
            GTimer.begin(timerIdButton, (100 * 1000), handlerButton);
        }
    #endif
#endif

/* This function will run every time ERa is connected */
ERA_CONNECTED() {
    ERA_LOG(ERA_PSTR("ERa"), ERA_PSTR("ERa connected!"));
}

/* This function will run every time ERa is disconnected */
ERA_DISCONNECTED() {
    ERA_LOG(ERA_PSTR("ERa"), ERA_PSTR("ERa disconnected!"));
}

/* This function will run every second to log uptime and sensor data */
void timerEvent() {
    ERA_LOG("Timer", "Uptime: %d", ERaMillis() / 1000L);
/* Lấy giá trị độ ẩm đưa lên Virtual Pin. */
/////////////////////////////////////////////////////////////
       float  humid = dht.readHumidity();
       ERa.virtualWrite(V0, humid);
/////////////////////////////////////////////////////////////
/* Lấy giá trị nhiệt độ đưa lên Virtual Pin. */
       float temp = dht.readTemperature();
       ERa.virtualWrite(V1, temp);
}

void setup() {
  dht.begin();

    /* Setup debug console */
#if defined(ERA_DEBUG)
    Serial.begin(115200);
#endif

#if defined(BUTTON_PIN)
    /* Initializing button. */
    initButton();
    /* Enable read/write WiFi credentials */
    ERa.setPersistent(true);
#endif

    /* Setup Client for Modbus TCP/IP */
    ERa.setModbusClient(mbTcpClient);

    /* Set scan WiFi. If activated, the board will scan
       and connect to the best quality WiFi. */
    ERa.setScanWiFi(true);

    /* Initializing the ERa library. */
    ERa.begin(ssid, pass);

    /* Setup timer called function every second */
    ERa.addInterval(1000L, timerEvent);

      pinMode(LED_PIN, OUTPUT);
    ledcSetup(PWM_CHANNEL, PWM_FREQ, PWM_RESOLUTION);
    ledcAttachPin(LED_PIN, PWM_CHANNEL);
}






void loop() {
       ERa.run();
 ERa.run();  // Process ERa events

// Đọc cảm biến độ ẩm
  float h = dht.readHumidity();
  // Đọc cảm biến nhiệt độ
  float t = dht.readTemperature();
  float f = dht.readTemperature(true);
  // Kiểm tra xem có lần đọc nào bị lỗi không và (để thử lại).
  if (isnan(h) || isnan(t) || isnan(f)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }
  // Đưa giá trị ra màn hình
  Serial.print(F("Độ ẩm: "));
  Serial.print(h);
  Serial.print(F("%  Nhiệt độ: "));
  Serial.print(t);
  Serial.println(F("°C "));
       delay(2000);
}