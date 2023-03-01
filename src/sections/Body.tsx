import { Dispatch, SetStateAction, useState } from 'react';
import InputTabs from '../elements/InputTabs';
import ColourBlocks from './body/ColourBlocks';
import TextInput from './body/TextInput';
import Banner from './header/Banner';

function processHexString(hex: string) {
  if (hex[0] !== '#' || hex.length < 2 || hex.slice(1).search(/#|[^0-9a-fA-F]/) > -1) return '';
  let modifiedHex = hex.length > 7 ? hex.slice(0, 7) : hex;
  if (hex.length < 5) {
    const characters = hex.slice(1);
    modifiedHex = `#${characters.repeat(6 / characters.length)}`;
  }
  if (hex.length > 4 && hex.length < 7) {
    modifiedHex = `#${hex[1].repeat(6)}`;
  }
  return modifiedHex;
}

function hexReducer(acc: Array<string>, curr: string) {
  const processedHex = processHexString(curr);
  if (processedHex.length === 7) acc.push(processedHex);
  return acc;
}

function processText(text: string, limit: number) {
  const backgroundColours: Array<string> = [
    ...new Set(
      text
        .split(/[ \r\n,]+/)
        .reduce(hexReducer, [])
        .sort(),
    ),
  ];
  if (backgroundColours.length > limit) return backgroundColours.slice(0, limit);
  return backgroundColours;
}
function getTab(tab: string, setText: Dispatch<SetStateAction<string>>, text: string, textArray: string[]) {
  if (tab === 'add-colours') {
    return <TextInput text={text} setText={setText} textArray={textArray} />;
  }
  if (tab === 'compare-matrix') {
    return <ColourBlocks textArray={textArray} />;
  }

  return null;
}
export default function Body() {
  const [tab, setTab] = useState('add-colours');
  const [showBanner, setShowBanner] = useState(true);

  const [text, setText] = useState(
    '#fafafa\r#f4f4f5\r#e4e4e7\r#d4d4d8\r#a1a1aa\r#71717a\r#52525b\r#3f3f46\r#27272a\r#18181b',
  );
  const limit = 12;
  const textArray: Array<string> = processText(text, limit);
  const returnSection = getTab(tab, setText, text, textArray);
  return (
    <main id="body-container" className=" grid w-screen  flex-grow justify-items-center  pt-2  align-middle ">
      <section className="flex h-full w-body min-w-body max-w-body flex-col gap-8 bg-neutral-100 dark:bg-neutral-800 ">
        {showBanner && <Banner setShowBanner={setShowBanner} />}
        <InputTabs tab={tab} setTab={setTab} />
        {returnSection}
      </section>
    </main>
  );
}
