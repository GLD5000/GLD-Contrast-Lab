import { MouseEvent, ReactElement } from 'react';

import UpSvg from '../icons/UpSvg';
import DownSvg from '../icons/DownSvg';
import AddSvg from '../icons/AddSvg';
import DeleteSvg from '../icons/DeleteSvg';
import DuplicateSvg from '../icons/DuplicateSvg';
import PreviewSvg from '../icons/PreviewSvg';
import PencilSvg from '../icons/PencilSvg';
import UnPencilSvg from '../icons/UnPencilSvg';
import ItalicSvg from '../icons/ItalicSvg';
import BoldSvg from '../icons/BoldSvg';
import HeaderSvg from '../icons/HeaderSvg';
import CodeSvg from '../icons/CodeSvg';
import LinkSvg from '../icons/LinkSvg';
import QuoteSvg from '../icons/QuoteSvg';
import BulletSvg from '../icons/BulletSvg';
import NumberedSvg from '../icons/NumberedSvg';
import TableSvg from '../icons/TableSvg';
import HintSvg from '../icons/HintSvg';
import MoonSvg from '../icons/MoonSvg';
import SunSvg from '../icons/SunSvg';
import TickSvg from '../icons/TickSvg';

// import CollapseSvg from '../icons/Collapse'
// import ExpandSvg from '../icons/Expand'
function getSvg(type: string, svgClasses: string, svgWrapperClasses: string): ReactElement {
  const svgLookup: { [key: string]: ReactElement } = {
    italic: <ItalicSvg classes={svgClasses} />,
    bold: <BoldSvg classes={svgClasses} />,
    up: <UpSvg classes={svgClasses} />,
    down: <DownSvg classes={svgClasses} />,
    add: <AddSvg classes={svgClasses} />,
    delete: <DeleteSvg classes={svgClasses} />,
    duplicate: <DuplicateSvg classes={svgClasses} />,
    preview: <PreviewSvg classes={svgClasses} />,
    write: <PencilSvg classes={svgClasses} />,
    cancelWrite: <UnPencilSvg classes={svgClasses} />,
    header: <HeaderSvg classes={svgClasses} />,
    link: <LinkSvg classes={svgClasses} />,
    code: <CodeSvg classes={svgClasses} />,
    quote: <QuoteSvg classes={svgClasses} />,
    bullet: <BulletSvg classes={svgClasses} />,
    numbered: <NumberedSvg classes={svgClasses} />,
    table: <TableSvg classes={svgClasses} />,
    hint: <HintSvg classes={svgClasses} />,
    moon: <MoonSvg classes={svgClasses} />,
    sun: <SunSvg classes={svgClasses} />,
    tick: <TickSvg classes={svgClasses} />,
  };
  return <div className={svgWrapperClasses}>{svgLookup[type]}</div>;
}
function getContent(reverse: boolean, showText: boolean, text: string, svg: ReactElement) {
  return reverse ? (
    <>
      {showText && text}
      {svg}
    </>
  ) : (
    <>
      {svg}
      {showText && text}
    </>
  );
}

export default function SvgButton({
  text = 'Add',
  clickFunction,
  id,
  name,
  type = 'up',
  showText = true,
  reverse = false,
  buttonClasses = `grid-cols-frAutoFr w-full h-full 
  `,
  svgWrapperClasses = 'pointer-events-none h-fit w-full',
  svgClasses = 'stroke-current fill-none stroke-1',
  className = `px-2 py-1
   hover:border-current
   grid     
      rounded border-2 border-solid whitespace-pre-wrap hover:transition
    `,
}: {
  text: string | undefined;
  clickFunction: (e: MouseEvent<HTMLButtonElement>) => void | (() => void);
  id: string | undefined;
  name: string | undefined;
  className: string | undefined;
  type: string | undefined;
  showText: boolean;
  reverse: boolean;
  buttonClasses: string | undefined;
  svgWrapperClasses: string | undefined;
  svgClasses: string | undefined;
}) {
  const svg = getSvg(type, svgClasses, svgWrapperClasses);
  const content = getContent(reverse, showText, text, svg);

  return (
    <button
      type="button"
      id={id}
      name={name}
      onClick={clickFunction}
      className={`cursor-pointer items-center ${className.replaceAll(/[\s]+/g, ' ')} ${buttonClasses}`}
      aria-label={name}
    >
      {content}
    </button>
  );
}
