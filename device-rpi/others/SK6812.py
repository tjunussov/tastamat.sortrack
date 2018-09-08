# NeoPixel library strandtest example
# Author: Tony DiCola (tony@tonydicola.com)
#
# Direct port of the Arduino NeoPixel library strandtest example.  Showcases
# various animations on a strip of NeoPixels.
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

#LED_STRIP      = ws.SK6812W_STRIP


# Define functions which animate LEDs in various ways.
def colorWipe(strip, color, pin, wait_ms=50):
	strip.setPixelColor(pin, color)
	strip.show()
	time.sleep(wait_ms/1000.0)

# Main program logic follows:
if __name__ == '__main__':
	# Create NeoPixel object with appropriate configuration.
	strip = Adafruit_NeoPixel(LED_COUNT, LED_PIN, LED_FREQ_HZ, LED_DMA, LED_INVERT, LED_BRIGHTNESS, LED_CHANNEL, LED_STRIP)
	# Intialize the library (must be called once before other functions).
	strip.begin()

	print("Enter colors brightness:")
	R = input("Red: ")
	G = input("Green: ")
	B = input("Blue: ")
	print("You chosed colors: format RGB({0} {1} {2})".format(R,G,B))

	print ('Press Ctrl-C to quit.')
	while True:
		pin = input("Choose pin number: ")
		if pin == None:
			pin = random.randint(0, LED_COUNT)
		print("You chosed pin: {0}".format(pin))
		colorWipe(strip, Color(G, R, B), pin)  # Red wipe