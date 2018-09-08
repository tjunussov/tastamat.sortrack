from flask import Flask
from flask import request
import threading
import time
import random
import re
from subprocess import call

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

app = Flask(__name__)

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
        # print "stopTIMER:",stopTimer
        if stopTimer == True:
            print "TRY stop timer"
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

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/off")
def requestOff():
    print("stop timer")
    global stopTimer
    stopTimer = True
    return "Off"

@app.route("/on")
def requestPut():
    # LED default options
    COLOR = "all"
    r = 0
    g = 0
    b = 0

    LED = request.args.get('led')

    print("LED: " + str(LED))

    if LED == None:
        LED = 0
        print("LED set Default: " + str(LED))

    REPEAT = request.args.get('repeat')
    print("REPEAT: " + str(REPEAT))
    if REPEAT == None:
        REPEAT = 1
        print("REPEAT set Default: " + str(REPEAT))
    DURATION = request.args.get('duration')
    print("DURATION: " + str(DURATION))
    if DURATION == None:
        DURATION = 500
        print("DURATION set Default: " + str(DURATION))
    PAUSE = request.args.get('pause')
    print("PAUSE: " + str(PAUSE))
    if PAUSE == None:
        PAUSE = DURATION
        print("PAUSE: " + str(PAUSE))

    COLOR = request.args.get('color')
    # print("COLOR request: " + str(COLOR))
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

    print("COLOR: " + str(COLOR) + "r: " + str(r) + " g: " + str(g) + " b: " + str(b))
    global stopTimer
    stopTimer = False
    my_thread = threading.Thread(target=ledBlink, args=(REPEAT, LED, DURATION, PAUSE, g, r, b))
    my_thread.start()

    return "ON"

@app.route("/print", methods=['POST'])
def rawprint():
    data = request.get_data(as_text=True)
    # print("Print Data: " + str(data))

    print("Print Data: " + data)

    with open('/dev/usb/lp0', 'w') as printer:
        printer.write(data.decode('utf-8').encode('cp1251'))
    return "PRINT"

@app.route("/testprint")
def testprint():
    call("cat yarlik.esim > /dev/usb/lp0", shell=True)
    return "TESTPRINT"

if __name__ == "__main__":
        # Create NeoPixel object with appropriate configuration.
    strip = Adafruit_NeoPixel(LED_COUNT, LED_PIN, LED_FREQ_HZ, LED_DMA, LED_INVERT, LED_BRIGHTNESS, LED_CHANNEL, LED_STRIP)
    # Intialize the library (must be called once before other functions).
    strip.begin()
    print("Server started!")
    for i in range(3):
        onStart()

    call("chmod 666 /dev/usb/lp0", shell=True)
    # subprocess.call(["chmod", "", "/dev/usb/lp0"])
    # app.run(host='0.0.0.0', port=8080, debug=True)
    app.run(host='0.0.0.0', port=8080)
