import { writable } from 'svelte/store';

export type Square = {
  id: string;
  x: number;
  y: number;
  sideLength: number;
  rotation: number;
  isSelected: boolean;
};

function createSquares() {
  const { subscribe, set, update } = writable<Square[]>([]);

  function create(numberOfSquares: number, sideLength: number) {
    const squaresPerRow = Math.round(Math.sqrt(numberOfSquares));
    const distance = sideLength * 1.75;
    const newSquares: Square[] = [];
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
        isSelected: false,
      };
      newSquares.push(square);
    }
    set(newSquares);
  }

  function rotate(numberSpinning: number) {
    update(squares =>
      squares.map((square, n) => {
        if (n < numberSpinning) {
          square = { ...square, rotation: square.rotation + 1 };
        }
        return square;
      })
    );
  }

  function select(squareId: string) {
    update(squares =>
      squares.map(square => {
        if (square.id === squareId) {
          square = { ...square, isSelected: !square.isSelected };
        }
        return square;
      })
    );
  }

  function deselectAll() {
    update(squares =>
      squares.map(square => {
        square = { ...square, isSelected: false };
        return square;
      })
    );
  }

  function translate(deltaX: number, deltaY: number) {
    update(squares =>
      squares.map(square => {
        if (square.isSelected === true) {
          square = {
            ...square,
            x: square.x + deltaX,
            y: square.y - deltaY,
          };
        }
        return square;
      })
    );
  }

  return {
    subscribe,
    create,
    rotate,
    select,
    deselectAll,
    translate,
    reset: () => set([]),
  };
}

export const squares = createSquares();
