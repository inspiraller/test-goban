import { B, W, CreateChains } from "./goban.createChains";
import { ChainExclusions } from "./goban.chainExclusions";
import { ExcludePositions } from "./goban.excludePositions";

enum Status {
  WHITE = 1,
  BLACK = 2,
  EMPTY = 3,
  OUT = 4,
}

class Goban {
  goban: string[];
  chain: CreateChains;
  chainExclude: ExcludePositions;
  constructor(goban: string[]) {
    this.goban = goban;
    this.chainExclude = new ExcludePositions();
    this.chain = this.getChain();
  }
  getChain():CreateChains {

    // This is the 2nd core functionality
    // The main core functionality is in createChains - mutateAddChains
    // This will first create a chain of squares that surrouned enemies, from the outer edges
    // Then the ChainExclusions method will create an exclusion list for any freedoms it finds at the ends of these chains.
    // This method recurses between createChains and ChainExclusions until no more exclusions are found.
    
    // That exclusion list is then passed back into createChains to recreate the chain (this time, excluding that start position)
    // This ensures we continue to capture all outer layers, inner layers, adjacent layers that do not have freedoms

    const chain = new CreateChains(this.goban, this.chainExclude);
    const { board, chainStart } = chain.getBoard();
    const chainExclusions = new ChainExclusions(board, chainStart, this.chainExclude);
    const {exclude, isNewExclude} = chainExclusions.getExclude();
    if (isNewExclude) {
      this.chainExclude = exclude;
      return this.getChain();
    }
    return chain;
  }
  getChainedBoard() {
    const {board} = this.chain.getBoard();
    return board.map((row) => row.join(''));
  } 
  is_taken(x: number, y: number) {
    const {board} = this.chain.getBoard();
    const square = board[y]?.[x];
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
