import { MouseEvent } from 'react';
import SpicyLi from '../../elements/SpicyLi';
import Ul from '../../elements/Ul';
import autoTextColourFromHex from '../../utilities/colour/autoTextColour';

function getContent(listArray: string[]) {
  return listArray.map((name, index) => {
    const uniqueKey = `${name}-${index}`;
    // add clickHandler
    function clickHandler(e: MouseEvent<HTMLButtonElement>) {
      console.log('e:', e);
    }
    // add close button
    // Close button updates array
    // change list to set
    return (
      <SpicyLi
        key={uniqueKey}
        id={uniqueKey}
        content={name}
        className="m-2 flex h-fit w-fit flex-row items-center justify-center gap-2 rounded-lg border-4 border-neutral-900 px-2 text-center dark:border-neutral-200"
        style={{ backgroundColor: name, color: autoTextColourFromHex(name) }}
        clickFunction={clickHandler}
      />
    );
  });
}

export default function InlineList({ listSet }: { listSet: Set<string> }) {
  const content = getContent([...listSet]);
  const className = 'list-none flex flex-row flex-wrap ';
  return <Ul content={content} className={className} />;
}
