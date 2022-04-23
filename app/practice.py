from os import path
from typing import TypedDict, Dict, List

from flask import Blueprint, current_app
from .view import render_template


class Practice(TypedDict):
    id: int
    title: str
    positions_to_click: List[int]


practices = {
    1: {
        "id": 1,
        "title": "1",
        "positions_to_click": [1, 2, 3]
    }
}  # type: Dict[int, Practice]


practices_overview = list(map(
    lambda pair: pair[1]["title"],
    # sort lessons by lesson id
    sorted(
        practices.items(), key=lambda x: x[0])))  # type: List[str]

blueprint = Blueprint("practice", __name__)


@blueprint.route("/practice/clip/<int:id>")
def practice_clip(id):
    clip_path = path.join("practice", f"practice{id}.mp3")

    response = current_app.send_static_file(clip_path)
    response.mimetype = "audio/mp3"

    return response


@blueprint.route("/practice/<int:id>")
def practice(id: int):
    return render_template(
        "practice.html",
        practices_overview=practices_overview,
        practice=practices[id])
