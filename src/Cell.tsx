import { faBomb, faFlag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useState } from "react";

interface CellProps {
  row: number;
  col: number;
  isFlagged?: boolean;
  hasMine?: boolean;
  neighborMines?: number;
  isRevealed: boolean;
  onReveal: (row: number, col: number) => void;
  onFlag: (row: number, col: number) => void;
  isDisabled?: boolean;
}

export default function Cell({
  row,
  col,
  hasMine,
  isRevealed,
  onReveal,
  onFlag,
  neighborMines,
  isDisabled,
  isFlagged,
}: CellProps) {
  const [depressed, setDepressed] = useState(false);

  return (
    <div
      className={clsx(
        `
          flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center
          border-solid select-none
        `,
        {
          "border-2 border-t-gray-100 border-r-gray-500 border-b-gray-500 border-l-gray-100 bg-gray-300":
            !isRevealed && !depressed,
          "border-1 border-gray-500 bg-gray-400": isRevealed || depressed,
          "border-1 border-gray-500 bg-red-500": isRevealed && hasMine,
        }
      )}
      onMouseDown={(event) => {
        if (isDisabled || event.button !== 0) {
          return;
        }

        setDepressed(true);
      }}
      onMouseUp={(event) => {
        if (isDisabled || event.button !== 0) {
          return;
        }

        setDepressed(false);
      }}
      onMouseLeave={(event) => {
        if (isDisabled || event.button !== 0) {
          return;
        }

        setDepressed(false);
      }}
      onClickCapture={() => {
        if (!isDisabled && !isRevealed) {
          onReveal(row, col);
        }
      }}
      onContextMenuCapture={(event) => {
        event.preventDefault();

        if (isDisabled || isRevealed) {
          return;
        }

        onFlag(row, col);
      }}
    >
      {(isRevealed || isDisabled) && hasMine && (!isFlagged || isRevealed) && (
        <CellContentRevealedMine />
      )}
      {isRevealed && !hasMine && neighborMines != null && neighborMines > 0 && (
        <CellContentRevealedBlank neighborMines={neighborMines} />
      )}
      {isFlagged && !isRevealed && <CellContentFlag />}
    </div>
  );
}

function CellContentRevealedMine() {
  return <FontAwesomeIcon icon={faBomb} size="xl" />;
}

function CellContentFlag() {
  return <FontAwesomeIcon className="text-red-500" icon={faFlag} size="xl" />;
}

function CellContentRevealedBlank({
  neighborMines,
}: {
  neighborMines: number;
}) {
  const colors = [
    "text-blue-500",
    "text-green-600",
    "text-red-600",
    "text-blue-900",
    "text-amber-800",
    "text-cyan-500",
    "text-black",
    "text-gray-600",
  ];

  return (
    <span
      className={clsx(
        "h-full w-full text-center font-mono text-2xl leading-10 font-black",
        colors[neighborMines - 1]
      )}
    >
      {neighborMines.toString()}
    </span>
  );
}
