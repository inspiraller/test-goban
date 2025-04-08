from enum import Enum
from typing import List, Tuple,  Union, Optional

# Type definitions
Stone = Union[str, str]  # '#' for black, 'o' for white
Liberty = str  # '.'
SquareStart = Union[Stone, Liberty]
SquareChain = Union[SquareStart, str]  # Adding B='8' and W='3' as possible values

RowColumn = Tuple[int, int]
BoardStart = List[List[SquareStart]]
BoardChain = List[List[SquareChain]]

B = '8'
W = '3'

class Status(Enum):
    WHITE = 1
    BLACK = 2
    EMPTY = 3
    OUT = 4

class ColourGroups:
    def __init__(self, rows: List[RowColumn] = None, has_liberty: bool = False, colour: Stone = None):
        self.rows = rows if rows is not None else []
        self.has_liberty = has_liberty
        self.colour = colour

def get_neighbors(position: RowColumn, board: BoardStart) -> List[RowColumn]:
    row, col = position
    move_positions = [(1, 0), (-1, 0), (0, 1), (0, -1)]
    row_len = len(board)
    col_len = len(board[0])
    
    neighbors = []
    for move_row, move_col in move_positions:
        new_row, new_col = row + move_row, col + move_col
        if 0 <= new_row < row_len and 0 <= new_col < col_len:
            neighbors.append((new_row, new_col))
    
    return neighbors

class ColourGroup:
    def __init__(self, goban: List[str]):
        self._visited = set()
        self._all_colour_groups = []
        board = [list(row) for row in goban]
        self.mutate_all_colour_groups(board)
    
    def get_all_colour_groups(self):
        return self._all_colour_groups
    
    def get_expanded_neighbours(self, board: BoardStart, row: int, col: int, colour: SquareChain):
        friend_neighbours = []
        enemy_neighbours = []
        has_liberty = False
        
        neighbours = get_neighbors((row, col), board)
        for n_row, n_col in neighbours:
            neighbour = board[n_row][n_col]
            if neighbour != '.' and neighbour != colour:
                enemy_neighbours.append((n_row, n_col))
            if neighbour == '.':
                has_liberty = True
            elif neighbour == colour and f"{n_row},{n_col}" not in self._visited:
                friend_neighbours.append((n_row, n_col))
        
        return {
            'friend_neighbours': friend_neighbours,
            'neighbours': neighbours,
            'enemy_neighbours': enemy_neighbours,
            'has_liberty': has_liberty
        }
    
    def get_groups_from_neighbours(self, board: BoardStart, rows: List[RowColumn], 
                                   colour_groups: ColourGroups, colour: SquareChain) -> ColourGroups:
        for row, col in rows:
            key = f"{row},{col}"
            if key in self._visited:
                continue
            
            self._visited.add(key)
            # add first colour to colour_group
            colour_groups.rows.append((row, col))
            
            expanded = self.get_expanded_neighbours(board, row, col, colour)
            friend_neighbours = expanded['friend_neighbours']
            has_liberty = expanded['has_liberty']
            enemy_neighbours = expanded['enemy_neighbours']
            
            if not has_liberty:
                is_neighbour_captured = False
                for n_row, n_col in enemy_neighbours:
                    for item in self._all_colour_groups:
                        if not item.has_liberty:
                            for a_row2, a_col2 in item.rows:
                                if n_row == a_row2 and n_col == a_col2:
                                    is_neighbour_captured = True
                                    break
                            if is_neighbour_captured:
                                break
                    if is_neighbour_captured:
                        break
                
                if is_neighbour_captured:
                    has_liberty = True
                    # This could be the inside of a surrounding enemy
                    # But that enemy is surrounded by this colour, so we make this as NOT captured
            
            if has_liberty:
                colour_groups.has_liberty = True
            
            if friend_neighbours:
                # recurse until all friend neighbours are visited, or we reach the edge
                return self.get_groups_from_neighbours(board, friend_neighbours, colour_groups, colour)
        
        return colour_groups
    
    def get_group_and_liberties(self, board: BoardStart, rows: List[RowColumn]) -> Optional[ColourGroups]:
        row, col = rows[0]
        colour = board[row][col]
        if colour == '.':
            return None
        
        colour_groups = ColourGroups(rows=[], has_liberty=False, colour=colour)
        return self.get_groups_from_neighbours(board, rows, colour_groups, colour)
    
    def mutate_all_colour_groups(self, board: BoardStart):
        row_len, col_len = len(board), len(board[0])
        for row in range(row_len):
            for col in range(col_len):
                stone = board[row][col]
                key = f"{row},{col}"
                if (stone == '#' or stone == 'o') and key not in self._visited:
                    board_coords = [(row, col)]
                    colour_groups = self.get_group_and_liberties(board, board_coords)
                    if colour_groups:
                        self._all_colour_groups.append(colour_groups)

class ChainBoardStart:
    def __init__(self, goban: List[str], all_colour_groups: List[ColourGroups]):
        self._goban = goban
        self._all_colour_groups = all_colour_groups
    
    def get_chained_board(self) -> BoardChain:
        def opposite_enemy_chain(colour: SquareChain) -> str:
            return W if colour == '#' else B
        
        board = [list(row) for row in self._goban]
        
        for group in self._all_colour_groups:
            rows, colour, has_liberty = group.rows, group.colour, group.has_liberty
            if not has_liberty:
                for row, col in rows:
                    board[row][col] = opposite_enemy_chain(colour)
        
        return board

class Goban:
    def __init__(self, goban: List[str]):
        self.goban = goban
        colour_group = ColourGroup(self.goban)
        self._all_colour_groups = colour_group.get_all_colour_groups()
        chain_board_start = ChainBoardStart(self.goban, self._all_colour_groups)
        self._board_chain = chain_board_start.get_chained_board()
    
    def get_colour_groups(self):
        return self._all_colour_groups
    
    def get_chained_board(self):
        return [''.join(row) for row in self._board_chain]
    
    def is_taken(self, x: int, y: int) -> bool:
        square = self._board_chain[y][x]
        return square == B or square == W
    
    def get_status(self, x: int, y: int) -> Status:
        if (not self.goban or x < 0 or y < 0 or 
                y >= len(self.goban) or x >= len(self.goban[0])):
            return Status.OUT
        elif self.goban[y][x] == '.':
            return Status.EMPTY
        elif self.goban[y][x] == 'o':
            return Status.WHITE
        elif self.goban[y][x] == '#':
            return Status.BLACK
        
        raise ValueError(f"Unknown goban value {self.goban[y][x]}")