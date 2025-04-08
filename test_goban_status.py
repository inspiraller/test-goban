from goban import Goban, Status

def test_status_out_of_range() -> None:
    goban = Goban([
        '.#.',
        '#o#',
        '.#.'
    ])
    assert goban.get_status(-1, 9999999) == Status.OUT

def test_status_first_corner_empty() -> None:
    goban = Goban([
        '.#.',
        '#o#',
        '.#.'
    ])
    assert goban.get_status(0, 0) == Status.EMPTY

def test_status_second_item_is_black() -> None:
    goban = Goban([
        '.#.',
        '#o#',
        '.#.'
    ])
    assert goban.get_status(1, 0) == Status.BLACK

def test_status_middle_item_is_white() -> None:
    goban = Goban([
        '.#.',
        '#o#',
        '.#.'
    ])
    assert goban.get_status(1, 1) == Status.WHITE
