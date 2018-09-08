from pynput import keyboard
import paho.mqtt.client as mqtt
import json

mqttBool = True
pincode = ""

def on_connect(client, userdata, flags, rc):
    print("CONNECT received with code %d." % (rc))
    client.subscribe("sortrack/test")

# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))

def on_press(key):
    global mqttBool
    if mqttBool == True:
        mqttBool = False
        global client
        client = mqtt.Client()
        client.on_connect = on_connect
        client.on_message = on_message
        client.connect("smartsort.kazpost.kz", 1883, 60)
        # client.connect("tasta.cubics.io", 1883, 60)
        client.loop_start()
    try:
        global pincode
        pincode = pincode + str(key.char)
        print('string: ' + str(pincode))
        print('alphanumeric key {0} pressed'.format(key.char))
    except AttributeError:
        print('special key {0} pressed'.format(key))
        if key == keyboard.Key.enter:
            client.publish("sortrack/keyboard",pincode)
            print('pincode: {0}'.format(pincode))
            pincode = ''

def on_release(key):
    print('{0} released'.format(
        key))
    if key == keyboard.Key.esc:
        # Stop listener
        return False

# Collect events until released
with keyboard.Listener(on_press=on_press, on_release=on_release) as listener:
    print("Keyboard listener ON")
    listener.join()
