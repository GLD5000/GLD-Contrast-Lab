import { ColourObj } from '../../../contexts/ColourInputProvider';
import ColourDemo from './ColourDemo';
import RatingTable from './RatingTable';
import { contrast } from '../../../utilities/colour/contrastRatio';

function getElementColours(backgroundObject: ColourObj, foregroundObject: ColourObj, contrastNumber: number) {
  const autoTextBackground = backgroundObject.Autocolour === 'Black' ? '#000000' : '#ffffff';
  const autoTextForeground = foregroundObject.Autocolour === 'Black' ? '#000000' : '#ffffff';

  const borderBackground = contrastNumber >= 3 ? `${foregroundObject.Hex}` : autoTextBackground;
  const borderForeground = contrastNumber >= 3 ? `${backgroundObject.Hex}` : autoTextForeground;

  const largeTextBackground = contrastNumber >= 3 ? `${foregroundObject.Hex}` : autoTextBackground;
  const largeTextForeground = contrastNumber >= 3 ? `${backgroundObject.Hex}` : autoTextForeground;

  const smallTextBackground = contrastNumber >= 4.5 ? `${foregroundObject.Hex}` : autoTextBackground;
  const smallTextForeground = contrastNumber >= 4.5 ? `${backgroundObject.Hex}` : autoTextForeground;
  return {
    borderBackground,
    borderForeground,
    largeTextBackground,
    largeTextForeground,
    smallTextBackground,
    smallTextForeground,
  };
}

export default function InspectorBlock({
  background,
  foreground,
  contrastIn,
}: {
  background: ColourObj | undefined;
  foreground: ColourObj | undefined;
  contrastIn: number;
}) {
  if (!background || !foreground) return null;

  const {
    borderBackground,
    borderForeground,
    largeTextBackground,
    largeTextForeground,
    smallTextBackground,
    smallTextForeground,
  } = getElementColours(background, foreground, contrastIn);
  const rating = contrast.makeContrastRating(contrastIn);

  return (
    <div className="mx-auto my-4 grid w-min overflow-clip rounded-[2.4rem] border border-border bg-inherit p-0">
      <ColourDemo
        backgroundObject={background}
        border={borderBackground}
        largeText={largeTextBackground}
        smallText={smallTextBackground}
        contrastNumberIn={contrastIn}
        ratingStringIn={rating}
      />
      <ColourDemo
        backgroundObject={foreground}
        border={borderForeground}
        largeText={largeTextForeground}
        smallText={smallTextForeground}
        contrastNumberIn={contrastIn}
        ratingStringIn={rating}
      />
      <RatingTable ratingString={rating} />
    </div>
  );
}
