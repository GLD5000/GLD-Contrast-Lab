import { MouseEvent, Dispatch } from 'react';
import { useColourBlocksContext } from '../../contexts/ColourBlocksProvider';
import SpicyLi from '../../elements/SpicyLi';
import Ul from '../../elements/Ul';
import autoTextColourFromHex from '../../utilities/colour/autoTextColour';
import { colourSpace } from '../../utilities/colour/colourSpace';

function sortByHue(acc: Array<Array<string>>, curr: string) {
  const hue = Math.round(colourSpace.convertHexToHslArray(curr)[0]);
  acc[hue] = acc[hue] === undefined ? [curr] : [...acc[hue], curr];
  return acc;
}

function getContent(
  listSet: Set<string>,
  dispatchColourBlocks: Dispatch<
    Partial<{
      colourMode: string;
      showRatio: boolean;
      showPoor: boolean;
      limit: string;
      visibleSet: Set<string>;
    }>
  >,
) {
  const listArray = [...listSet].reduce(sortByHue, [[]]).flatMap((x) => x);

  return listArray.map((name, index) => {
    const uniqueKey = `${name}-${index}`;
    function clickHandler(e: MouseEvent<HTMLButtonElement>) {
      const hex = e.currentTarget.id.split('-')[0];
      listSet.delete(hex);
      dispatchColourBlocks({ visibleSet: listSet });
    }
    return (
      <SpicyLi
        key={uniqueKey}
        id={uniqueKey}
        content={name}
        className="flex h-fit  w-28 flex-row items-center justify-between rounded-full border border-neutral-900 p-1 text-center text-sm dark:border-neutral-300"
        style={{ backgroundColor: name, color: autoTextColourFromHex(name) }}
        clickFunction={clickHandler}
      />
    );
  });
}

export default function VisibleList() {
  const { dispatchColourBlocks, visibleSet } = useColourBlocksContext();

  if (visibleSet.size === 0) return null;
  const content = getContent(visibleSet, dispatchColourBlocks);
  const className = 'list-none flex flex-row flex-wrap gap-2 mx-auto justify-around max-w-screen';
  return <Ul content={content} className={className} />;
}
