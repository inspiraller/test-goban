from constants import B, W, E

class ChainExclusions:
    def __init__(self, board=None, chain_start=None, chain_exclude=None):
        self._board = board if board else []
        self.chain_start = chain_start
        self.chain_exclude = chain_exclude
        self._is_new_exclude = False
        self.update_exclusions()
    
    def get_exclude(self):
        return {
            "exclude": self.chain_exclude,
            "isNewExclude": self._is_new_exclude
        }
    
    def get_restore_br_colour(self, square, b, r):
        is_restore_white = square == B and (b == 'o' or b == '.' or r == 'o' or r == '.')
        is_restore_black = square == W and (b == '#' or b == '.' or r == '#' or r == '.')
        
        return is_restore_white or is_restore_black
    
    def restore_colour(self, int_row, int_col, square, int_last_row, int_last_col):
        b = E if int_row == int_last_row else self._board[int_row + 1][int_col]
        r = E if int_col == int_last_col else self._board[int_row][int_col + 1]
        restore_colour = self.get_restore_br_colour(square, b, r)
        return restore_colour
    
    def reverse_get_restore_colour(self):
        int_last_row = len(self._board) - 1
        int_last_col = len(self._board[0]) - 1
        
        for int_row in range(int_last_row, -1, -1):
            row = self._board[int_row]
            for int_col in range(int_last_col, -1, -1):
                square = row[int_col]
                is_square_a_chain = square == B or square == W
                
                if not is_square_a_chain:
                    continue
                    
                restore_colour = self.restore_colour(int_row, int_col, square, int_last_row, int_last_col)
                
                if restore_colour:
                    return {"restoreColour": restore_colour, "intCol": int_col, "intRow": int_row}
        
        return {"restoreColour": False, "intCol": -1, "intRow": -1}
    
    def update_exclusions(self):
        result = self.reverse_get_restore_colour()
        restore_colour = result["restoreColour"]
        int_row = result["intRow"]
        int_col = result["intCol"]
        
        if restore_colour and int_row >= 0 and int_col >= 0:
            position = self.chain_start.get(int_row, int_col)
            
            # Check if position is a valid ChainPositionXY with row and col attributes
            if hasattr(position, 'row') and hasattr(position, 'col'):
                row = position.row
                col = position.col
                
                if not self.chain_exclude.get(row, col):
                    self.chain_exclude.set(row, col, True)
                    self._is_new_exclude = True