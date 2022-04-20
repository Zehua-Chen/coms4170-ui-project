from os import path
from flask import json, url_for, render_template as flask_render_template


def _get_app_bundle():
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


def render_template(filename: str, **context) -> str:
    """A custom render_template that provide `bundle` context by default

    Args:
        filename (str): _description_

    Returns:
        str: _description_
    """
    return flask_render_template(filename, bundle=_get_app_bundle(), **context)
