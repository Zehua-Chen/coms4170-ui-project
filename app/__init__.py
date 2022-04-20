from os import path

import requests

from datetime import datetime
from urllib.parse import urlparse
from flask import Flask, json, url_for, request
from flask.wrappers import Response

from .view import render_template
from .learn import blueprint as learn_blueprint
from .practice import blueprint as practice_blueprint
from .quiz import blueprint as quiz_blueprint

app = Flask(
    __name__,
    static_folder=path.join("..", "static"),
    template_folder=path.join("..", "templates"))

current_id = 7


@app.route("/")
def index():
    return render_template("index.html")


app.register_blueprint(learn_blueprint)
app.register_blueprint(practice_blueprint)
app.register_blueprint(quiz_blueprint)


if app.config["DEBUG"]:
    @app.before_request
    def before_request():
        if "static" in request.url:
            parse_result = urlparse(request.url)

            static_url = f"http://localhost:3000{parse_result.path}?{parse_result.query}"
            static_url = static_url.replace("%40", "@")

            static_response = requests.get(static_url)

            mimetype = "application/javascript"

            if "Content-Type" in static_response.headers:
                mimetype = static_response.headers["Content-Type"]

            return Response(static_response.content, mimetype=mimetype)
