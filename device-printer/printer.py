from flask import Flask
from flask import request
import subprocess

app = Flask(__name__)

@app.route("/", methods=['GET'])
def hello():
    return "Print is done by POSTing data to /"

@app.route("/", methods=['POST'])
def rawprint():
    data = request.get_data(as_text=True)
    # print("Print Data: " + str(data))

    print("Print Data: " + data)

    with open('/dev/usb/lp0', 'w') as printer:
        printer.write(data.decode('utf-8').encode('cp1251'))
    return "OK!"


# @app.route("/cups", methods=['POST'])
# def cupsprint():
#     data = request.get_data('as_text ')
#     print("Print Data: " + str(data))

#     data = data.decode('utf8').encode('cp1251')
#     with open('/dev/usb/lp0', 'w') as printer:
#         printer.write(data)
#     return "OK!"

if __name__ == "__main__":
    print("Print Server started port:9080!")
    subprocess.call(["chmod", "666", "/dev/usb/lp0"])
    app.run(host='0.0.0.0', port=9080, debug=True)