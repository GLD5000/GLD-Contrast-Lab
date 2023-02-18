import markdownParserFull from '../utilities/markdown/markdownParser';
import { flagMap, wrapText } from '../utilities/markdown/ParserLookups';

function TextBox({ text }: { text: string }) {
  const returnArray = markdownParserFull({ text, indexIn: 0, flagMap, wrapText });
  return <div>{returnArray}</div>;
}
export default TextBox;
