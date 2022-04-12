from os import path
from flask import Flask, render_template, json


app = Flask(__name__, template_folder="templates")


@app.route("/")
def index():
    with open(path.join("static", "manifest.json")) as manifest_file:
        manifest = json.load(manifest_file)

    return render_template("index.html", manifest=manifest)
