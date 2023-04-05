import { useColourInputContext } from '../../contexts/ColourInputProvider';

function handleClickAddColoursLink() {
  document.getElementById('contents-Add-Colours')?.click();
}

export default function NoData() {
  const { dispatchColourInput } = useColourInputContext();

  function handleClickAutoScheme() {
    const newValue = `bg-txt-lt	#000000
    bg-txt-lo-lt	#3d3d3d
    brand-lt	#2e69ff
    bg-outline-lt	#919191
    bg-deco-lt	#d1d1d1
    bg-var-lt	#f5f5f5
    bg-lt	#ffffff`;
    dispatchColourInput({ type: 'UPDATE_TEXT', payload: { textInput: newValue } });
  }

  return (
    <div>
      Nothing to show here yet so you have two options:
      <div className="mx-auto flex h-12 w-80 flex-row gap-1 p-1">
        <button
          type="button"
          id="randomise-colour"
          className="active:deco mx-auto my-0  flex  w-full content-center gap-4 rounded bg-deco py-2 px-4 text-current hover:bg-txt-low  hover:text-bg-var hover:transition dark:bg-deco-dk hover:dark:bg-txt-main-dk hover:dark:text-bg-var-dk"
          onClick={handleClickAddColoursLink}
        >
          <p className="m-auto text-sm">Take Me To Add Colours</p>
        </button>
      </div>
      <div className="mx-auto flex h-12 w-80 flex-row gap-1 p-1">
        <button
          type="button"
          id="randomise-colour"
          className="active:deco mx-auto my-0  flex  w-full content-center gap-4 rounded bg-deco py-2 px-4 text-current hover:bg-txt-low  hover:text-bg-var hover:transition dark:bg-deco-dk hover:dark:bg-txt-main-dk hover:dark:text-bg-var-dk"
          onClick={handleClickAutoScheme}
        >
          <p className="m-auto text-sm">Add Some Colours For me</p>
        </button>
      </div>
    </div>
  );
}
