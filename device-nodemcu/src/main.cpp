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

#define true true
//NEO_RGBW
// NEO_RGB
Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_LEDS, PIN, NEO_RGB + NEO_KHZ800);
SimpleTimer timer;
Ticker blinker[];
Ticker offer;



char paramsDefault[] = "led=10&color=ff0000&repeat=5&duration=1000&pause=500";
char params[] = parseParams(paramsDefault);

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

void on(int led,int repeat,int pause){
  digitalWrite(LED_BUILTIN,1);
  offer.once(pause,[](){
    digitalWrite(LED_BUILTIN,0);
  });
}

///////////

/******************************/

/* 
function blinkOn(color, led, repeat, duration, pause)
 color:rgb,r|g|b,null(all) default:null(all)
 led:{n,n},random,null(all) default:null(all)
 repeat:n,null default:null
 duration:n default:1000
 pause:n default:0
*/

void blinkOn(char* colorX="ffffff", int led=NULL, int repeat=1, int duration=500, int pause=500, bool autoOff=true){
  int color = 10;
  if(autoOff) blinkOff(colorX,led);

  /*Ticker staticTicker;
  blinker[color] = staticTicker;
  blinker[color].attach(duration+pause,on,led,repeat,pause);*/
}

/*
 function blinkOff(color, led)
 color:rgb,r|g|b default:all
 led:{n,n} default:null
 */

void blinkOff(char* color, int led){
  //blinker[color].detach();
}

////////////////////////////////////////


void setup()
{
  
  // initialize LED digital pin as an output.
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
  strip.begin();

  stripReset();
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
        blinkOn(NULL,"ff0066",1000,1000);
      } else if (command.indexOf("led") >= 0){
        long led = command.substring(command.indexOf("led")+3).toInt();
        Serial.print("led=");
        Serial.println(led);
        stripReset(strip.Color(0, 215, 0),led);
      } else if (command.indexOf("stop") >= 0){
        Serial.println("Stopping blink");
        blinker.detach();
        digitalWrite(LED_BUILTIN, 1);
      } else if (command.indexOf("on=") >= 0){
        Serial.println("LED ON");
        params = parseParams(command.substring(3));
        blinkOn(params["color"],params["led"],params["repeat"],params["duration"],params["pause"])
      } else if (command.indexOf("off=") >= 0){
        Serial.println("LED OFF");
        params = parseParams(command.substring(4));
        blinkOff(params["color"],params["led"])
      }
  }
}



/**********************UTILS********************/

Array parseParams(char* input,char delimeterChar='&',char splitterChar='='){
  char* command = strtok(input, delimeterChar);
  while (command != 0)
  {
      // Split the command in two values
      char* separator = strchr(command, splitterChar);
      if (separator != 0)
      {
          // Actually split the string in 2: replace ':' with 0
          *separator = 0;
          int servoId = atoi(command);
          ++separator;
          int position = atoi(separator);

          // Do something with servoId and position
      }
      // Find the next command in input string
      command = strtok(0, "&");
  }
}


uint32_t parseColor(char* color){
  int r = color[0]+color[1];
  int g = color[2]+color[3];
  int b = color[4]+color[5];
  return strip.Color(r, g, b);
}

int StrToHex(char str[])
{
  return (int) strtol(str, 0, 16);
}
