class ChainPositionXY:
    def __init__(self, row, col):
        self.row = row
        self.col = col

class ChainPositions:
    def __init__(self):
        self.positions = {}
    
    def set(self, y, x, value):
        if y not in self.positions:
            self.positions[y] = {}
        
        # Create a new dictionary to avoid mutation
        self.positions[y][x] = ChainPositionXY(value.row, value.col)
    
    def get(self, y, x):
        if y in self.positions and x in self.positions[y]:
            return self.positions[y][x]
        return {}