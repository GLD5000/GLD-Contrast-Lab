import { recursiveParser } from '../utilities/markdown/markdownParser';
import { getFlagMap, wrapText } from '../utilities/markdown/ParserLookupsBasic';

let index = 0;
const flagMap = getFlagMap(['h6', 'h5', 'h4', 'h3', 'h2', 'h1', 'link', 'bold', 'italic']);
function parseLinks(cell: string) {
  if (!cell.includes('www') && !cell.includes('**') && !cell.includes('_') && !cell.includes('#')) return cell;

  index += 1;

  return recursiveParser({ text: cell, indexIn: index, flagMap, wrapText });
}

function Td({ cell }: { cell: string }) {
  const returnedContent = parseLinks(cell);
  return <td className="border-collapse border-2 border-neutral-400 p-1 text-center">{returnedContent}</td>;
}

export default Td;
