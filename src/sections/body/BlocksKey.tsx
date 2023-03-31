import ExclamationSvg from '../../icons/ExclamationSvg';
import TickSvg from '../../icons/TickSvg';

const content = {
  header: ['Decorative', 'Non-Text', 'Large Text', 'Small Text'],
  Poor: ['<3', 'Pass', 'Fail', 'Fail', 'Fail'],
  Low: ['3+', 'Pass', 'Pass', 'Pass', 'Fail'],
  'AA+': ['4.5+', 'Pass', 'Pass', 'Pass', 'Pass'],
  'AAA+': ['7+', 'Pass', 'Pass', 'Pass', 'Pass'],
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
      <td key={key} className="border-collapse border-2 border-neutral-400 p-1 px-4 text-center">
        {text !== 'Pass' && text !== 'Fail' ? null : svg}
        {text}
      </td>
    );
  });
}

function getBodyRows() {
  return Object.entries(content)
    .slice(1)
    .map((entry, i) => {
      const key = entry[0];
      const row = entry[1];
      const id = `${i}row`;

      return <tr key={id}>{getCells([key, ...row])}</tr>;
    });
}

export default function BlocksKey() {
  const headerArray = getCells(['Rating', 'Ratio', ...content.header]);
  const bodyRows = getBodyRows();

  return (
    <section className=" my-3 grid h-fit w-full justify-center overflow-x-auto">
      <h2 className="mx-auto">Contrast Ratings for Elements</h2>
      <table className="border-collapse border-2 p-2 text-center dark:border-neutral-400 dark:text-neutral-200">
        <thead className=" text-sm dark:bg-neutral-600">
          <tr key="header">{headerArray}</tr>
        </thead>
        <tbody className=" text-xs dark:bg-neutral-900">{bodyRows}</tbody>
      </table>
    </section>
  );
}
