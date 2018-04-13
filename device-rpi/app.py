from flask import Flask
from flask import request
import time
import random

from neopixel import *

# LED strip configuration:
LED_COUNT      = 12      # Number of LED pixels.
LED_PIN        = 18      # GPIO pin connected to the pixels (must support PWM!).
LED_FREQ_HZ    = 800000  # LED signal frequency in hertz (usually 800khz)
LED_DMA        = 10      # DMA channel to use for generating signal (try 10)
LED_BRIGHTNESS = 255     # Set to 0 for darkest and 255 for brightest
LED_INVERT     = False   # True to invert the signal (when using NPN transistor level shift)
LED_CHANNEL    = 0
LED_STRIP      = ws.SK6812_STRIP_RGBW

app = Flask(__name__)

# Define functions which animate LEDs in various ways.
def colorWipe(strip, color, pin, wait_ms=50):
	strip.setPixelColor(pin, color)
	strip.show()
	time.sleep(wait_ms/1000.0)

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/on")
def requestR(color="red",pin=0): #color default=red, pin default=0
    r = 0
    g = 0
    b = 0
    color = request.args.get('color', color, str)
    print("Color: " + str(color))
    if color == "red":
        r = 255
    if color == "green":
        g = 255
    if color == "blue":
        b = 255
    pin = request.args.get('pin')
    print("Pin: " + str(pin))
    if color != None and pin != None:
        colorWipe(strip, Color(g, r, b), int(pin))
        time.sleep(0.5)
        colorWipe(strip, Color(0, 0, 0), int(pin))
    return "Hello World!"

if __name__ == "__main__":
        # Create NeoPixel object with appropriate configuration.
    strip = Adafruit_NeoPixel(LED_COUNT, LED_PIN, LED_FREQ_HZ, LED_DMA, LED_INVERT, LED_BRIGHTNESS, LED_CHANNEL, LED_STRIP)
    # Intialize the library (must be called once before other functions).
    strip.begin()
    print("Server started!")
    app.run(host='10.1.110.43', port=80, debug=True)
