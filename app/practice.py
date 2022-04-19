from typing import TypedDict, Dict, List


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
