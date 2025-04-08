// '#';  black
// 'o';  white

import { ChainPositions, ChainPositionXY } from "./goban.chainPositions";
import { B, W, E, BoardChained, SquareChained, SquareStart, } from "./goban.createChains";
import { ExcludePositions } from "./goban.excludePositions";

interface PropsRemoveChain {
  intRow: number;
  intCol: number;
  square: SquareChained;
  intLastRow: number;
  intLastCol: number;
}

export class ChainExclusions {
  chainStart: ChainPositions;
  chainExclude: ExcludePositions;
  #board: BoardChained = [];
  #isNewExclude: boolean = false;
  constructor(board: BoardChained = [], chainStart: ChainPositions, chainExclude: ExcludePositions) {
    this.#board = board;
    this.chainStart = chainStart;
    this.chainExclude = chainExclude;
    this.updateExclusions();
  }
  getExclude() {
    return {
      exclude: this.chainExclude,
      isNewExclude: this.#isNewExclude
    }
  } 
  private getRestoreBRColour(
    square: SquareChained,
    b: SquareChained,
    r: SquareChained,
  ): boolean {
    const isRestoreWhite =
      square === B && (b === 'o' || b === '.' || r === 'o' || r === '.');
    const isRestoreBlack =
      square === W && (b === '#' || b === '.' || r === '#' || r === '.');

    return isRestoreWhite || isRestoreBlack;
  }
  private restoreColour({
    intRow,
    intCol,
    square,
    intLastRow,
    intLastCol,
  }: PropsRemoveChain) {
    const b =
      intRow === intLastRow ? E : this.#board[intRow + 1][intCol];
    const r =
      intCol === intLastCol ? E : this.#board[intRow][intCol + 1];
    const restoreColour = this.getRestoreBRColour(square as SquareStart, b, r);
    return restoreColour;
  }

  private reverseGetRestoreColour() {
    const intLastRow = this.#board.length - 1;
    const intLastCol = this.#board[0].length - 1;

    for (let intRow = intLastRow; intRow >= 0; intRow--) {
      const row = this.#board[intRow];
      for (let intCol = intLastCol; intCol >= 0; intCol--) {
        const square = row[intCol];
        const isSquareAChain = square === B || square === W;
        if (!isSquareAChain) continue;
        const restoreColour = this.restoreColour({
          intRow,
          intCol,
          square,
          intLastRow,
          intLastCol,
        });
        if (restoreColour) {
          return { restoreColour, intCol, intRow };
        }
      }
    }
    return { restoreColour: false, intCol: -1, intRow: -1 };
  }
  private updateExclusions() {
    const { restoreColour, intRow, intCol } = this.reverseGetRestoreColour();
    const { row, col } = this.chainStart.get(intRow, intCol) as ChainPositionXY;
    if (restoreColour && !this.chainExclude.get(row, col)) {
      this.chainExclude.set(row, col, true);
      this.#isNewExclude = true;
    }
  }
}
