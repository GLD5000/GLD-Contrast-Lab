import { useColourBlocksContext } from '../../contexts/ColourBlocksProvider';
import DeleteSvg from '../../icons/DeleteSvg';
import { autoTextColour } from '../../utilities/colour/autoTextColour';

export default function BlockVisibility({ hexId }: { hexId: string }) {
  const { limit, visibleSet, dispatchColourBlocks } = useColourBlocksContext();
  if (limit !== 'Selecting...') return null;
  const hex = hexId.split('-')[0];
  const textColour = autoTextColour.autoTextColourFromHex(hex);
  function handleClickVisibility() {
    const present = visibleSet.has(hex);
    const newSet = new Set(visibleSet);
    if (present) newSet.delete(hex);
    if (!present) newSet.add(hex);
    dispatchColourBlocks({ visibleSet: newSet });
  }

  return (
    <button
      style={{ color: textColour }}
      type="button"
      onClick={handleClickVisibility}
      className="mx-auto h-12 w-10 rounded border border-transparent text-sm text-current hover:border-current hover:transition"
    >
      <div className="mx-auto h-6 w-6">
        <DeleteSvg />
      </div>
      <span className="mx-auto text-xs">Hide</span>
    </button>
  );
}
