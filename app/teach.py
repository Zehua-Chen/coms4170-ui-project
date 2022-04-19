from typing import Dict, TypedDict, List


class Lesson(TypedDict):
    id: int
    note: str
    position_to_click: int


lessons = {
    1: {
        "id": 1,
        "note": "Do",
        "position_to_click": 1
    },
    2: {
        "id": 2,
        "note": "Re",
        "position_to_click": 2
    },
    3: {
        "id": 3,
        "note": "Mi",
        "position_to_click": 3
    },
    4: {
        "id": 4,
        "note": "Fa",
        "position_to_click": 4
    },
    5: {
        "id": 5,
        "note": "So",
        "position_to_click": 5,
    },
    6: {
        "id": 6,
        "note": "La",
        "position_to_click": 6,
    },
    7: {
        "id": 7,
        "note": "Ti",
        "position_to_click": 7,
    }
}  # type: Dict[int, Lesson]

lessons_overview = list(map(
    lambda pair: pair[1]["note"],
    # sort lessons by lesson id
    sorted(
        lessons.items(), key=lambda x: x[0])))  # type: List[str]
