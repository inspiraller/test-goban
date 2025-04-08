class ExcludePositions:
    def __init__(self):
        self.positions = {}
    
    def set(self, y, x, value):
        if y not in self.positions:
            self.positions[y] = {}
        self.positions[y][x] = value
    
    def get(self, y, x):
        if y in self.positions and x in self.positions[y]:
            return self.positions[y][x]
        return False