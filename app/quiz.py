from typing import Dict, TypedDict, List

from flask import Blueprint, request
from .view import render_template


class Quiz(TypedDict):
    id: int
    title: str
    notes: list
    positions_to_click: list


class QuizSolution(TypedDict):
    id: int
    solution: list


quizzes = {
    1: {
        "id": 1,
        "title": "quiz1",
        "notes": [],
        "positions_to_click": []
    },
    2: {
        "id": 2,
        "title": "quiz2",
        "notes": [],
        "positions_to_click": []
    },
    3: {
        "id": 3,
        "title": "quiz3",
        "notes": [],
        "positions_to_click": []
    },
    4: {
        "id": 4,
        "title": "quiz4",
        "notes": [],
        "positions_to_click": []
    },
    5: {
        "id": 5,
        "title": "quiz5",
        "notes": [],
        "positions_to_click": []
    },
    6: {
        "id": 6,
        "title": "quiz6",
        "notes": [],
        "positions_to_click": []
    }
}  # type: Dict[int, Quiz]

quiz_solutions = {
    1: {
        "id": 1,
        "solution": []
    },
    2: {
        "id": 2,
        "solution": []
    },
    3: {
        "id": 3,
        "solution": []
    },
    4: {
        "id": 4,
        "solution": []
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
