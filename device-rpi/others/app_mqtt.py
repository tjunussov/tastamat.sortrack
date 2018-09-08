import paho.mqtt.client as mqtt
import json
import threading
import time
import random
import re

from neopixel import *

# LED strip configuration:
LED_COUNT      = 30      # Number of LED pixels.
LED_PIN        = 18      # GPIO pin connected to the pixels (must support PWM!).
LED_FREQ_HZ    = 800000  # LED signal frequency in hertz (usually 800khz)
LED_DMA        = 10      # DMA channel to use for generating signal (try 10)
LED_BRIGHTNESS = 255     # Set to 0 for darkest and 255 for brightest
LED_INVERT     = False   # True to invert the signal (when using NPN transistor level shift)
LED_CHANNEL    = 0
LED_STRIP      = ws.WS2811_STRIP_GRB

stopTimer = False

cssColor = re.compile('^([0-9a-fA-F]{3}){1,2}$')

def onStart():
    for number in range(LED_COUNT):
        colorWipe(strip, Color(255, 255, 255), number,1)
    time.sleep(0.5)
    for number in range(LED_COUNT):
        colorWipe(strip, Color(0, 0, 0), number,1)
    time.sleep(0.5)

def ledBlink(REPEAT, LED, DURATION, PAUSE, g, r, b):
    while REPEAT >=1:
        colorWipe(strip, Color(g, r, b), LED)
        time.sleep(float(DURATION)*0.001)
        colorWipe(strip, Color(0, 0, 0), LED)
        time.sleep(float(PAUSE)*0.001)
        REPEAT = int(REPEAT) - 1
        if stopTimer == True:
            print "STOPING TIMER"
            return 0

# Define functions which animate LEDs in various ways.
def colorWipe(strip, color, pin, wait_ms=50):
    if pin == "all":
        for i in range(LED_COUNT):
            strip.setPixelColor(i, color)
    else:
	    strip.setPixelColor(int(pin), color)
    strip.show()
    time.sleep(wait_ms/1000.0)

def mqttOffLed():
    print("stop timer")
    global stopTimer
    stopTimer = True
    return "Off"

def mqttOnLed(PAUSE, COLOR, LED, REPEAT, DURATION):

    r = 0
    g = 0
    b = 0

    if COLOR == None or COLOR == "all":
        r = 255
        g = 255
        b = 255
    elif COLOR == "r":
        r = 255
    elif COLOR == "g":
        g = 255
    elif COLOR == "b":
        b = 255
    elif cssColor.match(COLOR):
        # print("cssmatch")
        # print("csscolor "+ str(COLOR) + "r" + COLOR[1:3] + "g" + COLOR[3:5] + "b" + COLOR[5:7])
        r = int(COLOR[0:2],16)
        g = int(COLOR[2:4],16)
        b = int(COLOR[4:6],16)
    
    print("LED: " + str(LED))
    print("REPEAT: " + str(REPEAT))
    print("DURATION: " + str(DURATION))
    print("PAUSE " + str(PAUSE))
    print("COLOR: " + str(COLOR) + " r: " + str(r) + " g: " + str(g) + " b: " + str(b))
    global stopTimer
    stopTimer = False
    my_thread = threading.Thread(target=ledBlink, args=(REPEAT, LED, DURATION, PAUSE, g, r, b))
    my_thread.start()
    return "OK"

def on_connect(client, userdata, flags, rc):
    print("CONNACK received with code %d." % (rc))
    for i in range(3):
        onStart()
    client.subscribe("sortrack/on")
    client.subscribe("sortrack/off")

def on_message(client, userdata, msg):
    print("reseived message from topic: " + msg.topic+", message: "+str(msg.payload))
    if msg.topic == "sortrack/on":
        parsed_json = json.loads(str(msg.payload))

        if 'duration' not in parsed_json:
            duration = 500
            print("DURATION set Default: " + str(duration))
        else:
            duration = parsed_json["duration"]

        if 'pause' not in parsed_json:
            pause = duration
            print("PAUSE set Default: " + str(pause))
        else:
            pause = parsed_json["pause"]
        
        if 'color' not in parsed_json:
            color = "all"
            print("COLOR set Default: " + str(color))
        else:
            color = parsed_json["color"]
        
        if 'led' not in parsed_json:
            led = 0
            print("LED set Default: " + str(led))
        else:
            led = parsed_json["led"]

        if 'repeat' not in parsed_json:
            repeat = 1
            print("REPEAT set Default: " + str(repeat))
        else:
            repeat = parsed_json["repeat"]

        if len(led) > 1:
            for i in range(len(led)):
                mqttOnLed(pause, color, led[i], repeat, duration)
        else:
            mqttOnLed(pause, color, led[0], repeat, duration)

    if msg.topic == "sortrack/off":
        if str(msg.payload) == "stop":
            mqttOffLed()

if __name__ == "__main__":
    strip = Adafruit_NeoPixel(LED_COUNT, LED_PIN, LED_FREQ_HZ, LED_DMA, LED_INVERT, LED_BRIGHTNESS, LED_CHANNEL, LED_STRIP)
    strip.begin()
    print("Server started!")
    global client
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect("tasta.cubics.io", 1883, 60)
    #client.connect("smartsort.kazpost.kz", 1883, 60)
    client.loop_forever()
