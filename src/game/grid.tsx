import React from 'react';
import '../App.css';
import GridRow from './grid-row';

interface GridProps {
  rows: string[];
  columns: number[];
  sinkedPositions: string[];
  missedShots: string[];
  hits: string[];
  shotAction: Function;
}

const Grid = ({
  rows,
  columns,
  shotAction,
  sinkedPositions,
  hits,
  missedShots,
}: GridProps) => {
  const formattedRows = rows
    .map((row: string, i: number) =>
      <GridRow row={row}
        shotAction={shotAction}
        columns={columns}
        sinkedPositions={sinkedPositions}
        hits={hits}
        missedShots={missedShots}
        key={i}
      />
    );

  return (
    <div>
      <table className="table--numbers">
        <tbody>
          <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
            <td>5</td>
            <td>6</td>
            <td>7</td>
            <td>8</td>
            <td>9</td>
            <td>10</td>
          </tr>
        </tbody>
      </table>

      <table className="table--letters">
        <tbody>
          <tr>
            <td>A</td>
          </tr>
          <tr>
            <td>B</td>
          </tr>
          <tr>
            <td>C</td>
          </tr>
          <tr>
            <td>D</td>
          </tr>
          <tr>
            <td>E</td>
          </tr>
          <tr>
            <td>F</td>
          </tr>
          <tr>
            <td>G</td>
          </tr>
          <tr>
            <td>H</td>
          </tr>
          <tr>
            <td>I</td>
          </tr>
          <tr>
            <td>J</td>
          </tr>
        </tbody>
      </table>

      <table className={'grid table'}
             style={{"borderWidth":"1px", 'borderColor':"#aaaaaa", 'borderStyle':'solid'}}>
        <tbody>
          {formattedRows}
        </tbody>
      </table>
    </div>
  );
};

export default Grid;