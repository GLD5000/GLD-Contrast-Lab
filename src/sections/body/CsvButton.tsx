import { useState, useEffect } from 'react';
import SvgButton from '../../elements/SvgButton';

export default function CsvButton({ data }: { data: string }) {
  const [copyButtonMessage, setCopyButtonMessage] = useState('Copy All');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCopyButtonMessage('Copy All');
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [copyButtonMessage]);

  return (
    <SvgButton
      type={copyButtonMessage === 'Copy All' ? 'duplicate' : 'tick'}
      key={`${1}copyCode`}
      text={copyButtonMessage}
      clickFunction={() => {
        navigator.clipboard.writeText(data);
        setCopyButtonMessage('Copied!');
      }}
      showText
      reverse={false}
      buttonClasses={undefined}
      className="flex justify-center gap-2 text-sm hover:bg-black hover:text-white hover:transition active:bg-slate-600 hover:dark:bg-white hover:dark:text-black"
      svgClasses="stroke-1 fill-none stroke-current"
      id="copy-table"
      name="Copy SVG Info"
      svgWrapperClasses="h-6 w-6"
    />
  );
}
