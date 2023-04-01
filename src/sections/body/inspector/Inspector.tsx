import { useColourBlocksContext } from '../../../contexts/ColourBlocksProvider';
import { useColourInputContext } from '../../../contexts/ColourInputProvider';
import InspectorBlock from './InspectorBlock';

export default function Inspector() {
  const { colourMap } = useColourInputContext();
  const { currentCombo, combos } = useColourBlocksContext();

  if (currentCombo.length === 0) return null;
  const [backgroundHex, foregroundHex] = currentCombo.split('/');
  const backgroundColour = colourMap?.get(backgroundHex);
  const foregroundColour = colourMap?.get(foregroundHex);
  const currentComboObject = combos.get(currentCombo);
  const ratioIn = currentComboObject
    ? currentComboObject.ratio
    : backgroundColour?.contrastRatios.get(foregroundHex) || 1;

  return (
    <div className="mx-auto">
      <h2 className="mx-auto w-fit">Current Combination</h2>
      <InspectorBlock background={backgroundColour} foreground={foregroundColour} contrastIn={ratioIn} />
    </div>
  );
}
