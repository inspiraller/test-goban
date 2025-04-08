type BW = typeof B | typeof W;
type Liberty = '.';
type Stone = '#' | 'o';

type SquareStart = Stone | Liberty;
type SquareChain = SquareStart | BW;

type RowColumn = [number, number];
type BoardStart = SquareStart[][];
type BoardChain = SquareChain[][];

interface ColourGroups {
  hasLiberty: boolean;
  rows: RowColumn[];
  colour: Stone;
}

const B = '8';
const W = '3';

enum Status {
  WHITE = 1,
  BLACK = 2,
  EMPTY = 3,
  OUT = 4,
}

const getNeighbors = (
  [row, col]: RowColumn,
  board: BoardStart,
): RowColumn[] => {
  const movePositions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  const rowLen = board.length;
  const colLen = board[0].length;
  return movePositions.reduce((acc, cur) => {
    const [moveRow, moveCol] = cur;
    const newPosition = [row + moveRow, col + moveCol] as RowColumn;
    const [newRow, newCol] = newPosition;
    if (newRow >= 0 && newCol >= 0 && newRow < rowLen && newCol < colLen) {
      acc.push(newPosition);
    }
    return acc;
  }, [] as RowColumn[]);
};

interface PropsGetKilledStones {
  board: BoardStart;
  rows: RowColumn[];
  colourGroups: ColourGroups;
  colour: SquareChain;
}

interface PropsGetExpandedNeighbours {
  board: BoardStart;
  row: number;
  col: number;
  colour: SquareChain;
}
class ColourGroup {
  #visited = new Set<string>();
  #allColourGroups: ColourGroups[] = [];
  constructor(goban: string[]) {
    const board = goban.map((row) => row.split('')) as BoardStart;
    this.mutateAllColourGroups(board);
  }
  getAllColourGroups() {
    return this.#allColourGroups;
  }
  getExpandedNeighbours({
    board,
    row,
    col,
    colour,
  }: PropsGetExpandedNeighbours): {
    friendNeighbours: RowColumn[];
    neighbours: RowColumn[];
    enemyNeighbours: RowColumn[];
    hasLiberty: boolean;
  } {
    const visited = this.#visited;
    const friendNeighbours: RowColumn[] = [];
    const enemyNeighbours: RowColumn[] = [];
    let hasLiberty = false;

    const neighbours = getNeighbors([row, col], board);
    neighbours.forEach((item) => {
      const [nRow, nCol] = item;
      const neighbour = board[nRow][nCol];
      if (neighbour !== '.' && neighbour !== colour) {
        enemyNeighbours.push([nRow, nCol]);
      }
      if (neighbour === '.') {
        hasLiberty = true;
      } else if (neighbour === colour && !visited.has(`${nRow},${nCol}`)) {
        friendNeighbours.push([nRow, nCol]);
      }
    });
    return { friendNeighbours, neighbours, hasLiberty, enemyNeighbours };
  }
  getGroupsFromNeighbours({
    board,
    rows,
    colourGroups,
    colour,
  }: PropsGetKilledStones): ColourGroups {
    const visited = this.#visited;
    for (const [row, col] of rows) {
      const key = `${row},${col}`;
      if (visited.has(key)) continue;
      visited.add(key);
      // add first colour to colourGroup
      colourGroups.rows.push([row, col]);
      let { friendNeighbours, hasLiberty, enemyNeighbours } =
        this.getExpandedNeighbours({
          board,
          row,
          col,
          colour,
        });

      if (!hasLiberty) {
        const isNeighbourCaptured = enemyNeighbours.some(([nRow, nCol]) => {
          return this.#allColourGroups.some((item) => {
            return (
              !item.hasLiberty &&
              item.rows.some(([aRow2, aCol2]) => {
                return nRow === aRow2 && nCol === aCol2;
              })
            );
          });
        });

        if (isNeighbourCaptured) {
          hasLiberty = true;
          // This could be the inside of a surrounding enemy
          // But that enemy is surrounded by this colour, so we make this as NOT captured
        }
      }

      if (hasLiberty) {
        colourGroups.hasLiberty = true;
      }
      if (friendNeighbours.length) {
        // recurse until all friend neighbours are visited, or we reach the edge.
        return this.getGroupsFromNeighbours({
          board,
          rows: friendNeighbours,
          colourGroups,
          colour,
        });
      }
    }
    return colourGroups;
  }
  getGroupAndLiberties(
    board: BoardStart,
    rows: RowColumn[],
  ): ColourGroups | undefined {
    const [row, col] = rows[0];
    const colour = board[row][col];
    if (colour === '.') return undefined;
    const colourGroups: ColourGroups = {
      rows: [],
      hasLiberty: false,
      colour,
    };
    return this.getGroupsFromNeighbours({ board, rows, colour, colourGroups });
  }
  mutateAllColourGroups(board: BoardStart) {
    for (
      let row = 0, rowLen = board.length, colLen = board[0].length;
      row < rowLen;
      row++
    ) {
      for (let col = 0; col < colLen; col++) {
        const stone = board[row][col] as SquareStart;
        const key = `${row},${col}`;
        if ((stone === '#' || stone === 'o') && !this.#visited.has(key)) {
          const boardCoords = [[row, col]] as RowColumn[];
          const colourGroups = this.getGroupAndLiberties(board, boardCoords);
          if (colourGroups) {
            this.#allColourGroups.push(colourGroups);
          }
        }
      }
    }
  }
}

class ChainBoardStart {
  #goban: string[];
  #allColourGroups: ColourGroups[];
  constructor(goban: string[], allColourGroups: ColourGroups[]) {
    this.#goban = goban;
    this.#allColourGroups = allColourGroups;
  }
  getChainedBoard() {
    const oppositeEnemyChain = (colour: SquareChain) =>
      colour === '#' ? W : B;
    const board = this.#goban.map((row) => row.split('')) as BoardStart;
    return this.#allColourGroups.reduce((acc, cur) => {
      const { rows, colour, hasLiberty } = cur;
      if (!hasLiberty) {
        rows.forEach(([row, col]) => {
          acc[row][col] = oppositeEnemyChain(colour);
        });
      }
      return acc;
    }, board as BoardChain);
  }
}
class Goban {
  goban: string[];
  #allColourGroups: ColourGroups[];
  #boardChain: BoardChain;
  constructor(goban: string[]) {
    this.goban = goban;
    const colourGroup = new ColourGroup(this.goban);
    this.#allColourGroups = colourGroup.getAllColourGroups();
    const chainBoardStart = new ChainBoardStart(
      this.goban,
      this.#allColourGroups,
    );
    this.#boardChain = chainBoardStart.getChainedBoard();
  }
  getColourGroups() {
    return this.#allColourGroups;
  }
  getChainedBoard() {
    return this.#boardChain.map((row) => row.join(''));
  }
  is_taken(x: number, y: number) {
    const square = this.#boardChain[y][x];
    return square === B || square === W;
  }
  get_status(x: number, y: number): Status {
    if (
      !this.goban ||
      x < 0 ||
      y < 0 ||
      y >= this.goban.length ||
      x >= this.goban[0].length
    ) {
      return Status.OUT;
    } else if (this.goban[y][x] === '.') {
      return Status.EMPTY;
    } else if (this.goban[y][x] === 'o') {
      return Status.WHITE;
    } else if (this.goban[y][x] === '#') {
      return Status.BLACK;
    }
    throw new Error(`Unknown goban value ${this.goban[y][x]}`);
  }
}

export { Goban };
