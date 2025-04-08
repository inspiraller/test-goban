import { ChainPositions } from "./goban.chainPositions";
import { ExcludePositions } from "./goban.excludePositions";

export const B = '8'; // black capture chain
export const W = '3'; // white capture chain
export const E = '!'; // edge

export type SquareStart = '.' | '#' | 'o';
type TChain = typeof B | typeof W;
export type SquareChained = SquareStart | TChain | typeof E;
export type BoardChained = Array<SquareChained[]>;

interface PropsAddChain {
  intRow: number;
  intCol: number;
  square: SquareStart;
}

export class CreateChains {
  goban: string[];
  #board: BoardChained = [];
  chainStart: ChainPositions;
  chainExclude: ExcludePositions;
  constructor(goban: string[], chainExclude: ExcludePositions) {
    this.goban = goban;
    this.#board = goban.map((str) => str.split('')) as BoardChained;
    this.chainStart = new ChainPositions();
    this.chainExclude = chainExclude;
    this.mutateAddChains();
  }
  getBoard() {
    return {
      board: this.#board,
      chainStart: this.chainStart
    }

  }
  private getChainByTLColour(
    t: SquareChained,
    l: SquareChained,
    col: '#' | 'o',
    lnk: TChain,
  ) {
    const isT = t === col || t === lnk;
    const isL = l === col || l === lnk;
    const isTL = ((isT || t === E) && isL) || ((isL || l === E) && isT);
    return isTL;
  }
  private getChainByTLCorner(
    square: SquareStart,
    t: SquareChained,
    l: SquareChained,
  ) {
    const isTLBlack = this.getChainByTLColour(t, l, '#', B);
    const isTLWhite = this.getChainByTLColour(t, l, 'o', W);
    const isSquareADifColour =
      (isTLBlack && square === 'o') || (isTLWhite && square === '#');

    if (isSquareADifColour && (isTLBlack || isTLWhite)) {
      return isTLBlack ? B : W;
    }
    return false;
  }
  private getRowChainEndsWithDot({ intRow, intCol, square }: PropsAddChain) {
    // If there is any dot on this row that follows this square chain, then this chain is not a capture
    // Example
    // .###
    // #ooo. (This row ends with a dot, so has an escape route)
    const strRowFrom = this.goban[intRow].slice(intCol);
    const indDot = strRowFrom.indexOf('.');
    const regNotSquare = RegExp(`[^${square}]`);
    const charOtherThanSquare = regNotSquare.test(
      strRowFrom.slice(0, indDot - 1),
    );
    const isColourEndsWithDot = indDot !== -1 && !charOtherThanSquare;
    return isColourEndsWithDot;
  }

  private addChain({ intRow, intCol, square }: PropsAddChain) {
    const row = this.#board[intRow];

    // if this square is 0, then the top or left position is an edge '!'
    const t = intRow === 0 ? E : this.#board[intRow - 1][intCol];
    const l = intCol === 0 ? E : this.#board[intRow][intCol - 1];
    const tlChain = this.getChainByTLCorner(square as SquareStart, t, l);

    if (tlChain) {
      if (this.getRowChainEndsWithDot({ intRow, intCol, square })) {
        return false;
      }
      row[intCol] = tlChain;
      return true;
    }
    return false;
  }

  // mutateAddChains()
  // This is the core functionality
  // It checks for the top left hand corner position of the square. 
  // If the t/l position is one of enemy and edge or both enemy, then we replace this square with a chain marker
  // We continue to proceed across the row comparing the t/l position is either enemy, chain marker or edge and if so replace this square with a chain marker
  // If there is a dot (empty space) at the end of this row, this is negated.
  // If the exclude array "chainExclude" provided is a match for the start position of this chain then this is negated
  // (Special usecase): We store the first position of the chain in the variable - chainStart
  // This is so that we can iterate back over the chain to remove this entire chain, if at the bottom of it there are freedoms.
  // Why? replace the squares in the first place with the chain marker? because we don't know the freedom position until the iteration gets to it.
  // this approach is thorough, and caters for scenarios where an outer layer may wrap an inner layer, wrapping another inner layer.
  // The intention of this method is to use markers and then remove them, like peeling an onion from the outer edge
  // The outer edge would be the winning capture chain provided there are no freedoms.
  private mutateAddChains() {
    let startChainCol: number;
    let startChainRow: number;

    const setStartChain = (col: number, row: number) => {
      startChainCol = col;
      startChainRow = row;
    };
    setStartChain(-1, -1);

    const mutateRow = (row: SquareChained[], intRow: number) => {
      for (let intCol = 0, intLen = row.length; intCol < intLen; ++intCol) {
        const square = row[intCol];
        const isSquareAColour = square === '#' || square === 'o';
        let isAddChain = false;
        if (isSquareAColour) {
          const isExludeStartPos = this.chainExclude.get(intRow, intCol);

          if (!isExludeStartPos) {
            isAddChain = this.addChain({ intRow, intCol, square });
          }
        }
        if (isAddChain) {
          if (startChainCol === -1 && startChainRow === -1) {
            setStartChain(intCol, intRow);
          }
          // All positions of this chain will be the start position. So we know to exclude it if at the end it has a freedom.

          this.chainStart.set(intRow, intCol, {
            row: startChainRow,
            col: startChainCol,
          });
        } else {
          setStartChain(-1, -1);
        }
      }
    };
    this.#board.forEach((row, ind) => {
      mutateRow(row, ind);
    });
  }
}

