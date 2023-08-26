from flask import Flask
from flask import jsonify
from flask import request

app = Flask(__name__)

@app.route("/hello", methods=['GET', 'POST'])
def hello_world():
    data = request.json
    print(data)

    urls = ["google","baidu","yahoo"]
    content = {}
    content["urls"] = urls
    jsonifiedContent= jsonify(content)
    print(jsonifiedContent)
    # return "<p>Hello, World!</p>"
    return jsonifiedContent

@app.route("/echoJson", methods=['GET', 'POST'])
def echoJson(name: None):
    data = request.json
    jsonifiedContent = jsonify(data)
    return jsonifiedContent

@app.route("/echo", methods=['GET', 'POST'])
def echo():
    return "You said: " + request.args.get('text', '')

@app.route("/download", methods=['GET', 'POST'])
def downlaod_img():
    url = request.json['urls']
    print(url)
    return "success"
    # img_data = requests.get(image_url).content

