import SpicyLi from '../../elements/SpicyLi';
import Ul from '../../elements/Ul';
import autoTextColourFromHex from '../../utilities/colour/autoTextColour';

function getContent(listArray: string[]) {
  return listArray.map((name, index) => {
    const uniqueKey = `${name}-${index}`;
    // add clickHandler
    // add close button
    // Close button updates array
    // change list to set
    return (
      <SpicyLi
        key={uniqueKey}
        id={uniqueKey}
        content={name}
        className="m-2 h-fit w-fit rounded-full p-2 text-center"
        style={{ backgroundColor: name, color: autoTextColourFromHex(name) }}
      />
    );
  });
}

export default function InlineList({ listArray }: { listArray: string[] }) {
  const content = getContent(listArray);
  const className = 'list-none flex flex-row flex-wrap ';
  return <Ul content={content} className={className} />;
}
