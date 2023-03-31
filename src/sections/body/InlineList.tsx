import { MouseEvent, Dispatch } from 'react';
import { ColourObj, useColourInputContext } from '../../contexts/ColourInputProvider';
import SpicyLi from '../../elements/SpicyLi';
import Ul from '../../elements/Ul';
import autoTextColourFromHex from '../../utilities/colour/autoTextColour';

function getContent(
  listArray: Array<ColourObj>,
  dispatchColourInput: Dispatch<{
    type: string;
    payload: Partial<{
      textInput: string | undefined;
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

  function closeHandler(e: MouseEvent<HTMLButtonElement>) {
    const hex = e.currentTarget.id.split('-')[0];
    dispatchColourInput({ type: 'CLOSE_TAG', payload: { tag: hex } });
  }
  function tagHandler(e: MouseEvent<HTMLButtonElement>) {
    const hex = e.currentTarget.id.split('-')[0];
    if (hex) {
      dispatchColourInput({ type: 'EDIT', payload: { textInput: hex } });
      document.getElementById('colour-input')?.focus();
    }
  }
  const itemArray = listArray.map((object, index) => {
    const newHex = object.Hex;
    const name = object.Name;
    const uniqueKey = `${newHex}-${index}`;
    // add clickHandler
    return (
      <SpicyLi
        key={uniqueKey}
        id={uniqueKey}
        content={name}
        className="flex h-8 w-36 min-w-fit flex-row items-center justify-between rounded-full border border-txt-main text-center text-sm hover:transition dark:border-neutral-300"
        style={{ backgroundColor: newHex, color: autoTextColourFromHex(newHex) }}
        closeFunction={closeHandler}
        tagFunction={tagHandler}
      />
    );
  });

  return [...itemArray, deleteBtn];
}

export default function InlineList() {
  const { colourMap, dispatchColourInput } = useColourInputContext();

  if (!colourMap) return null;
  const mapArray = [...colourMap.values()];
  const content = getContent(mapArray, dispatchColourInput);
  const className = 'list-none flex flex-row flex-wrap gap-2 mx-auto justify-center p-2';
  return <Ul content={content} className={className} />;
}
