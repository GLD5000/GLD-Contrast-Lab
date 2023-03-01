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
// import CollapseSvg from '../icons/Collapse'
// import ExpandSvg from '../icons/Expand'
function getSvg(type: string, svgClasses: string): ReactElement {
  const svgLookup: { [elemName: string]: ReactElement } = {
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
  };
  return svgLookup[type];
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
  color = 'current',
  backgroundColor = 'transparent',
  text = 'Add',
  clickFunction,
  id,
  name,
  type = 'up',
  showText = true,
  reverse = false,
  activeClasses = `active:bg-slate-600 `,
  buttonClasses = `grid-cols-frAutoFr w-full h-full 
  `,
  svgClasses = 'stroke-current fill-none stroke-1',
  className = `px-2 py-1
   items-center 
   hover:border-current
   grid     
     cursor-pointer rounded border-2 border-solid whitespace-pre-wrap hover:transition
    ${color && color} ${backgroundColor && backgroundColor} ${buttonClasses} ${activeClasses}`,
}: {
  color: string;
  backgroundColor: string;
  text: string;
  clickFunction: (e: MouseEvent<HTMLButtonElement>) => void;
  id: string;
  name: string;
  className: string;
  activeClasses: string;
  type: string;
  showText: boolean;
  reverse: boolean;
  buttonClasses: string;
  svgClasses: string;
}) {
  const svg = getSvg(type, svgClasses);
  const content = getContent(reverse, showText, text, svg);

  return (
    <button
      type="button"
      id={id}
      name={name}
      onClick={clickFunction}
      className={className.replaceAll(/[\s]+/g, ' ')}
      aria-label={name}
    >
      {content}
    </button>
  );
}
