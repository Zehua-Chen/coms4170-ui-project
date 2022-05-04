from os import path
from typing import Dict, Optional, List
from http.client import BAD_REQUEST, OK
from dataclasses import dataclass, replace

from flask import Blueprint, request, current_app
from .view import render_template
from .overview import OverviewItem


@dataclass
class QuizQuestion:
    id: int
    title: str
    subtitle: str
    notes: list
    positions_to_click: list
    weight: int
    """The score that this question contributes to the total score if it is
    answered correctly
    """
    submission: Optional[List[int]] = None


@dataclass
class QuizResult:
    id: int
    title: str
    subtitle: str
    submission: List[int]
    solution: List[int]
    earned: int
    weight: int


@dataclass
class QuizSolution:
    id: int
    solution: List[int]


quiz_questions = {
    1: QuizQuestion(
        id=1,
        title="Question 1",
        subtitle="Find the note <span class='fw-normal'>you hear</span>",
        notes=[],
        positions_to_click=[],
        weight=1),
    2: QuizQuestion(
        id=2,
        title="Question 2",
        subtitle="Play the two notes <span class='fw-normal'>you hear</span> in sequence",
        notes=[],
        positions_to_click=[],
        weight=1),
    3: QuizQuestion(
        id=3,
        title="Question 3",
        subtitle="Play the three notes <span class='fw-normal'>you hear</span> in sequence",
        notes=[],
        positions_to_click=[],
        weight=1),
    4: QuizQuestion(
        id=4,
        title="Question 4",
        subtitle="<span class='fw-normal'>Try to</span> replicate the clip",
        notes=[],
        positions_to_click=[],
        weight=2),
    5: QuizQuestion(
        id=5,
        title="Question 5",
        subtitle="<span class='fw-normal'>Try to</span> replicate the clip",
        notes=[],
        positions_to_click=[],
        weight=2),
    6: QuizQuestion(
        id=6,
        title="Question 6",
        subtitle="<span class='fw-normal'>Try to</span> replicate the clip",
        notes=[],
        positions_to_click=[],
        weight=3),
}  # type: Dict[int, QuizQuestion]

quiz_solutions = {
    1: QuizSolution(id=1, solution=[4]),
    2: QuizSolution(id=2, solution=[1, 2]),
    3: QuizSolution(id=3, solution=[3, 4, 5]),
    4: QuizSolution(id=4, solution=[3, 4, 3, 4, 5]),
    5: QuizSolution(id=5, solution=[5, 5, 4, 4, 3, 3, 2]),
    6: QuizSolution(id=6, solution=[2, 7, 6, 5, 2]),
}  # type: Dict[int, QuizSolution]

quizzes_overview = list(map(
    lambda pair: OverviewItem(pair[0], pair[1].title),
    # sort lessons by lesson id
    sorted(
        quiz_questions.items(), key=lambda x: x[0])))  # type: List[OverviewItem]

blueprint = Blueprint("quiz", __name__)


@blueprint.route("/quiz/<int:id>")
def quiz(id: int):
    return render_template(
        "quiz.html",
        question=quiz_questions[id],
        quizzes_overview=quizzes_overview)


@blueprint.route("/quiz/clip/<int:id>")
def quiz_clip(id: int):
    clip_path = path.join("quiz", f"quiz{id}.mp3")

    response = current_app.send_static_file(clip_path)
    response.mimetype = "audio/mp3"
    return response


@blueprint.route("/quiz/submit/<int:id>", methods=["POST"])
def quiz_submit(id: int):
    global quiz_submissions

    if request.json is None:
        return "", BAD_REQUEST

    submission = request.json  # type: dict
    question = quiz_questions[id]
    question = replace(question, submission=submission)

    quiz_questions[id] = question

    return "", OK


@blueprint.route("/quiz/finish")
def finish():
    global quiz_submissions
    global quiz_questions

    score = 0
    results = []  # type: List[QuizResult]
    unfinished_questions = []  # type: List[QuizQuestion]

    for question_id in quiz_questions:
        question = quiz_questions[question_id]
        submission = question.submission
        weight = question.weight

        solution = quiz_solutions[question_id].solution

        if submission is None:
            unfinished_questions.append(question)
            continue

        correct = 1 if submission == solution else 0
        score += correct * weight

        results.append(QuizResult(
            id=question.id,
            title=question.title,
            subtitle=question.subtitle,
            submission=submission,
            solution=solution,
            earned=correct * weight,
            weight=question.weight))

    if len(unfinished_questions) > 0:
        return render_template("not-finish.html", questions=unfinished_questions)

    results = sorted(results, key=lambda result: result.id)

    return render_template(
        "finish.html",
        score=score,
        total_score=10,
        results=results)
