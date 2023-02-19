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

if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest;

  (() => {
    const testFunc = 'makeNewTag';
    describe(`#${testFunc}`, () => {
      it(`makeNewTag Works`, () => {
        expect(makeNewTag('NewTag')).toBeTruthy();
        expect(makeNewTag('NewTag').name).toBe('NewTag');
        expect(makeNewTag('NewTag').backgroundColour).toMatch(/#[0-9a-f]{6}/);
        expect(makeNewTag('NewTag').textColour).toMatch(/#[0-9a-f]{6}/);
      });
    });
  })();
}
