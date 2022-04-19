from typing import TypedDict, Dict, List


class Practice(TypedDict):
    id: int
    positions_to_click: List[int]


practices_overview = [
    "1",
    "2",
    "3"
]  # type: List[str]


practices = {
    1: {
        "id": 1,
        "positions_to_click": [1, 2, 3]
    }
}  # type: Dict[int, Practice]
