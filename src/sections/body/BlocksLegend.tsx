import { useColourBlocksContext } from '../../contexts/ColourBlocksProvider';

const content = {
  header: ['Non-Text', 'Large Text', 'Small Text'],
  Poor: ['<3', 'Decorative only', 'Fail', 'Fail'],
  Low: ['3+', 'AA+', 'AA+', 'Fail'],
  'AA+': ['4.5+', 'AA+', 'AAA+', 'AA+'],
  'AAA+': ['7+', 'AA+', 'AAA+', 'AAA+'],
};

function getCells(textArray: string[]) {
  return textArray.map((text, i) => {
    const key = `${text}${i}`;
    return (
      <td key={key} className="border-collapse border-2 border-neutral-400 p-1 px-4 text-center text-xs">
        {text}
      </td>
    );
  });
}

function getBodyRows(showRatioBoolean: boolean) {
  if (showRatioBoolean) {
    return Object.values(content)
      .slice(1)
      .map((row, i) => {
        const key = `${i}row`;
        return <tr key={key}>{getCells(row)}</tr>;
      });
  }

  return Object.entries(content)
    .slice(1)
    .map((entry, i) => {
      const key = entry[0];
      const row = entry[1];
      const id = `${i}row`;

      return <tr key={id}>{getCells([key, ...row.slice(1)])}</tr>;
    });
}

export default function BlocksLegend() {
  const { showRatio } = useColourBlocksContext();
  const headerArray = getCells([`${showRatio ? 'Ratio' : 'Rating'}`, ...content.header]);
  const bodyRows = getBodyRows(showRatio);

  return (
    <section className=" my-3 grid h-fit w-full justify-center overflow-x-auto">
      <h2 className="mx-auto">Legend</h2>
      <table className="border-collapse border-2 p-2 text-center dark:border-neutral-400 dark:text-neutral-200">
        <thead className=" text-sm dark:bg-neutral-600">
          <tr key="header">{headerArray}</tr>
        </thead>
        <tbody className=" dark:bg-neutral-900">{bodyRows}</tbody>
      </table>
    </section>
  );
}
