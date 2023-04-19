import { MouseEvent, ReactElement } from 'react';
import SvgButton from './SvgButton';

export default function SpicyLi({
  content,
  style,
  className = 'm-2',
  id,
  closeFunction,
  tagFunction,
}: {
  className: string;
  style: { [key: string]: string };
  content: ReactElement | string | number | undefined | Array<ReactElement | string | number | undefined>;
  id: string;
  closeFunction: (e: MouseEvent<HTMLButtonElement>) => void;
  tagFunction: (e: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <li id={id} className={className} style={style}>
      <button
        type="button"
        id={`${id}-tag-btn`}
        onClick={tagFunction}
        className="m-0 h-full w-full cursor-grab rounded-r-none p-1 hover:bg-[#767676] hover:text-white focus:bg-[#767676] focus:text-white"
      >
        {content}
      </button>
      <SvgButton
        svgWrapperClasses="pointer-events-none h-6 w-6"
        text={undefined}
        clickFunction={closeFunction}
        id={`${id}-close-btn`}
        name={`${id}-close-btn`}
        className=""
        type="delete"
        showText={false}
        reverse={false}
        buttonClasses="  h-full rounded-full rounded-l-none m-0 hover:transition aspect-square hover:bg-[#767676] hover:text-white focus:bg-[#767676] focus:text-white text-current items-center"
        svgClasses="stroke-current fill-none stroke-2 h-full w-full"
      />
    </li>
  );
}
