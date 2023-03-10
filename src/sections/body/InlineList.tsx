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
  function handleClickClearTags() {
    dispatchColourInput({ type: 'CLEAR_TAGS', payload: {} });
  }

  const deleteBtn = (
    <button
      key="delete-all-btn"
      type="button"
      onClick={handleClickClearTags}
      className=" flex h-8 w-28 flex-row content-center items-center justify-center rounded border-2 border-current p-1 text-sm text-pink-700 hover:bg-pink-700 hover:text-white dark:text-pink-300 dark:hover:bg-pink-300 dark:hover:text-black"
    >
      Delete All <span className=" whitespace-pre font-normal"> ({listArray.length})</span>
    </button>
  );

  const itemArray = listArray.map((name, index) => {
    const uniqueKey = `${name}-${index}`;
    // add clickHandler
    function closeHandler(e: MouseEvent<HTMLButtonElement>) {
      const hex = e.currentTarget.id.split('-')[0];
      dispatchColourInput({ type: 'CLOSE_TAG', payload: { tag: hex } });
    }
    function tagHandler(e: MouseEvent<HTMLButtonElement>) {
      const hex = e.currentTarget.id.split('-')[0];
      console.log('hex:', hex);
      dispatchColourInput({ type: 'UPDATE_TEXT', payload: { textInput: hex } });
    }
    return (
      <SpicyLi
        key={uniqueKey}
        id={uniqueKey}
        content={name}
        className="flex  h-8 w-28 flex-row items-center justify-between rounded-full border border-neutral-900 p-1 text-center text-sm dark:border-neutral-300"
        style={{ backgroundColor: name, color: autoTextColourFromHex(name) }}
        closeFunction={closeHandler}
        tagFunction={tagHandler}
      />
    );
  });

  return [...itemArray, deleteBtn];
}

export default function InlineList() {
  const { colourSet, dispatchColourInput } = useColourInputContext();

  if (colourSet.size === 0) return null;
  const content = getContent([...colourSet], dispatchColourInput);
  const className = 'list-none flex flex-row flex-wrap gap-2 mx-auto justify-center p-2';
  return <Ul content={content} className={className} />;
}
