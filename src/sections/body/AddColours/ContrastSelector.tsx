import { useColourInputContext } from '../../../contexts/ColourInputProvider';

export default function ContrastSelector() {
  const { recentColour, previousColour, colourMode, dispatchColourInput } = useColourInputContext();

  if (recentColour === undefined || colourMode !== 'CR') return null;

  const { Black, White } = recentColour;

  const contrastString = `Contrast ${previousColour?.Name ?? 'Black/White'}: ${
    previousColour?.contrast ?? `${Black}/${White}`
  }
  `;

  function handleClickSelector() {
    dispatchColourInput({ type: 'CYCLE_PREVIOUS_COLOUR', payload: { tag: previousColour?.Name || '' } });
  }
  return (
    <button
      type="button"
      onClick={handleClickSelector}
      className="active:deco absolute top-1 left-1 right-1 mx-auto my-0 flex  h-11  content-center gap-4 rounded bg-deco py-2 px-4 text-current hover:bg-txt-low  hover:text-bg-var hover:transition dark:bg-deco-dk hover:dark:bg-txt-main-dk hover:dark:text-bg-var-dk"
    >
      <p className="m-auto h-5 w-fit text-base leading-tight">{contrastString}</p>
    </button>
  );
}
