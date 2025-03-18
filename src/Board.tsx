import { ReactElement, useEffect, useMemo, useState } from "react";

import Cell from "./Cell";

interface BoardProps {
  height: number;
  width: number;
  difficulty: "easy" | "medium" | "hard";
}

function makeMines(
  initialClickRow: number,
  initialClickCol: number,
  {
    height,
    width,
    difficulty,
  }: Pick<BoardProps, "height" | "width" | "difficulty">
) {
  let mineRatio;
  switch (difficulty) {
    case "easy":
      mineRatio = 10 / 9 / 9;
      break;
    case "medium":
      mineRatio = 40 / 16 / 16;
      break;
    case "hard":
      mineRatio = 99 / 30 / 16;
      break;
  }

  const mineCount = Math.floor(height * width * mineRatio);
  const mines = new Set<string>();
  while (mines.size < mineCount) {
    const row = Math.floor(Math.random() * height);
    const col = Math.floor(Math.random() * width);
    const newMine = `${row.toString()},${col.toString()}`;
    if (
      !mines.has(newMine) &&
      (row !== initialClickRow || col !== initialClickCol)
    ) {
      mines.add(newMine);
    }
  }

  const mineMatrix = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => false)
  );

  for (const mine of mines) {
    const parts = mine.split(",");
    mineMatrix[parseInt(parts[0])][parseInt(parts[1])] = true;
  }

  return mineMatrix;
}

function countNeighborMines(
  row: number,
  col: number,
  height: number,
  width: number,
  mines: boolean[][]
): number {
  let count = 0;

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const newRow = row + dx;
      const newCol = col + dy;

      if (newRow < 0 || newRow >= height || newCol < 0 || newCol >= width) {
        continue;
      }

      if (mines[newRow][newCol]) {
        count++;
      }
    }
  }

  return count;
}

function reveal(
  row: number,
  col: number,
  height: number,
  width: number,
  revealed: boolean[][],
  mines: boolean[][]
) {
  if (row < 0 || row >= height || col < 0 || col >= width) {
    return;
  }

  if (revealed[row][col] || mines[row][col]) {
    return;
  }

  revealed[row][col] = true;

  if (countNeighborMines(row, col, height, width, mines) > 0) {
    return;
  }

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      reveal(row + dx, col + dy, height, width, revealed, mines);
    }
  }
}

export default function Board({ height, width, difficulty }: BoardProps) {
  const [initialClickPosition, setInitialClickPosition] = useState<
    number[] | undefined
  >();
  const [mines, setMines] = useState<boolean[][] | undefined>();
  const [revealed, setRevealed] = useState(
    Array.from({ length: height }, () =>
      Array.from({ length: width }, () => false)
    )
  );
  const [flags, setFlags] = useState(
    Array.from({ length: height }, () =>
      Array.from({ length: width }, () => false)
    )
  );

  useEffect(() => {
    if (initialClickPosition != null && mines === undefined) {
      const [initialClickRow, initialClickCol] = initialClickPosition;
      const newMines = makeMines(initialClickRow, initialClickCol, {
        height,
        width,
        difficulty,
      });

      setMines(newMines);

      const revealedClone = structuredClone(revealed);

      reveal(
        initialClickRow,
        initialClickCol,
        height,
        width,
        revealedClone,
        newMines
      );

      setRevealed(revealedClone);
    }
  }, [initialClickPosition, height, width, difficulty, revealed, mines]);

  const gameResult: "win" | "lose" | undefined = useMemo(() => {
    let unflaggedMines = 0;
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (mines?.[i][j]) {
          if (revealed[i][j]) {
            return "lose";
          }

          if (!flags[i][j]) {
            unflaggedMines++;
          }
        }
      }
    }

    if (mines != null && unflaggedMines === 0) {
      return "win";
    }
  }, [height, width, revealed, mines, flags]);

  const rows = new Array<ReactElement<typeof Cell>[]>(height);
  for (let i = 0; i < height; i++) {
    rows[i] = [];
    for (let j = 0; j < width; j++) {
      rows[i].push(
        <Cell
          key={`cell-${i.toString()}-${j.toString()}`}
          neighborMines={
            mines ? countNeighborMines(i, j, height, width, mines) : undefined
          }
          row={i}
          col={j}
          isRevealed={revealed[i][j]}
          isFlagged={flags[i][j]}
          hasMine={mines?.[i][j]}
          isDisabled={gameResult !== undefined}
          onReveal={(row, col) => {
            if (initialClickPosition == null) {
              setInitialClickPosition([row, col]);
            }

            if (mines?.[row][col]) {
              setRevealed([
                ...revealed.slice(0, row),
                [
                  ...revealed[row].slice(0, col),
                  true,
                  ...revealed[row].slice(col + 1),
                ],
                ...revealed.slice(row + 1),
              ]);
            } else if (mines != null) {
              const revealedClone = structuredClone(revealed);
              reveal(row, col, height, width, revealedClone, mines);
              setRevealed(revealedClone);
            }
          }}
          onFlag={(row, col) => {
            setFlags([
              ...flags.slice(0, row),
              [
                ...flags[row].slice(0, col),
                !flags[row][col],
                ...flags[row].slice(col + 1),
              ],
              ...flags.slice(row + 1),
            ]);
          }}
        />
      );
    }
  }

  return (
    <div className="flex">
      <div>
        {rows.map((row, i) => {
          return (
            <div className="flex" key={`row-${i.toString()}`}>
              {row}
            </div>
          );
        })}
      </div>
      {gameResult === "win" && <div>You win!</div>}
      {gameResult === "lose" && <div>You lose!</div>}
    </div>
  );
}
