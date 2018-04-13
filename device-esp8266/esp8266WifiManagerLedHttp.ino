#include <Servo.h>

#include <SimpleTimer.h>

#include <ESP8266WiFi.h>          //https://github.com/esp8266/Arduino

//needed for library
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <WiFiManager.h>          //https://github.com/tzapu/WiFiManager

Servo servo;

//for LED status
#include <Ticker.h>
Ticker ticker;

#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
  #include <avr/power.h>
#endif

#define NUM_LEDS 12

Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_LEDS, 4, NEO_RGBW + NEO_KHZ800);

ESP8266WebServer server(80);

SimpleTimer timer;

int timerIntervalR = 0;
int timerIntervalG = 0;
int timerIntervalB = 0;

int showIntervalR = 0;
int showIntervalG = 0;
int showIntervalB = 0;

int ledTimeout = 5000; //by default timeout = 5000
int searchBrightness = 10;
int blinkInterval = 500;
int searchBlinkInterval = 10;
int ledBlinkCount = 10;
int timeout = 1000;


int ledPutR = NULL;
int ledPutG = NULL;
int ledPutB = NULL;

int ledBlinkCountR = NULL;
int ledBlinkCountG = NULL;
int ledBlinkCountB = NULL;

void tick()
{
  //toggle state
  int state = digitalRead(BUILTIN_LED);  // get the current state of GPIO1 pin
  digitalWrite(BUILTIN_LED, !state);     // set pin to the opposite state
}

void searchLedAnimationR() {
  int randNum1 = random(NUM_LEDS);
  int randNum2 = random(NUM_LEDS);
  int randNum3 = random(NUM_LEDS);
  int randNum4 = random(NUM_LEDS);
  colorWipe(strip.Color(searchBrightness, 0, 0), 5, randNum1);
  colorWipe(strip.Color(searchBrightness, 0, 0), 5, randNum2);
  colorWipe(strip.Color(searchBrightness, 0, 0), 5, randNum2);
  colorWipe(strip.Color(searchBrightness, 0, 0), 5, randNum4);
  delay(searchBlinkInterval);
  colorWipe(strip.Color(0, 0, 0), 5, randNum1);
  colorWipe(strip.Color(0, 0, 0), 5, randNum2);
  colorWipe(strip.Color(0, 0, 0), 5, randNum3);
  colorWipe(strip.Color(0, 0, 0), 5, randNum4);
}

void searchLedAnimationG() {
  int randNum1 = random(NUM_LEDS);
  int randNum2 = random(NUM_LEDS);
  int randNum3 = random(NUM_LEDS);
  int randNum4 = random(NUM_LEDS);
  colorWipe(strip.Color(0, searchBrightness, 0), 5, randNum1);
  colorWipe(strip.Color(0, searchBrightness, 0), 5, randNum2);
  colorWipe(strip.Color(0, searchBrightness, 0), 5, randNum2);
  colorWipe(strip.Color(0, searchBrightness, 0), 5, randNum4);
  delay(searchBlinkInterval);
  colorWipe(strip.Color(0, 0, 0), 5, randNum1);
  colorWipe(strip.Color(0, 0, 0), 5, randNum2);
  colorWipe(strip.Color(0, 0, 0), 5, randNum3);
  colorWipe(strip.Color(0, 0, 0), 5, randNum4);
}

void searchLedAnimationB() {
  int randNum1 = random(NUM_LEDS);
  int randNum2 = random(NUM_LEDS);
  int randNum3 = random(NUM_LEDS);
  int randNum4 = random(NUM_LEDS);
  colorWipe(strip.Color(0, 0, searchBrightness), 5, randNum1);
  colorWipe(strip.Color(0, 0, searchBrightness), 5, randNum2);
  colorWipe(strip.Color(0, 0, searchBrightness), 5, randNum2);
  colorWipe(strip.Color(0, 0, searchBrightness), 5, randNum4);
  delay(searchBlinkInterval);
  colorWipe(strip.Color(0, 0, 0), 5, randNum1);
  colorWipe(strip.Color(0, 0, 0), 5, randNum2);
  colorWipe(strip.Color(0, 0, 0), 5, randNum3);
  colorWipe(strip.Color(0, 0, 0), 5, randNum4);
}

//gets called when WiFiManager enters configuration mode
void configModeCallback (WiFiManager *myWiFiManager) {
  Serial.println("Entered config mode");
  Serial.println(WiFi.softAPIP());
  //if you used auto generated SSID, print it
  Serial.println(myWiFiManager->getConfigPortalSSID());
  //entered config mode, make led toggle faster
  ticker.attach(0.2, tick);
}

void setup() {
  strip.begin();
  // put your setup code here, to run once:
  Serial.begin(115200);
  
  //set led pin as output
  pinMode(BUILTIN_LED, OUTPUT);
  // start ticker with 0.5 because we start in AP mode and try to connect
  ticker.attach(0.6, tick);

  //WiFiManager
  //Local intialization. Once its business is done, there is no need to keep it around
  WiFiManager wifiManager;
  //reset settings - for testing
//  wifiManager.resetSettings();

  //set callback that gets called when connecting to previous WiFi fails, and enters Access Point mode
  wifiManager.setAPCallback(configModeCallback);

  //fetches ssid and pass and tries to connect
  //if it does not connect it starts an access point with the specified name
  //here  "AutoConnectAP"
  //and goes into a blocking loop awaiting configuration
  if (!wifiManager.autoConnect()) {
    Serial.println("failed to connect and hit timeout");
    //reset and try again, or maybe put it to deep sleep
    ESP.reset();
    delay(1000);
  }

  //if you get here you have connected to the WiFi
  Serial.println("connected...yeey :)");
  ticker.detach();
  //keep LED on
  digitalWrite(BUILTIN_LED, LOW);

  server.on("/", [](){
    reply();
  });
  server.on("/on", [](){
    
    int color = server.arg("color").toInt();
    int ledPut = server.arg("put").toInt();
    int ledBind = server.arg("bind").toInt();
    int ledSearch = server.arg("search").toInt();
    
    uint8_t r = 0;
    uint8_t g = 0;
    uint8_t b = 0;

    clearSearchIntervals();
    
    reply();

    if(color != NULL){
      if(color == 1) r = 255;
      else if(color == 2) g = 255;
      else if(color == 3) b = 255;
    }
 
    if(ledPut != NULL){
      if(r > 0) { ledPutR = ledPut; timer.disable(showIntervalR); ledBlinkCountR = ledBlinkCount; timer.enable(showIntervalR); }
      else if(g > 0) { ledPutG = ledPut; timer.disable(showIntervalG); ledBlinkCountG = ledBlinkCount; timer.enable(showIntervalG); }
      else if(b > 0) { ledPutB = ledPut; timer.disable(showIntervalB); ledBlinkCountB = ledBlinkCount; timer.enable(showIntervalB); }
    }
    else if(ledBind != NULL){
      colorWipe(strip.Color(r, g, b), 50, ledBind-1);
      servo.write(180);
      delay(500);
      servo.write(0);
      colorWipe(strip.Color(0, 0, 0), 50, ledBind-1);
    }
    else if(ledSearch != NULL){
      if(r > 0) timer.enable(timerIntervalR);
      else if(g > 0) timer.enable(timerIntervalG);
      else if(b > 0) timer.enable(timerIntervalB);
    }
  });

  server.on("/setup", [](){
    
    if(server.arg("ledtimeout").toInt() != NULL){
      ledTimeout = server.arg("ledtimeout").toInt();
    }
    if(server.arg("searchbrightness").toInt() != NULL){
      searchBrightness = server.arg("searchbrightness").toInt();
    }
    if(server.arg("blinkinterval").toInt() != NULL){
      blinkInterval = server.arg("blinkinterval").toInt();
    }

    clearSearchIntervals();
    setupShowIntervals();

    onInit();
    
    reply();

  });
  server.begin();
  String ipaddress = WiFi.localIP().toString();
  Serial.println("ESP8266 ipaddress:" + ipaddress);
  Serial.println("HTTP server started");
  
  for(int i=0;i<3;i++){
    onInit();
  }

  servo.attach(5);
  
  servo.write(0);
  
  timerIntervalR = timer.setInterval(50, searchLedAnimationR);
  timerIntervalG = timer.setInterval(50, searchLedAnimationG);
  timerIntervalB = timer.setInterval(50, searchLedAnimationB);

  timer.disable(timerIntervalR);
  timer.disable(timerIntervalG);
  timer.disable(timerIntervalB);  

  setupShowIntervals();
}

void loop() {
  // put your main code here, to run repeatedly:
  server.handleClient();
  timer.run();
}

void onInit(){
  for(int i=0; i<NUM_LEDS;i++){
    colorWipe(strip.Color(255, 234, 0), 1, i);
  }
  delay(500);
  for(int i=0; i<NUM_LEDS;i++){
    colorWipe(strip.Color(0, 0, 0), 1, i);
  }
  delay(500);
}


void clearSearchIntervals(){
  timer.disable(timerIntervalR);
  timer.disable(timerIntervalG);
  timer.disable(timerIntervalB);  
}

void setupShowIntervals(){
  ledBlinkCount=ledTimeout/blinkInterval;
  showIntervalR = timer.setInterval(blinkInterval, showledAnimationR);
  timer.disable(showIntervalR);
  showIntervalG = timer.setInterval(blinkInterval, showledAnimationG);
  timer.disable(showIntervalG);
  showIntervalB = timer.setInterval(blinkInterval, showledAnimationB); 
  timer.disable(showIntervalB);  
}


void showledAnimationR() {
  (ledBlinkCountR-- % 2 == 0) ? toggleLed(255,0,0,ledPutR) : toggleLed(0,0,0,ledPutR);
  if(ledBlinkCountR == 0 ) timer.disable(showIntervalR); 
}

void showledAnimationG() {
  (ledBlinkCountG-- % 2 == 0) ? toggleLed(0,255,0,ledPutG) : toggleLed(0,0,0,ledPutG);
  if(ledBlinkCountG == 0 ) timer.disable(showIntervalG);
}

void showledAnimationB() {
  (ledBlinkCountB-- % 2 == 0) ? toggleLed(0,0,255,ledPutB) : toggleLed(0,0,0,ledPutB);
  if(ledBlinkCountB == 0 ) timer.disable(showIntervalB);
}

boolean RG = false;

void toggleLed(uint8_t r,uint8_t g, uint8_t b, int led){
  if(ledBlinkCountR > 0 && ledBlinkCountG > 0  && ledPutR == ledPutG){
    RG = !RG;
    if(RG) colorWipe(strip.Color(255, 0, 0), 50, led-1);
    else colorWipe(strip.Color(0, 255, 0), 50, led-1);
  } else {
    colorWipe(strip.Color(r, g, b), 50, led-1);
  }
}

void reply(){
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Origin,X-Requested-With,Accept,Content-Type");
  server.send(200, "text/html");
}

void colorWipe(uint32_t c, uint8_t wait, int i) {
  strip.setPixelColor(i, c);
  strip.show();
  //delay(wait);
}
