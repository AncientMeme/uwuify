from flask import Flask, send_file
from flask import jsonify
from flask import request
from logging.config import dictConfig
from flask_cors import CORS
import json
import os
import random
import photo_merger as merger


dictConfig({
    'version': 1,
    'formatters': {'default': {
        'format': '[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
    }},
    'handlers': {'wsgi': {
        'class': 'logging.StreamHandler',
        'stream': 'ext://flask.logging.wsgi_errors_stream',
        'formatter': 'default'
    }},
    'root': {
        'level': 'INFO',
        'handlers': ['wsgi']
    }
})



app = Flask(__name__)
CORS(app)

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
def echoJson():
    ret = {}
    data = request.json
    # jsonifiedContent = jsonify(data)
    app.logger.info('body content: ' + json.dumps(data))
    urls = data['urls']

    # urls = ['https://i.ytimg.com/vi/L45Ua8weKqs/hqdefault.jpg?sqp=-oaymwEcCOADEI4CSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLC9XUQUbDSSoNC2SwmU10yn5tbCLQ']
    img_paths = merger.downloadImgs(urls)
    for i in range(len(img_paths)):
        img_paths[i] = 'https://wenjunblog.xyz/' + img_paths[i]
        ret[urls[i]] = img_paths[i]

    content = {}
    # content['urls'] = img_paths
    content['urls'] = ret
    return jsonify(content)

@app.route("/echo", methods=['GET', 'POST'])
def echo():
    data = request.json
    return data


def random_image():
    """
    Return a random image from the ones in the static/ directory
    """
    img_dir = "./static"
    img_list = os.listdir(img_dir)
    img_path = os.path.join(img_dir, random.choice(img_list))
    print(img_path)
    return img_path

@app.route('/')
def myapp():
    """
    Returns a random image directly through send_file
    """
    image = random_image()
    return send_file(image, mimetype='image/jpg')

