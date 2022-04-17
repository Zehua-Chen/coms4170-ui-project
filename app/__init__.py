from os import path
from flask import Flask, render_template, json, url_for

app = Flask(
    __name__,
    static_folder=path.join("..", "static"),
    template_folder=path.join("..", "templates"))


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
    return render_template("learn.html", bundle=get_app_bundle(), id=id)
