import { ReactElement } from 'react';
import Td from './Td';

function Tr({ row = [], rowIndex = 0 }): ReactElement {
  return (
    <tr>
      {row.map((cell, cellIndex) => {
        const key = `${rowIndex}${cellIndex}`;
        return <Td key={key} cell={cell} />;
      })}
    </tr>
  );
}

export default Tr;
