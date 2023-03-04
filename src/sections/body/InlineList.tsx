import { MouseEvent, Dispatch } from 'react';
import { useColourInputContext } from '../../contexts/ColourInputProvider';
import SpicyLi from '../../elements/SpicyLi';
import Ul from '../../elements/Ul';
import autoTextColourFromHex from '../../utilities/colour/autoTextColour';

function getContent(
  listArray: string[],
  dispatchColourInput: Dispatch<{
    type: string;
    payload: Partial<{
      textInput: string | undefined;
      colourSet: Set<string>;
      limit: number;
      tag: string;
    }>;
  }>,
) {
  return listArray.map((name, index) => {
    const uniqueKey = `${name}-${index}`;
    // add clickHandler
    function clickHandler(e: MouseEvent<HTMLButtonElement>) {
      const hex = e.currentTarget.id.split('-')[0];
      dispatchColourInput({ type: 'CLOSE_TAG', payload: { tag: hex } });
    }
    return (
      <SpicyLi
        key={uniqueKey}
        id={uniqueKey}
        content={name}
        className="m-2 flex h-fit w-fit flex-row items-center justify-between gap-1 rounded border-2 border-neutral-900 px-1 text-center text-lg dark:border-neutral-200"
        style={{ backgroundColor: name, color: autoTextColourFromHex(name) }}
        clickFunction={clickHandler}
      />
    );
  });
}

export default function InlineList() {
  const { colourSet, dispatchColourInput } = useColourInputContext();
  const content = getContent([...colourSet], dispatchColourInput);
  const className = 'list-none flex flex-row flex-wrap ';
  return <Ul content={content} className={className} />;
}
