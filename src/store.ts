import { writable } from 'svelte/store';

export type Square = {
  id: string;
  x: number;
  y: number;
  sideLength: number;
  rotation: number;
};

type Id = string;

function createSquares() {
  const { subscribe, set, update } = writable<Record<Id, Square>>({});

  function create(numberOfSquares: number, sideLength: number) {
    const squaresPerRow = Math.round(Math.sqrt(numberOfSquares));
    const distance = sideLength * 1.75;
    const newSquares: Record<Id, Square> = {};
    for (let n = 1; n <= numberOfSquares; n++) {
      const row = Math.ceil(n / squaresPerRow);
      const colum = n - (row - 1) * squaresPerRow;
      const x = distance * colum;
      const y = distance * row;
      const square: Square = {
        id: n.toString(),
        x,
        y,
        sideLength: sideLength,
        rotation: 0,
      };
      newSquares[square.id] = square;
    }
    set(newSquares);
  }

  function rotate(numberSpinning: number) {
    update(squares => {
      const nextSquares: Record<Id, Square> = { ...squares };
      let n = 0;
      for (let squareId in nextSquares) {
        if (n >= numberSpinning) {
          break;
        }
        let square = nextSquares[squareId];
        nextSquares[squareId] = { ...square, rotation: square.rotation + 1 };
        n += 1;
      }

      return nextSquares;
    });
  }

  return {
    subscribe,
    create,
    rotate,
    reset: () => set({}),
  };
}

export const squares = createSquares();
