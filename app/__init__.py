from os import path

import requests

from datetime import datetime
from urllib.parse import urlparse
from flask import Flask, render_template, json, url_for, request
from flask.wrappers import Response

from .teach import lessons, lessons_overview
from .practice import practices, practices_overview
from .quiz import quizzes, quizzes_overview, quiz_score

app = Flask(
    __name__,
    static_folder=path.join("..", "static"),
    template_folder=path.join("..", "templates"))

current_id = 7


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
    lesson = lessons[id]
    sent_lesson = lesson.copy()

    lesson["last_visited"] = str(datetime.now())

    return render_template(
        "learn.html",
        bundle=get_app_bundle(),
        lessons_overview=lessons_overview,
        lesson=sent_lesson)


@app.route("/practice/clip/<path:id>")
def practice_clip(id: int):
    clip_path = path.join("practices", f"{id}")
    response = app.send_static_file(clip_path)

    response.mimetype = "audio/mp3"

    return response


@app.route("/practice/<int:id>")
def practice(id: int):
    return render_template(
        "practice.html",
        bundle=get_app_bundle(),
        practices_overview=practices_overview,
        practice=practices[id])


@app.route("/quiz/<int:id>")
def quiz(id: int):
    return render_template(
        "quiz.html",
        bundle=get_app_bundle(),
        quiz=quizzes[id],
        quizzes_overview=quizzes_overview)


@app.route("/quiz/submit/<int:id>", methods=["POST"])
def quiz_submit(id: int):
    global quiz_score
    _solution = request.json
    app.logger.info(f"submit quiz {id}")
    quiz_score += 1

    return "", 200


@app.route("/finish")
def finish():
    global quiz_score
    return render_template("finish.html", score=quiz_score)
# @app.route("/practice/<int:id>")
# def practice(id: int):
#     return render_template("practice.html", bundle=get_app_bundle(), id=id)


if app.config["DEBUG"]:
    @app.before_request
    def before_request():
        if "static" in request.url:
            parse_result = urlparse(request.url)

            static_url = f"http://localhost:3000{parse_result.path}?{parse_result.query}"
            static_url = static_url.replace("%40", "@")

            static_response = requests.get(static_url)

            mimetype = "application/javascript"

            if "mp3" in static_url and "mp3?import" not in static_url:
                mimetype = "audio/mpeg"
                app.logger.info("audio file")

            return Response(static_response.content, mimetype=mimetype)


# @app.route("/static/@vite/<path:url_path>")
# def static_file(url_path):
#     app.logger.info(url_path)
#     response = requests.get(f"http://localhost:3000/static/@vite/{url_path}")


#     return Response(response.content, mimetype="text/javascript")
