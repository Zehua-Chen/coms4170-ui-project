from os import path, environ

import requests
from urllib.parse import urlparse, unquote_plus
from flask import Flask, Response, render_template, json, url_for, request

app = Flask(
    __name__,
    static_folder=path.join("..", "static"),
    template_folder=path.join("..", "templates"))

current_id=7
data={
    1:{
        "id":1,
        "note":"Do",
        "audio":"doAudio"
    },
    2:{
            "id":2,
            "note":"Re",
            "audio":"reAudio"
        },
    3:{
            "id":3,
            "note":"Mi",
            "audio":"miAudio"
        },
    4:{
            "id":4,
            "note":"Fa",
            "audio":"faAudio"
        },
    5:{
            "id":5,
            "note":"So",
            "audio":"soAudio"
        },
    6:{
            "id":6,
            "note":"La",
            "audio":"laAudio"
        },
    7:{
            "id":7,
            "note":"Ti",
            "audio":"tiAudio"
        }
}

def get_app_bundle():
    try:
        with open(path.join("static", "manifest.json")) as manifest_file:
            manifest = json.load(manifest_file)

        index = manifest["src/index.ts"]

        return {
            "js": url_for("static", filename=index["file"]),
            "css": map(lambda f: url_for("static", filename=f), index["css"])
        }
    except FileNotFoundError:
        return {
            "js": "",
            "css": ""
        }


@app.route("/")
def index():
    return render_template("index.html", bundle=get_app_bundle())


@app.route("/learn/<int:id>")
def learn(id: int):
    return render_template("learn.html", bundle=get_app_bundle(), id=id,note=data[id])

# @app.route("/practice/<int:id>")
# def practice(id: int):
#     return render_template("practice.html", bundle=get_app_bundle(), id=id)

@app.before_request
def before_request():
    if "static" in request.url:
        parse_result = urlparse(request.url)
        static_url = unquote_plus(f"http://localhost:3000{parse_result.path}")
        app.logger.info(static_url)

        static_response = requests.get(static_url)

        mimetype = "text/javascript"

        if "mp3" in request.url:
            mimetype = "audio/mpeg"
            app.logger.info("audio file")

        return Response(static_response.content, mimetype=mimetype)


@app.route("/static/**/<url_path>")
def static_src_file(url_path):
    app.logger.info(url_path)
    response = requests.get(f"http://localhost:3000/static/{url_path}")

    return Response(response.content, mimetype="text/javascript")

# @app.route("/static/@vite/<path:url_path>")
# def static_file(url_path):
#     app.logger.info(url_path)
#     response = requests.get(f"http://localhost:3000/static/@vite/{url_path}")

      
#     return Response(response.content, mimetype="text/javascript")
