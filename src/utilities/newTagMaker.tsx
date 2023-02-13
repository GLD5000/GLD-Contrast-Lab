import getRandomColour from './randomColour';
import AutoTextColour from './autoTextColour';

export default function makeNewTag(tagName: string) {
  const backgroundColour = getRandomColour();
  const textColour = AutoTextColour(backgroundColour);
  const newTag = {
    name: tagName,
    backgroundColour,
    textColour,
  };

  return newTag;
}
