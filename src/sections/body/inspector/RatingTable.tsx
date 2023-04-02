import ExclamationSvg from '../../../icons/ExclamationSvg';
import TickSvg from '../../../icons/TickSvg';

// const content: { [key: string]: string[] } = {
//   header: ['Decorative', 'Non-Text', 'Large Text', 'Small Text'],
//   Poor: ['Pass', 'Fail', 'Fail', 'Fail'],
//   Low: ['Pass', 'Pass', 'Pass', 'Fail'],
//   AA: ['Pass', 'Pass', 'Pass', 'Pass'],
//   AAA: ['Pass', 'Pass', 'Pass', 'Pass'],
//   'AA+': ['Pass', 'Pass', 'Pass', 'Pass'],
//   'AAA+': ['Pass', 'Pass', 'Pass', 'Pass'],
// };
const content: { [key: string]: string[] } = {
  header: ['Non-Text', 'Large Text', 'Small Text'],
  Poor: ['Fail', 'Fail', 'Fail'],
  Low: ['Pass', 'Pass', 'Fail'],
  AA: ['Pass', 'Pass', 'Pass'],
  AAA: ['Pass', 'Pass', 'Pass'],
  'AA+': ['Pass', 'Pass', 'Pass'],
  'AAA+': ['Pass', 'Pass', 'Pass'],
};

function getCells(textArray: string[]) {
  return textArray.map((text, i) => {
    const key = `${text}${i}`;
    const svg = (
      <div className="mx-auto aspect-square h-6 text-inherit">
        {text === 'Pass' ? <TickSvg classes="stroke-1 stroke-current" /> : <ExclamationSvg />}
      </div>
    );
    return (
      <td key={key} className="border-collapse border-none p-1 px-4 text-center">
        {text !== 'Pass' && text !== 'Fail' ? null : svg}
        {text}
      </td>
    );
  });
}

export default function RatingTable({ ratingString }: { ratingString: string }) {
  const header = <tr key="rating-row">{getCells(content.header)}</tr>;
  const row = <tr key="rating-row">{getCells(content[ratingString])}</tr>;
  return (
    <table className="border-collapse rounded-none border-none bg-transparent p-2 text-center text-xs text-inherit">
      <thead>{header}</thead>
      <tbody>{row}</tbody>
    </table>
  );
}
