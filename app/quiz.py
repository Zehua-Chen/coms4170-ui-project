from typing import Dict, TypedDict, List


class Quiz(TypedDict):
    id: int
    title: str
    notes: list
    positions_to_click: list


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

quizzes_overview = list(map(
    lambda pair: pair[1]["title"],
    # sort lessons by lesson id
    sorted(
        quizzes.items(), key=lambda x: x[0])))  # type: List[str]
