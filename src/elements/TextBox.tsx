import markdownParserFull from '../utilities/markdownParser';
import { flagMap, wrapText } from '../utilities/ParserLookups';

function TextBox({ text }: { text: string }) {
  const returnArray = markdownParserFull({ text, indexIn: 0, flagMap, wrapText });
  return <div>{returnArray}</div>;
}
export default TextBox;
