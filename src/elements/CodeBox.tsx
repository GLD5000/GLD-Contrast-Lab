import { useState, useEffect, ReactElement } from 'react';
import SvgButton from './SvgButton';

function removeParagraphs(string: string) {
  const regex = /(PpPpEEE)|(PpPpSSS)/g;
  return string.replaceAll(regex, ``);
}

export default function CodeBox({
  content,
  parse = false,
}: {
  content: ReactElement | string | undefined | Array<ReactElement | string | undefined>;
  parse: boolean;
}) {
  const [copyButtonMessage, setCopyButtonMessage] = useState('Copy');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCopyButtonMessage('Copy');
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [copyButtonMessage]);

  if (typeof content !== 'string') return null;
  const code = parse ? removeParagraphs(content) : content;
  const firstLineBreak = code.search(/\r?\n/);
  const isLineBreak = firstLineBreak > -1;
  const codeFileName =
    // isLineBreak && (code.search(/^[*\w.]+\.[*\w]+(?=(\r?\n))/) > -1)
    isLineBreak && (code.search(/^[*\w.]+\.[*\w.:]+(?=(\r?\n))/) > -1 || code.search(/^.+:(?=(\r?\n))/) > -1)
      ? code.slice(0, firstLineBreak).replace(':', '')
      : null;
  const codeBody = codeFileName ? code.slice(firstLineBreak + 1) : code;
  function clickHandler() {
    navigator.clipboard.writeText(codeBody);
    setCopyButtonMessage('Copied!');
  }

  return (
    <code className="my-2 mx-4 block h-fit max-w-full overflow-x-auto whitespace-pre rounded border-solid border-neutral-500 bg-neutral-900 font-mono text-vsGreen placeholder:text-vsGreen">
      {codeFileName && (
        <h3 className="file-name rounded-none bg-neutral-900 px-1 text-right text-neutral-300">{codeFileName}</h3>
      )}
      <pre className="p-2">{`${codeBody}`}</pre>
      <SvgButton
        type="duplicate"
        key={`${1}copyCode`}
        text={copyButtonMessage}
        clickFunction={clickHandler}
        showText
        reverse={false}
        buttonClasses="border-transparent sticky left-0"
        className=" sticky left-0 bottom-0 flex w-full items-center  justify-center rounded-none border-2 border-transparent bg-neutral-900 text-neutral-200 transition delay-100 duration-200 ease-in-out hover:border-2 hover:border-current active:bg-slate-600"
        // marginLeft='auto'
        svgClasses="stroke-1 fill-neutral-900 stroke-neutral-200"
        color=""
        backgroundColor=""
        id=""
        name=""
        activeClasses=""
      />
    </code>
  );
}
