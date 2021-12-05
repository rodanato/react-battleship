import React from 'react';

interface ColumnProps {
  row: string,
  column: number,
  sinkedPositions: string[],
  hits: string[],
  missedShots: string[],
  shotAction: Function
}

function GridColumn({
  row,
  column,
  sinkedPositions,
  hits,
  missedShots,
  shotAction
}: ColumnProps) {
  const position = `${row},${column}`;

  const blockClass = () => {
    if (sinkedPositions.includes(position)) {
      return 'sinked';
    }
    if (hits.includes(position)) {
      return 'hit';
    }
    if (missedShots.includes(position)) {
      return 'missed';
    }

    return '';
  };

  return (
    <td onClick={() => shotAction(row, column)}
      className={blockClass()}></td>
  );
};

export default GridColumn;