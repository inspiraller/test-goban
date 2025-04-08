
from enum import Enum
from exclude_positions import ExcludePositions
from create_chains import CreateChains
from chain_exclusions import ChainExclusions                      
from constants import B, W

class Status(Enum):
    WHITE = 1
    BLACK = 2
    EMPTY = 3
    OUT = 4

class Goban:
    def __init__(self, goban):
        self.goban = goban
        self.chain_exclude = ExcludePositions()
        self.chain = self.get_chain()
    
    def get_chain(self):
        # This is the 2nd core functionality
        # The main core functionality is in createChains - mutate_add_chains
        # This will first create a chain of squares that surrouned enemies, from the outer edges
        # Then the ChainExclusions method will create an exclusion list for any freedoms it finds at the ends of these chains.
        # This method recurses between createChains and ChainExclusions until no more exclusions are found.
        
        # That exclusion list is then passed back into createChains to recreate the chain (this time, excluding that start position)
        # This ensures we continue to capture all outer layers, inner layers, adjacent layers that do not have freedoms
        
        chain = CreateChains(self.goban, self.chain_exclude)
        board_data = chain.get_board()
        board = board_data["board"]
        chain_start = board_data["chainStart"]
        
        chain_exclusions = ChainExclusions(board, chain_start, self.chain_exclude)
        exclude_data = chain_exclusions.get_exclude()
        exclude = exclude_data["exclude"]
        is_new_exclude = exclude_data["isNewExclude"]
        
        if is_new_exclude:
            self.chain_exclude = exclude
            return self.get_chain()
        
        return chain
    
    def get_chained_board(self):
        board_data = self.chain.get_board()
        board = board_data["board"]
        return [''.join(row) for row in board]
    
    def is_taken(self, x, y):
        board_data = self.chain.get_board()
        board = board_data["board"]
        
        if y < len(board) and x < len(board[y]):
            square = board[y][x]
            return square == B or square == W
        return False
    
    def get_status(self, x, y):
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