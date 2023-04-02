import { ColourObj } from '../../../contexts/ColourInputProvider';
import ColourDemo from './ColourDemo';

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

  return <ColourDemo backgroundObject={background} foregroundObject={foreground} contrastNumberIn={contrastIn} />;
}
