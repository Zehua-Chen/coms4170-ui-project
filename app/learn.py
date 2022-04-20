from typing import Dict, TypedDict, List, Optional
from datetime import datetime

from flask import Blueprint
from .view import render_template


class Lesson(TypedDict):
    id: int
    note: str
    position_to_click: int
    last_visited: str


lessons = {
    1: {
        "id": 1,
        "note": "Do",
        "position_to_click": 1,
        "last_visited": ""
    },
    2: {
        "id": 2,
        "note": "Re",
        "position_to_click": 2,
        "last_visited": ""
    },
    3: {
        "id": 3,
        "note": "Mi",
        "position_to_click": 3,
        "last_visited": ""
    },
    4: {
        "id": 4,
        "note": "Fa",
        "position_to_click": 4,
        "last_visited": ""
    },
    5: {
        "id": 5,
        "note": "So",
        "position_to_click": 5,
        "last_visited": ""
    },
    6: {
        "id": 6,
        "note": "La",
        "position_to_click": 6,
        "last_visited": ""
    },
    7: {
        "id": 7,
        "note": "Ti",
        "position_to_click": 7,
        "last_visited": ""
    }
}  # type: Dict[int, Lesson]

lessons_overview = list(map(
    lambda pair: pair[1]["note"],
    # sort lessons by lesson id
    sorted(
        lessons.items(), key=lambda x: x[0])))  # type: List[str]

blueprint = Blueprint("learn", __name__)


@blueprint.route("/learn/<int:id>")
def learn(id: int):
    lesson = lessons[id]
    sent_lesson = lesson.copy()

    lesson["last_visited"] = str(datetime.now())

    return render_template(
        "learn.html",
        lessons_overview=lessons_overview,
        lesson=sent_lesson)
