/*
 * Blink
 * Turns on an LED on for one second,
 * then off for one second, repeatedly.
 */

#include "Arduino.h"
#include <Ticker.h>
#include <SimpleTimer.h>

#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
  #include <avr/power.h>
#endif

#define PIN D4
#define NUM_LEDS 30

//NEO_RGBW
// NEO_RGB
Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_LEDS, PIN, NEO_RGB + NEO_KHZ800);
SimpleTimer timer;
Ticker blinker;

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


int cnt = 0;
long r = 0;
long g = 0;
long b = 0;
void blink(){
  int state = digitalRead(LED_BUILTIN);
  digitalWrite(LED_BUILTIN, !state);
  // 
  if(state){
    cnt++;
    r++;
    if(r%255==0) g+=5;
    if(g%255==0) b+=5;
    stripReset(strip.Color(r%255, g%255, b%255),cnt%50);
    
    //Serial.print(cnt);
    //Serial.println(" blink");
  }
  else 
    stripReset(); // GBR
}


void setup()
{
  
  // initialize LED digital pin as an output.
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
  strip.begin();

  blinker.once(1,blink);
  stripReset();

  blinker.attach(0.005,blink);
}


void loop()
{
  // send data only when you receive data:
  if (Serial.available() > 0) {
      // read the incoming byte:
      String command = Serial.readStringUntil('\r');
      
      // say what you got:
      Serial.print("I received: ");
      Serial.println(command);

      if(command.indexOf("blink") >= 0){
        Serial.println("starting blink");
        blinker.attach(0.01,blink);
      } else if (command.indexOf("led") >= 0){
        long led = command.substring(command.indexOf("led")+3).toInt();
        Serial.print("led=");
        Serial.println(led);
        stripReset(strip.Color(0, 215, 0),led);
      } else if (command.indexOf("stop") >= 0){
        Serial.println("Stopping blink");
        blinker.detach();
        digitalWrite(LED_BUILTIN, 1);
      }
  }
}


