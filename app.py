from os import path
from flask import Flask, render_template, json, url_for


app = Flask(__name__, template_folder="templates")


@app.template_filter("find_js_file")
def find_js_file(filename: str):
    with open(path.join("static", "manifest.json")) as manifest_file:
        manifest = json.load(manifest_file)

    return url_for("static", filename=manifest[filename]["file"])


@app.route("/")
def index():
    return render_template("index.html")
