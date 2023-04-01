import ExclamationSvg from '../../../icons/ExclamationSvg';
import TickSvg from '../../../icons/TickSvg';

const content: { [key: string]: string[] } = {
  header: ['Decorative', 'Non-Text', 'Large Text', 'Small Text'],
  Poor: ['Pass', 'Fail', 'Fail', 'Fail'],
  Low: ['Pass', 'Pass', 'Pass', 'Fail'],
  AA: ['Pass', 'Pass', 'Pass', 'Pass'],
  AAA: ['Pass', 'Pass', 'Pass', 'Pass'],
  'AA+': ['Pass', 'Pass', 'Pass', 'Pass'],
  'AAA+': ['Pass', 'Pass', 'Pass', 'Pass'],
};

function getCells(textArray: string[]) {
  return textArray.map((text, i) => {
    const key = `${text}${i}`;
    const svg = (
      <div className="mx-auto aspect-square h-6 text-red-600">
        {text === 'Pass' ? <TickSvg classes="stroke-1 stroke-green-600" /> : <ExclamationSvg />}
      </div>
    );
    return (
      <td key={key} className="border-collapse border-none border-neutral-400 p-1 px-4 text-center">
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
    <table className="border-collapse rounded-none border-none p-2 text-center dark:border-neutral-400 dark:text-neutral-200">
      <thead className=" text-sm dark:bg-neutral-600">{header}</thead>
      <tbody className=" text-xs dark:bg-neutral-900">{row}</tbody>
    </table>
  );
}
