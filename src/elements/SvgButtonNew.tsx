import { MouseEvent, ReactElement, useState } from 'react';

function getContent(reverse: boolean, showText: boolean, textElement: ReactElement | null, svg: ReactElement) {
  return reverse ? (
    <>
      {showText && textElement}
      {svg}
    </>
  ) : (
    <>
      {svg}
      {showText && textElement}
    </>
  );
}

export default function SvgButtonNew({
  clickFunction,
  id,
  name,
  reverse = false,
  buttonClasses = `grid-cols-frAutoFr w-full h-full 
  `,
  svg,
  textElement,
  className = `px-2 py-1
   hover:border-current
   grid     
      rounded border-2 border-solid whitespace-pre-wrap hover:transition
    `,
}: {
  clickFunction: (e: MouseEvent<HTMLButtonElement>) => void | (() => void);
  id: string | undefined;
  name: string | undefined;
  className: string | undefined;
  reverse: boolean;
  buttonClasses: string | undefined;
  svg: ReactElement;
  textElement: ReactElement | null;
}) {
  const [showText, setShowText] = useState(false);
  const content = getContent(reverse, showText, textElement, svg);

  return (
    <button
      type="button"
      id={id}
      name={name}
      onClick={clickFunction}
      className={`cursor-pointer items-center ${className.replaceAll(/[\s]+/g, ' ')} ${buttonClasses}`}
      aria-label={name}
      onFocus={() => {
        setShowText(true);
      }}
      onMouseEnter={() => {
        setShowText(true);
      }}
      onBlur={() => {
        setShowText(false);
      }}
      onMouseLeave={() => {
        setShowText(false);
      }}
    >
      {content}
    </button>
  );
}
