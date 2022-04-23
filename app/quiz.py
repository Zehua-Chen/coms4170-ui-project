from os import path
from typing import Dict, TypedDict, List

from flask import Blueprint, request, current_app
from .view import render_template


class Quiz(TypedDict):
    id: int
    title: str
    subtitle: str
    notes: list
    positions_to_click: list


class QuizSolution(TypedDict):
    id: int
    solution: list


quizzes = {
    1: {
        "id": 1,
        "title": "Question 1",
        "subtitle": "Find the note you hear",
        "notes": [],
        "positions_to_click": []
    },
    2: {
        "id": 2,
        "title": "Question 2",
        "subtitle": "Which two notes were played",
        "notes": [],
        "positions_to_click": []
    },
    3: {
        "id": 3,
        "title": "Question 3",
        "subtitle": "Play the three notes you hear in sequence",
        "notes": [],
        "positions_to_click": []
    },
    4: {
        "id": 4,
        "title": "quiz4",
        "subtitle": "Try to replicate the clip",
        "notes": [],
        "positions_to_click": []
    },
    5: {
        "id": 5,
        "title": "quiz5",
        "subtitle": "",
        "notes": [],
        "positions_to_click": []
    },
    6: {
        "id": 6,
        "title": "quiz6",
        "subtitle": "",
        "notes": [],
        "positions_to_click": []
    }
}  # type: Dict[int, Quiz]

quiz_solutions = {
    1: {
        "id": 1,
        "solution": [1]
    },
    2: {
        "id": 2,
        "solution": [1, 2]
    },
    3: {
        "id": 3,
        "solution": [3, 4, 5]
    },
    4: {
        "id": 4,
        "solution": [3,4,3,4,5,3,4,5]
    },
    5: {
        "id": 5,
        "solution": []
    },
    6: {
        "id": 6,
        "solution": []
    }
}  # type: Dict[int, QuizSolution]

quiz_score = 0

quizzes_overview = list(map(
    lambda pair: pair[1]["title"],
    # sort lessons by lesson id
    sorted(
        quizzes.items(), key=lambda x: x[0])))  # type: List[str]

blueprint = Blueprint("quiz", __name__)


@blueprint.route("/quiz/<int:id>")
def quiz(id: int):
    return render_template(
        "quiz.html",
        quiz=quizzes[id],
        quizzes_overview=quizzes_overview)


@blueprint.route("/quiz/clip/<int:id>")
def quiz_clip(id: int):
    clip_path = path.join("quiz", f"quiz{id}.mp3")

    response = current_app.send_static_file(clip_path)
    response.mimetype = "audio/mp3"

    return response


@blueprint.route("/quiz/submit/<int:id>", methods=["POST"])
def quiz_submit(id: int):
    global quiz_score
    _solution = request.json
    quiz_score += 1

    return "", 200


@blueprint.route("/quiz/finish")
def finish():
    global quiz_score
    return render_template("finish.html", score=quiz_score)
