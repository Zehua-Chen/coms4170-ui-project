from typing import Dict, TypedDict, List


class Lesson(TypedDict):
    id: int
    note: str
    audio: str


lessons = {
    1: {
        "id": 1,
        "note": "Do",
        "audio": "doAudio"
    },
    2: {
        "id": 2,
        "note": "Re",
        "audio": "reAudio"
    },
    3: {
        "id": 3,
        "note": "Mi",
        "audio": "miAudio"
    },
    4: {
        "id": 4,
        "note": "Fa",
        "audio": "faAudio"
    },
    5: {
        "id": 5,
        "note": "So",
        "audio": "soAudio"
    },
    6: {
        "id": 6,
        "note": "La",
        "audio": "laAudio"
    },
    7: {
        "id": 7,
        "note": "Ti",
        "audio": "tiAudio"
    }
}  # type: Dict[int, Lesson]

lessons_overview = list(map(
    lambda pair: pair[1]["note"],
    # sort lessons by lesson id
    sorted(
        lessons.items(), key=lambda x: x[0])))  # type: List[str]
