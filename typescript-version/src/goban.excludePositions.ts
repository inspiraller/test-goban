
export interface ExcludePos {
  [key: string]: {
    [key: string]: boolean;
  };
}

export class ExcludePositions {
  public positions: ExcludePos = {};
  constructor() {
    this.positions = {};
  }
  set(y: number, x: number, value: boolean) {
    if (!this.positions[y]) {
      this.positions[y] = {};
    }
    this.positions[y][x] = value;
  }
  get(y: number, x: number) {
    return this.positions[y]?.[x] ?? false;
  }
}