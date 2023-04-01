import { useColourBlocksContext } from '../../contexts/ColourBlocksProvider';
import { useColourInputContext } from '../../contexts/ColourInputProvider';
import ExclamationSvg from '../../icons/ExclamationSvg';
import TickSvg from '../../icons/TickSvg';
import { contrast } from '../../utilities/colour/contrastRatio';

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
      <td key={key} className="border-collapse border-2 border-neutral-400 p-1 px-4 text-center">
        {text !== 'Pass' && text !== 'Fail' ? null : svg}
        {text}
      </td>
    );
  });
}

function makeTable(rating: string) {
  const header = <tr key="rating-row">{getCells(content.header)}</tr>;
  const row = <tr key="rating-row">{getCells(content[rating])}</tr>;
  return (
    <table className="border-collapse border-2 p-2 text-center dark:border-neutral-400 dark:text-neutral-200">
      <thead className=" text-sm dark:bg-neutral-600">{header}</thead>
      <tbody className=" text-xs dark:bg-neutral-900">{row}</tbody>
    </table>
  );
}

function getRatings(ratio: number) {
  const overallRating = contrast.makeContrastRating(ratio);
  const table = makeTable(overallRating);
  return { overallRating, table };
}

export default function Inspector() {
  const { colourMap } = useColourInputContext();
  const { currentCombo, combos } = useColourBlocksContext();

  if (currentCombo.length === 0) return null;
  const [backgroundHex, foregroundHex] = currentCombo.split('/');
  const backgroundColour = colourMap?.get(backgroundHex);
  const foregroundColour = colourMap?.get(foregroundHex);
  const currentComboObject = combos.get(currentCombo);
  const ratioIn = currentComboObject
    ? currentComboObject.ratio
    : backgroundColour?.contrastRatios.get(foregroundHex) || 1;
  const { overallRating, table } = getRatings(ratioIn);

  return (
    <div className="mx-auto">
      <h2 className="mx-auto w-fit">{`Current Combination ${backgroundColour?.Name} / ${foregroundColour?.Name}`}</h2>
      {`Overall Rating ${overallRating}`}
      {table}
    </div>
  );
}
