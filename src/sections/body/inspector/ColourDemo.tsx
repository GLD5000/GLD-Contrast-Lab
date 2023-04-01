import { ColourObj } from '../../../contexts/ColourInputProvider';

function getHexData(colourObject: ColourObj) {
  const { Hex, HSL, RGB, Luminance, Black, White } = colourObject;
  return `Contrast Black/White: ${Black}/${White}\r\nRelative Luminance: ${Luminance} \r\n${`Hex:${Hex}\r\n`}${`${HSL}\r\n`}${`${RGB}\r\n`}`;
}

export default function ColourDemo({
  backgroundObject,
  border,
  largeText,
  smallText,
  contrastNumberIn,
  ratingStringIn,
}: {
  backgroundObject: ColourObj;
  border: string;
  largeText: string;
  smallText: string;
  contrastNumberIn: number;
  ratingStringIn: string;
}) {
  return (
    <div style={{ backgroundColor: backgroundObject.Hex }} className="relative h-60 w-80 shrink-0 grow-0 rounded-none">
      <h1 style={{ color: largeText, borderColor: border }} className="mx-auto mt-4 w-fit rounded border-4 p-2">
        {backgroundObject.Name}
      </h1>
      <h2
        style={{ color: smallText }}
        className="mx-auto w-fit p-2"
      >{`${ratingStringIn} (${contrastNumberIn} : 1)`}</h2>
      <pre style={{ color: smallText }} className="absolute bottom-4 left-4 m-0 h-fit p-0 font-code text-xs">
        {getHexData(backgroundObject)}
      </pre>
    </div>
  );
}
