from constants import B, W, E
from chain_positions import ChainPositions, ChainPositionXY

class CreateChains:
    def __init__(self, goban, chain_exclude):
        self.goban = goban
        self._board = [list(row) for row in goban]
        self.chain_start = ChainPositions()
        self.chain_exclude = chain_exclude
        self.mutate_add_chains()
    
    def get_board(self):
        return {
            "board": self._board,
            "chainStart": self.chain_start
        }
    
    def get_chain_by_tl_colour(self, t, l, col, lnk):
        is_t = t == col or t == lnk
        is_l = l == col or l == lnk
        is_tl = ((is_t or t == E) and is_l) or ((is_l or l == E) and is_t)
        return is_tl
    
    def get_chain_by_tl_corner(self, square, t, l):
        is_tl_black = self.get_chain_by_tl_colour(t, l, '#', B)
        is_tl_white = self.get_chain_by_tl_colour(t, l, 'o', W)
        is_square_a_dif_colour = (is_tl_black and square == 'o') or (is_tl_white and square == '#')
        
        if is_square_a_dif_colour and (is_tl_black or is_tl_white):
            return B if is_tl_black else W
        return False
    
    def get_row_chain_ends_with_dot(self, int_row, int_col, square):
        # If there is any dot on this row that follows this square chain, then this chain is not a capture
        # Example
        # .###
        # #ooo. (This row ends with a dot, so has an escape route)
        str_row_from = self.goban[int_row][int_col:]
        ind_dot = str_row_from.find('.')
        
        if ind_dot == -1:
            return False
            
        # Check if there are only square characters before the dot
        slice_to_check = str_row_from[:ind_dot]
        not_square_chars = [c for c in slice_to_check if c != square]
        char_other_than_square = len(not_square_chars) > 0
        
        is_colour_ends_with_dot = ind_dot != -1 and not char_other_than_square
        return is_colour_ends_with_dot
    
    def add_chain(self, int_row, int_col, square):
        row = self._board[int_row]
        
        # if this square is 0, then the top or left position is an edge '!'
        t = E if int_row == 0 else self._board[int_row - 1][int_col]
        l = E if int_col == 0 else self._board[int_row][int_col - 1]
        tl_chain = self.get_chain_by_tl_corner(square, t, l)
        
        if tl_chain:
            if self.get_row_chain_ends_with_dot(int_row, int_col, square):
                return False
            row[int_col] = tl_chain
            return True
        return False
    
    def mutate_add_chains(self):
        start_chain_col = -1
        start_chain_row = -1
        
        def set_start_chain(col, row):
            nonlocal start_chain_col, start_chain_row
            start_chain_col = col
            start_chain_row = row
        
        def mutate_row(row, int_row):
            nonlocal start_chain_col, start_chain_row
            
            for int_col in range(len(row)):
                square = row[int_col]
                is_square_a_colour = square == '#' or square == 'o'
                is_add_chain = False
                
                if is_square_a_colour:
                    is_exclude_start_pos = self.chain_exclude.get(int_row, int_col)
                    
                    if not is_exclude_start_pos:
                        is_add_chain = self.add_chain(int_row, int_col, square)
                
                if is_add_chain:
                    if start_chain_col == -1 and start_chain_row == -1:
                        set_start_chain(int_col, int_row)
                    
                    # All positions of this chain will be the start position. 
                    # So we know to exclude it if at the end it has a freedom.
                    self.chain_start.set(int_row, int_col, ChainPositionXY(start_chain_row, start_chain_col))
                else:
                    set_start_chain(-1, -1)
        
        for ind, row in enumerate(self._board):
            mutate_row(row, ind)