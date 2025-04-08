from goban import Goban

def test1_should_capture_center_square_with_black_chain_marker_8():
    goban = Goban([
        '.#.', 
        '#o#', 
        '.#.'
    ])
    assert goban.get_chained_board() == [
        '.#.', 
        '#8#', 
        '.#.'
    ]

def test2_should_not_capture_center_square_if_free_space_at_top():
    goban = Goban([
        '...', 
        '#o#', 
        '.#.'
    ])
    assert goban.get_chained_board() == [
        '...', 
        '#o#', 
        '.#.'
    ]

def test3_should_capture_black_at_edge_with_white_chain_marker_3():
    goban = Goban([
        'oo.',
        '##o',
        'o#o',  
        '.o.',
    ])
    assert goban.get_chained_board() == [
        'oo.',
        '33o',
        'o3o',  
        '.o.',
    ]

def test4_should_not_capture_black_at_edge_if_free_space_at_right():
    goban = Goban([
        'oo.',
        '##.',
        'o#o',  
        '.o.',
    ])
    assert goban.get_chained_board() == [
        'oo.',
        '##.',
        'o#o',  
        '.o.',
    ]

def test5_should_capture_black_at_edge_when_surrounded_with_white_with_white_chain_marker_3():
    goban = Goban([
        'oo.',
        '##o',
        '##o',  
        'oo.',
    ])
    assert goban.get_chained_board() == [
        'oo.',
        '33o',
        '33o',  
        'oo.',
    ]

def test6_should_capture_larger_area_with_chain_marker_8():
    goban = Goban([
        '.###.', 
        '#ooo#', 
        '.#oo#', 
        '.#oo#', 
        '..##.'
    ])
    assert goban.get_chained_board() == [
        '.###.', 
        '#888#', 
        '.#88#', 
        '.#88#', 
        '..##.'
    ]

def test7_should_not_capture_larger_area_with_chain_marker_8_if_space_at_bottom():
    goban = Goban([
        '.###.', 
        '#ooo#', 
        '.#oo#', 
        '.#oo#', 
        '..#..'
    ])
    assert goban.get_chained_board() == [
        '.###.', 
        '#ooo#', 
        '.#oo#', 
        '.#oo#', 
        '..#..'
    ]

def test8_should_not_capture_long_vertical_if_space_at_top():
    goban = Goban([
        'oo.', 
        '##.', 
        'o#o',
        'o#o',
        '.o.'
    ])
    assert goban.get_chained_board() == [
        'oo.', 
        '##.', 
        'o#o',
        'o#o',
        '.o.'
    ]

def test9_should_not_capture_long_vertical_if_space_at_middle():
    goban = Goban([
        'oo.', 
        '##o', 
        'o#.',
        'o#o',
        '.o.'
    ])
    assert goban.get_chained_board() == [
        'oo.', 
        '##o', 
        'o#.',
        'o#o',
        '.o.'
    ]

def test10_should_not_capture_long_vertical_if_space_at_bottom():
    goban = Goban([
        'oo.', 
        '##o', 
        'o#o',
        'o#o',
        '...'
    ])
    assert goban.get_chained_board() == [
        'oo.', 
        '##o', 
        'o#o',
        'o#o',
        '...'
    ]

def test11_should_not_capture_long_horizontal_if_space_at_beginning():
    goban = Goban([
        '.ooo.', 
        '.###o', 
        '.ooo.'
    ])
    assert goban.get_chained_board() == [
        '.ooo.', 
        '.###o', 
        '.ooo.'
    ]

def test12_should_not_capture_long_horizontal_if_space_at_end():
    goban = Goban([
        '.ooo.', 
        'o###.', 
        '.ooo.'
    ])
    assert goban.get_chained_board() == [
        '.ooo.', 
        'o###.', 
        '.ooo.'
    ]

def test13_should_capture_at_end_even_if_first_block_not_captured():
    goban = Goban([
        '.ooo..o.', 
        'o###.o#o', 
        '.ooo..o.'
    ])
    assert goban.get_chained_board() == [
        '.ooo..o.', 
        'o###.o3o', 
        '.ooo..o.'
    ]

def test14_should_capture_at_bottom_even_if_first_block_not_captured():
    goban = Goban([
        '.ooo.', 
        '#.#oo',
        'o#ooo', 
        '#....'
    ])
    assert goban.get_chained_board() == [
        '.ooo.', 
        '#.#oo',
        '8#ooo', 
        '#....'
    ]

def test15_white_surrounds_black_from_outside_and_inside():
    goban = Goban([
        '.ooooo.', 
        'o#####o',
        'o##o##o', 
        'o#####o',
        '.ooooo.'
    ])
    assert goban.get_chained_board() == [
        '.ooooo.', 
        'o33333o',
        'o33o33o', 
        'o33333o',
        '.ooooo.'
    ]

def test16_black_surrounds_white_surrounds_black_from_outside_and_inside():
    goban = Goban([
        '.#######.', 
        '#ooooooo#', 
        '#o#####o#',
        '#o##o##o#', 
        '#o#####o#',
        '#ooooooo#', 
        '.#######.'
    ])
    assert goban.get_chained_board() == [
        '.#######.', 
        '#8888888#', 
        '#8#####8#',
        '#8##8##8#', 
        '#8#####8#',
        '#8888888#',
        '.#######.'
    ]

def test17_black_surrounds_white_surrounds_black_from_outside_and_inside_with_eye():
    goban = Goban([
        '.#######.', 
        '#ooooooo#', 
        '#o#####o#',
        '#o##.##o#', 
        '#o#####o#',
        '#ooooooo#', 
        '.#######.'
    ])
    assert goban.get_chained_board() == [
        '.#######.', 
        '#8888888#', 
        '#8#####8#',
        '#8##.##8#', 
        '#8#####8#',
        '#8888888#', 
        '.#######.'
    ]

def test18_white_surrounds_black_from_outside_and_inside_and_has_freedom_from_surrounding_black():
    goban = Goban([
        '.#######.', 
        '#ooooooo#', 
        '#o#####o#',
        '#o##o##o#', 
        '#o#####o#',
        '#ooooooo#', 
        '.###.###.'
    ])
    assert goban.get_chained_board() == [
        '.#######.', 
        '#ooooooo#', 
        '#o33333o#',
        '#o33o33o#', 
        '#o33333o#',
        '#ooooooo#', 
        '.###.###.'
    ]
