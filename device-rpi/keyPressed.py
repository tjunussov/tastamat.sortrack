from pynput import keyboard
import requests
import random

pincode = ''

def on_press(key):
    try:
        global pincode
        pincode = pincode + str(key.char)
        print('string: ' + str(pincode))
        print('alphanumeric key {0} pressed'.format(
            key.char))
    except AttributeError:
        print('special key {0} pressed'.format(
            key))
        if key == keyboard.Key.enter:
            print('pincode: {0}'.format(pincode))
            pincode = ''
            pin = random.randint(0, 11)
            r = requests.get('http://10.1.110.43/on?color=red&pin='+str(pin))
            print r.status_code
            print r.headers['content-type']

def on_release(key):
    print('{0} released'.format(
        key))
    if key == keyboard.Key.esc:
        # Stop listener
        return False

# Collect events until released
with keyboard.Listener(
        on_press=on_press,
        on_release=on_release) as listener:
    listener.join()