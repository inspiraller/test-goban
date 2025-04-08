
export type ChainPositionXY = { row: number; col: number };
interface Positions {
  [key: string]: {
    [key: string]: ChainPositionXY;
  };
}

export class ChainPositions {
  private positions: Positions;
  constructor() {
    this.positions = {};
  }
  set(y: number, x: number, value: ChainPositionXY) {
    if (!this.positions[y]) {
      this.positions[y] = {};
    }
    const dontMutateValue = { ...value };
    this.positions[y][x] = dontMutateValue;
  }
  get(y: number, x: number) {
    return this.positions[y]?.[x] ?? {};
  }
}

