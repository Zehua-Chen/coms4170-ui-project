from os import path
from flask import Flask, render_template, json, url_for


app = Flask(__name__, template_folder="templates")


def get_app_bundle():
    with open(path.join("static", "manifest.json")) as manifest_file:
        manifest = json.load(manifest_file)

    index = manifest["src/index.ts"]

    return {
        "js": url_for("static", filename=index["file"]),
        "css": map(lambda f: url_for("static", filename=f), index["css"])
    }


@app.route("/")
def index():
    return render_template("index.html", bundle=get_app_bundle())


@app.route("/learn/1")
def learn():
    return render_template("learn-1.html", bundle=get_app_bundle())
