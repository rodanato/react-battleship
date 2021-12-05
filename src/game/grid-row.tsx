import React from 'react';
import GridColumn from './grid-column';

interface RowProps {
  row: string,
  columns: number[],
  shotAction: Function,
  sinkedPositions: string[],
  hits: string[],
  missedShots: string[]
}

function GridRow({
  row,
  columns,
  shotAction,
  sinkedPositions,
  hits,
  missedShots
}: RowProps) {
  const formattedColumns = columns
    .map((column: number, i: number) =>
      <GridColumn column={column}
        row={row}
        key={i}
        shotAction={shotAction}
        sinkedPositions={sinkedPositions}
        hits={hits}
        missedShots={missedShots}
      />
    );

  return (
    <tr>
      {formattedColumns}
    </tr>
  );
};

export default GridRow;