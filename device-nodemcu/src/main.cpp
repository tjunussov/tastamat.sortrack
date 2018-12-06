/*
 * Blink
 * Turns on an LED on for one second,
 * then off for one second, repeatedly.
 */

#include "Arduino.h"
#include "Ticker.h"

#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>

#include <WiFiManager.h> 
#include <DNSServer.h>
#include <ESP8266mDNS.h>
#include <FS.h>


#include <WiFiUdp.h>
#include <ArduinoOTA.h>


#include <ArduinoOTA.h>

#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
  #include <avr/power.h>
#endif

#define PIN D4

int NUM_LEDS = 24;
bool debug = false;

// #define String mqtt_server

#define true true
//NEO_RGBW
// NEO_RGB
Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_LEDS, PIN, NEO_RGB + NEO_KHZ800);

ESP8266WebServer server(80);
WiFiClient client;

struct StripParams {
    char colorName;
    int colorIndex;
    uint32_t color;
    int led;
    int repeat;
    int pause;
    int duration;
    int brightness;
    int autoOff;
    int count;
    bool active;
    bool debug;
};

struct StripLeds {
  int cursor;
  StripParams* params[10];
};

Ticker onTickers[10];
Ticker offTickers[10];
StripParams params[10];
StripLeds leds[255];
Ticker ticker;


/////////// STRIP

void stripSet(uint32_t c, int l=-1) {
  if(l >=0) strip.setPixelColor(l,c);
  strip.show();
}

void stripReset(uint32_t c=0, int l=-1){
  for(int i=0; i<NUM_LEDS;i++){
    strip.setPixelColor(i,0);
  }
  stripSet(c,l);
}

void stripShow(int led,uint32_t c=0){
  if(led == -1){ // All leds if 0
    for(int i=0; i<NUM_LEDS;i++){
      strip.setPixelColor(i,c);
    }
  } else {
    strip.setPixelColor(led,c);
  }
  strip.show();
}

uint32_t parseColor(int colorIndex,int brightness = 255){
  
  switch(colorIndex){
    case 1 : return strip.Color(brightness, 0, 0); break; // red (r)
    case 2 : return strip.Color(0, brightness, 0); break; // green (g)
    case 3 : return strip.Color(0, 0, brightness); break; // blue (b)
    case 4 : return strip.Color(brightness, brightness, 0); break; // yellow (y)
    case 5 : return strip.Color(brightness, 0, brightness); break; // pink (p)
    case 6 : return strip.Color(0, brightness, brightness); break; // teal (t)
    case 7 : return strip.Color(brightness, 128, 0); break; // orange (o)
    case 8 : return strip.Color(128, 0, brightness); break; // maroon (m)
    case 9 : return strip.Color(0, 128, brightness); break; // sky (s)
    default: return strip.Color(brightness, brightness, brightness); break; // white (w)
  }
}

int parseColorName(char colorName){
  switch(colorName){
    case 'r' : return 1; break; // red (r)
    case 'g' : return 2; break; // green (g)
    case 'b' : return 3; break; // blue (b)
    case 'y' : return 4; break; // yellow (y)
    case 'p' : return 5; break; // pink (p)
    case 't' : return 6; break; // teal (t)
    case 'o' : return 7; break; // orange (o)
    case 'm' : return 8; break; // maroon (m)
    case 's' : return 9; break; // sky (s)
    default: return 0; break; // white (w)
  }
}

///////////

/******************************/

void blinkOff(int colorIndex = -1){

  if(debug) Serial.printf("blinkOff:\t\t%d\n",colorIndex);

  if(colorIndex == -1)
    for(int i=0; i < 10; i++) {
      onTickers[i].detach();
      params[i].count = 0;
      for(int l=0; l < 255; l++) leds[l].params[i]=NULL;
      stripReset();
    }
  else{
    onTickers[colorIndex].detach();
    for(int l=0; l < 255; l++) leds[l].params[colorIndex]=NULL;
    params[colorIndex].count = 0;
  }
    
}

void blinkTick(int colorIndex){
  StripParams *p = &params[colorIndex];

  int led = p->led; // because we must turn off led after random

  if(led == -2){
     led = random(1, NUM_LEDS);
  } 

  stripShow(led,p->color);
  
  if(p->pause > 10){ // faster blinker
    offTickers[colorIndex].once_ms<int>(p->pause,[](int led){
      if(debug) Serial.printf("off:\t\t%d\n",led);
      stripShow(led,0); // off led
      
    },led);
  } else {
    delay(10);
    stripShow(led,0); // off led
  }

  if(debug)
  Serial.printf("setPixelColor:\t\tcnt:%dcolor:%drepeat:%d led:%d duration:%d pause:%d\n",p->count,colorIndex,p->repeat,led,p->duration,p->pause);

  if (p->repeat > 0 ){
    if (++p->count == p->repeat) blinkOff(p->colorIndex);
  }
}

void blinkOn(int colorIndex){

  StripParams *p = &params[colorIndex];
  
  if(debug){
    Serial.printf("Duration:\t\t%d\n",p->duration);
    Serial.printf("Pause:\t\t%d\n",p->pause);
    Serial.printf("Led:\t\t%d\n",p->led);
    Serial.printf("Color:\t\t%d\n",p->color);
    Serial.printf("Repeat:\t\t%d\n",p->repeat);
    Serial.printf("Brightness:\t\t%d\n",p->brightness);
  }

  if(params[colorIndex].autoOff == 1) blinkOff(colorIndex);
  else if(params[colorIndex].autoOff == 2) blinkOff();

  // immediate show
  blinkTick(colorIndex);

  // show on tick
  onTickers[p->colorIndex].attach_ms<int>(p->duration+p->pause,blinkTick,colorIndex);
}

/* 
 color:rgb,r|g|b,null(all) default:null(all)
 led:{n,n},random,null(all) default:null(all)
 repeat:n,null default:null
 duration:n default:1000
 pause:n default:0
*/

/***************************/
void tick()
{
  //toggle state
  int state = digitalRead(LED_BUILTIN);  // get the current state of GPIO1 pin
  digitalWrite(LED_BUILTIN, !state);     // set pin to the opposite state
}

void reply(int colorIndex=NULL){

  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Origin,X-Requested-With,Accept,Content-Type");
  // server.sendHeader("Content-Type", "application/json");

  String msg = "{\"response\":\"ok\"";

  if(colorIndex != NULL){
    StripParams *p = &params[colorIndex];
    msg += ",";
    msg += "\"led\":\""+String(p->led)+"\",";
    msg += "\"color\":{\"index\":\""+String(p->colorIndex)+"\",\"name\":\""+String(p->colorName)+"\"},";
    msg += "\"repeat\":"+String(p->repeat)+",";
    msg += "\"duration\":"+String(p->duration)+",";
    msg += "\"pause\":"+String(p->pause)+",";
    msg += "\"duration\":"+String(p->duration)+",";
    msg += "\"brightness\":"+String(p->brightness)+",";
    msg += "\"debug\":"+String(debug)+",";
    msg += "\"size\":"+String(NUM_LEDS)+"";
  }

  msg += "}";

  server.send(200, "application/json",msg);

}

//gets called when WiFiManager enters configuration mode
void configModeCallback (WiFiManager *myWiFiManager) {
  Serial.println("Entered config mode");
  Serial.println(WiFi.softAPIP());
  //if you used auto generated SSID, print it
  Serial.println(myWiFiManager->getConfigPortalSSID());
  //entered config mode, make led toggle faster
  ticker.attach_ms(50, tick);
}


int greetCnt = 0;

void stripGreeting(){  
  onTickers[0].attach_ms(1000,[](){
    stripShow(-1,strip.Color(10, 10, 10)); // on white
    offTickers[0].once_ms(500,[](){
      stripShow(-1,0); // off led
      if(greetCnt == 3 ) onTickers[0].detach();
    });
    greetCnt++;
  });
}


String getContentType(String filename) { // convert the file extension to the MIME type
  if (filename.endsWith(".html")) return "text/html";
  else if (filename.endsWith(".css")) return "text/css";
  else if (filename.endsWith(".js")) return "application/javascript";
  else if (filename.endsWith(".ico")) return "image/x-icon";
  else if(filename.endsWith(".gz")) return "application/x-gzip";
  return "text/plain";
}

bool handleFileRead(String path) { // send the right file to the client (if it exists)
  Serial.println("handleFileRead: " + path);
  if (path.endsWith("/")) path += "index.html";         // If a folder is requested, send the index file
  String contentType = getContentType(path);            // Get the MIME type
  if (SPIFFS.exists(path)) {                            // If the file exists
    File file = SPIFFS.open(path, "r");                 // Open it
    server.streamFile(file, contentType); // And send it to the client
    file.close();                                       // Then close the file again
    return true;
  }
  Serial.println("\tFile Not Found");
  return false;                                         // If the file doesn't exist, return false
}


////////////////////////////////////////


void setup()
{
  
  // initialize LED digital pin as an output.
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
  strip.begin();
  stripReset();

  // start ticker with 0.5 because we start in AP mode and try to connect
  ticker.attach_ms(200,tick);

  WiFi.hostname("sortrack");
  WiFiManager wifiManager;
  // WiFiManagerParameter custom_mqtt_server("server", "mqtt server", mqtt_server, 40);
  // wifiManager.addParameter(&custom_mqtt_server);
  wifiManager.setAPCallback(configModeCallback);

  //fetches ssid and pass and tries to connect
  //if it does not connect it starts an access point with the specified name
  //here  "AutoConnectAP"
  //and goes into a blocking loop awaiting configuration

  const char* ssid = "SORTRACK "+ESP.getChipId();
  if (!wifiManager.autoConnect(ssid)) {
    Serial.println("failed to connect and hit timeout");
    //reset and try again, or maybe put it to deep sleep
    ESP.reset();
    delay(1000);
  }

  if (!MDNS.begin("sortrack")) {             // Start the mDNS responder for sortrack.local
    Serial.println("Error setting up MDNS responder!");
  } else {
    Serial.println("mDNS responder started");
  }

  SPIFFS.begin();                           // Start the SPI Flash Files System

  //if you get here you have connected to the WiFi
  Serial.println("connected...yeey :)");
  ticker.detach();

  server.serveStatic("/index.html", SPIFFS, "/index.html");
  server.onNotFound([]() {                              // If the client requests any URI
    if (!handleFileRead(server.uri()))                  // send it if it exists
      server.send(404, "text/plain", "404: Not Found"); // otherwise, respond with a 404 (Not Found) error
  });
  
  server.on("/on",[](){

    StripParams p;

    p.count = 0;
    p.active = true;
    p.brightness = (server.arg("brightness") != "") ? server.arg("brightness").toInt() : 255;
    p.colorName = (server.arg("color") != "") ? server.arg("color").charAt(0) : 'w';
    p.colorIndex = (server.arg("colorIndex") != "") ? server.arg("colorIndex").toInt() : parseColorName(p.colorName);
    p.color = parseColor(p.colorIndex,p.brightness);

    p.led = 
      (server.arg("led") == "") ? -1 :
        (server.arg("led") == "random" || server.arg("led") == "-2") ? -2 :
           (server.arg("led") == "all" || server.arg("led") == "-1" ) ? -1 : 
            server.arg("led").toInt();
    
    p.repeat = (server.arg("repeat") != "") ? server.arg("repeat").toInt() : 1;
    p.duration = (server.arg("duration") != "") ? server.arg("duration").toInt() : 500;
    p.pause = (server.arg("pause") != "") ? server.arg("pause").toInt() : p.duration;
    p.autoOff = (server.arg("autoOff") == "all") ? 2 : 
        (server.arg("autoOff") == "false") ? 0 : 1;

    debug = (server.arg("debug") == "true") ? true : false;

    if (server.hasArg("size")){
      NUM_LEDS = server.arg("size").toInt();
    }

    params[p.colorIndex] = p;
    blinkOn(p.colorIndex);

    reply(p.colorIndex);

  });

  server.on("/off", [](){
    if (server.hasArg("color")) {
      blinkOff(parseColorName(server.arg("color").charAt(0)));
    } else {
      blinkOff();
    }
    reply();
  });

  const int bufferSize = 6000;
  uint8_t _buffer[6000];
  //a little counter to know at which position we are in our buffer
  int bufferCounter = 0;

  server.on("/proxy", HTTP_POST, [](){
    if (!client.connect(server.arg("host"), server.arg("port").toInt())) {
      server.send(500, "text/plain","connection failed");
      return;
    }
    if (server.hasArg("plain")== true){ //Check if body received
      client.print(server.arg("plain"));
      client.stop();
      server.send(200, "text/plain", "Body sent");
      return;
    }
    reply();
  });

  server.begin();
  // server.setNoDelay(true);
  
  String ipaddress = WiFi.localIP().toString();
  Serial.println("ESP8266 ipaddress:" + ipaddress);
  Serial.println("HTTP server started");

  ArduinoOTA.onStart([]() {
    Serial.println("Start");
  });
  ArduinoOTA.onEnd([]() {
    Serial.println("\nEnd");
  });
  ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
    Serial.printf("Progress: %u%%\r", (progress / (total / 100)));
  });
  ArduinoOTA.onError([](ota_error_t error) {
    Serial.printf("Error[%u]: ", error);
    if (error == OTA_AUTH_ERROR) Serial.println("Auth Failed");
    else if (error == OTA_BEGIN_ERROR) Serial.println("Begin Failed");
    else if (error == OTA_CONNECT_ERROR) Serial.println("Connect Failed");
    else if (error == OTA_RECEIVE_ERROR) Serial.println("Receive Failed");
    else if (error == OTA_END_ERROR) Serial.println("End Failed");
  });
  ArduinoOTA.begin();

  //keep LED on
  digitalWrite(BUILTIN_LED, LOW);

  // 3 times flash
  stripGreeting();
}



String substr(String i, String name){
  return i.substring(i.indexOf(name+"=")+name.length()+1,i.indexOf(name+"=")+name.length()+1+i.substring(i.indexOf(name+"=")+name.length()+1).indexOf('&'));
}


StripParams parseParams(String i){
  StripParams p;

  p.count = 0;
  p.active = true;
  p.autoOff = true;

  p.colorName = i.indexOf("color=") > -1 ? substr(i,"color").charAt(0) : 'w';
  p.led = i.indexOf("led=") > -1 ? substr(i,"led").toInt() : -1;
  p.repeat = i.indexOf("repeat=") > -1 ? substr(i,"repeat").toInt() : 1;
  p.duration = i.indexOf("duration=") > -1 ? substr(i,"duration").toInt() : 500;
  p.pause = i.indexOf("pause=") > -1 ? substr(i,"pause").toInt() : p.duration;

  if(i.indexOf("debug=") > -1 ) debug = (substr(i,"debug")=="true") ? true : false;
  if(i.indexOf("autoOff=") > -1 ) p.autoOff = (substr(i,"autoOff")=="all") ? 2 : 1;
  
  p.colorIndex = parseColorName(p.colorName);
  p.color = parseColor(p.colorIndex);

  params[p.colorIndex] = p;
  leds[p.led].params[p.colorIndex]=&p;

  return p;
}

void loop()
{
  // send data only when you receive data:
  server.handleClient();
  ArduinoOTA.handle();

  if (Serial.available() > 0) {
      // read the incoming byte:
      String command = Serial.readStringUntil('\r');
      
      // say what you got:
      Serial.print("I received: ");
      Serial.println(command);

      if (command.indexOf("/on?") >= 0){
        Serial.println("LED ON");
        StripParams p = parseParams(command.substring(command.indexOf("/on?")+4));
        blinkOn(p.colorIndex);
      } else if (command.indexOf("/off") >= 0){
        Serial.println("LED OFF");
        blinkOff();
      }
  }
}