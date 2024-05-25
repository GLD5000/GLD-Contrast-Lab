import { createContext, ReactNode, useContext, useReducer, Dispatch, useEffect } from 'react';
import { setToTargetLuminanceHsl } from '../utilities/colour/autoContrast';
import { colourSpace } from '../utilities/colour/colourSpace';
import { contrast } from '../utilities/colour/contrastRatio';
import { luminance } from '../utilities/colour/luminance';
import getRandomColour from '../utilities/colour/randomColour';
import { getSessionStorageMap, clearSessionStorageMap, setSessionStorageMap } from './sessionStorageMap';

export interface StrNumObj {
  [key: string]: string | number;
}
export interface ColourObj {
  [key: string]: number | string | Map<string, number>;
  luminanceFloat: number;
  Hex: string;
  HSL: string;
  Hue: number;
  Sat: number;
  Lum: number;
  RGB: string;
  Luminance: string;
  Black: number;
  White: number;
  Autocolour: string;
  Name: string;
  contrastRatios: Map<string, number>;
}
export interface PreviousColourObj {
  luminanceFloat: number;
  contrast: number;
  Name: string;
  Hex: string;
}

export type ColourMap = Map<string, ColourObj>;

export interface ColourState {
  hslLuminanceTarget: number;
  hslLuminanceTargetCombo: number;
  hslSlider: number;
  hslSliderCombo: number;
  textInput: string;
  colourMode: string;
  sliderType: string;
  sliderTypeCombo: string;
  comboBackground: ColourObj | undefined;
  comboForeground: ColourObj | undefined;
  recentColour: ColourObj | undefined;
  previousColour: PreviousColourObj | undefined;
  colourMap: ColourMap | undefined;
}

interface PayloadOptions extends ColourState {
  number: number;
  tag: string;
  tagB: string;
}
export type ColourPayload = Partial<PayloadOptions>;
export interface ColourContext extends ColourState {
  dispatchColourInput: Dispatch<{
    type: string;
    payload: ColourPayload;
  }>;
}

const initialiserContext: ColourContext = {
  hslLuminanceTarget: 17.7,
  hslLuminanceTargetCombo: 17.7,
  hslSlider: 0,
  hslSliderCombo: 0,
  textInput: '',
  colourMode: 'Hex',
  sliderType: 'Lum',
  sliderTypeCombo: 'Lum',
  comboBackground: undefined,
  comboForeground: undefined,
  recentColour: undefined,
  previousColour: undefined,
  colourMap: undefined,
  dispatchColourInput: () => undefined,
};

const initialiserState: ColourState = {
  hslLuminanceTarget: 17.7,
  hslLuminanceTargetCombo: 17.7,
  hslSlider: 0,
  hslSliderCombo: 0,

  textInput: '',
  colourMode: 'Hex',
  sliderType: 'Lum',
  sliderTypeCombo: 'Lum',
  comboBackground: undefined,
  comboForeground: undefined,
  recentColour: undefined,
  previousColour: undefined,
  colourMap: undefined,
};

function useData() {
  const [
    {
      hslLuminanceTarget,
      hslLuminanceTargetCombo,
      hslSlider,
      hslSliderCombo,
      textInput,
      colourMode,
      sliderType,
      sliderTypeCombo,
      comboBackground,
      comboForeground,
      recentColour,
      previousColour,
      colourMap,
    },
    dispatchColourInput,
  ] = useReducer(tagReducer, initialiserState);
  useEffect(() => {
    dispatchColourInput({ type: 'INIT', payload: {} });
  }, []);
  return {
    hslLuminanceTarget,
    hslLuminanceTargetCombo,
    hslSlider,
    hslSliderCombo,
    textInput,
    colourMode,
    sliderType,
    sliderTypeCombo,
    colourMap,
    comboBackground,
    comboForeground,
    recentColour,
    previousColour,
    dispatchColourInput,
  };
  function tagReducer(
    state: ColourState,
    action: {
      type: string;
      payload: ColourPayload;
    },
  ): ColourState {
    switch (action.type) {
      case 'INIT': {
        // console.log('INIT');

        const savedMap = getSessionStorageMap();
        // console.log('savedMapReturn:', savedMap);
        if (Array.isArray(savedMap)) {
          return convertColourArrayToMap(savedMap);
        }
        // const recentColourValue = makeColourObjectHsl(randomColour.makeRandomHslString(), state);
        const returnValue: ColourState = {
          // textInput: `${recentColourValue.Hex}`,
          hslLuminanceTarget: 17.7,
          hslLuminanceTargetCombo: 17.7,
          hslSlider: 0,
          hslSliderCombo: 0,
          textInput: '',
          colourMode: 'Hex',
          sliderType: 'Lum',
          sliderTypeCombo: 'Lum',
          // recentColour: recentColourValue,
          comboBackground: undefined,
          comboForeground: undefined,
          recentColour: undefined,
          previousColour: undefined,
          colourMap: undefined,
        };
        // if (savedMap) {
        //   const colourObjects = [...savedMap.values()];
        //   const entryOne = colourObjects[0];
        //   const entryTwo = colourObjects[1];
        //   if (entryOne) returnValue.comboBackground = entryOne;
        //   if (entryTwo) returnValue.comboForeground = entryTwo;

        //   const currentRecentObj = returnValue.comboBackground;
        //   const currentPreviousObj = returnValue.comboForeground;

        //   if (currentRecentObj && currentPreviousObj) {
        //     const ratio = contrast.getContrastRatio2Dp([
        //       currentRecentObj.luminanceFloat,
        //       currentPreviousObj.luminanceFloat,
        //     ]);
        //     if (ratio) currentPreviousObj.contrast = ratio;
        //   }
        // }

        return returnValue;
      }
      case 'RANDOMISE': {
        // console.log('RANDOMISE');

        const newHex = getRandomColour();
        const currentMode = 'Hex';
        const newColourObject = makeColourObject(newHex, state.colourMap, undefined);
        const returnValue = { ...state, colourMode: currentMode, recentColour: newColourObject };
        const previousValue = setPreviousContrast(returnValue);
        if (previousValue) returnValue.previousColour = previousValue;
        if (newColourObject !== undefined) {
          returnValue.textInput = getRecentTextField(newColourObject, currentMode);
          returnValue.hslSlider = getSliderValueHslString(newColourObject.HSL, state.sliderType);
        }
        return returnValue;
      }
      case 'SWAP_COMBO_COLOURS': {
        // console.log('SWAP_COMBO_COLOURS');
        const backgroundObject = state.comboBackground;
        const foregroundObject = state.comboForeground;

        if (!backgroundObject || !foregroundObject) return { ...state };
        const returnValue = {
          ...state,
          comboBackground: { ...foregroundObject },
          comboForeground: { ...backgroundObject },
          hslSliderCombo: getSliderValueHslString(foregroundObject.HSL, state.sliderType),
        };

        return returnValue;
      }

      case 'ASSIGN_COMBO_COLOURS': {
        // console.log('ASSIGN_COMBO_COLOURS');

        const backgroundHex = action.payload.tag;
        const foregroundHex = action.payload.tagB;
        const currentMap = state.colourMap;
        const returnValue = { ...state };
        if (!currentMap) return returnValue;

        if (backgroundHex) {
          const backgroundObj = findObjectInColourMap(backgroundHex, currentMap, undefined);
          if (backgroundObj) returnValue.comboBackground = { ...backgroundObj };
        }

        if (foregroundHex) {
          const foregroundObj = findObjectInColourMap(foregroundHex, currentMap, undefined);
          if (foregroundObj) returnValue.comboForeground = { ...foregroundObj, contrast: 1 };
        }

        const currentRecentObj = returnValue.comboBackground;
        const currentPreviousObj = returnValue.comboForeground;

        if (currentRecentObj && currentPreviousObj) {
          const ratio = contrast.getContrastRatio2Dp([
            currentRecentObj.luminanceFloat,
            currentPreviousObj.luminanceFloat,
          ]);
          if (ratio) currentPreviousObj.contrast = ratio;
        }

        return returnValue;
      }

      case 'EDIT': {
        // console.log('EDIT');

        const newHex = action.payload.textInput;
        // // console.log('newHex:', newHex);
        if (!newHex) return { ...state };
        const currentMode = 'Hex';
        const newColourObject = makeColourObject(newHex, state.colourMap, undefined);
        // // console.log('newColourObject.Name:', newColourObject.Name);
        const previousObject = setPreviousLuminance(newColourObject);
        const returnValue = {
          ...state,
          colourMode: currentMode,
          recentColour: { ...newColourObject },
          previousColour: previousObject,
          hslSlider: getSliderValueHslString(newColourObject.HSL, state.sliderType),
        };
        if (newColourObject !== undefined) {
          returnValue.textInput = getRecentTextField(newColourObject, currentMode);
        }

        const stateLuminance = previousObject?.luminanceFloat;
        // //// console.log('stateLuminance:', stateLuminance);
        if (typeof stateLuminance === 'number') returnValue.hslLuminanceTarget = stateLuminance;

        return returnValue;
      }
      case 'PICK_PREVIOUS': {
        const returnState = { ...state };
        const { recentColour: mostRecentColour, colourMap: colourMapCurrent } = state;
        const currentKey = action.payload.tag;

        if (currentKey === undefined) return returnState;

        const recentLum = mostRecentColour?.luminanceFloat;

        const nextColour = colourMapCurrent?.get(currentKey);
        const previousColourReturn = setPreviousLuminance(nextColour, recentLum);
        if (previousColourReturn) returnState.previousColour = previousColourReturn;
        return returnState;
      }

      case 'EDIT_COMBO': {
        // console.log('EDIT_COMBO');
        const newHex = action.payload.textInput;
        if (!newHex) return { ...state };
        const currentMode = 'Name';
        const newColourObject = makeColourObject(newHex, state.colourMap, undefined);
        const newSliderValue = getSliderValueHslString(newColourObject.HSL, state.sliderType);
        const returnValue = {
          ...state,
          colourMode: currentMode,
          hslSliderCombo: newSliderValue,
        };
        const stateLuminance = newColourObject?.luminanceFloat;
        // //// console.log('stateLuminance:', stateLuminance);
        if (typeof stateLuminance === 'number') returnValue.hslLuminanceTarget = stateLuminance;

        return returnValue;
      }

      case 'CLEAR_TEXT': {
        // console.log('CLEAR_TEXT');
        const returnValue = {
          ...state,
          colourMode: 'Hex',
          sliderType: 'Lum',
          recentColour: undefined,
          textInput: '',
          previousColour: undefined,
        };
        return returnValue;
      }
      case 'UPDATE_TEXT': {
        // console.log('UPDATE_TEXT');
        const { colourMode: modeState } = state;
        const isContrastRatioMode = modeState === 'CR';
        if (isContrastRatioMode) return { ...state };
        const hasRecentColour = state.recentColour !== undefined;
        // //// console.log('hasRecentColour:', hasRecentColour);
        const isRelativeLuminanceMode = modeState === 'RLum';
        const isNameMode = modeState === 'Name';
        const textReceived = action.payload.textInput;
        const isSubmit = /\s/.test(textReceived?.replaceAll(/(, )|(: )/g, '')?.at(-1) || '');

        const recentColourState = state.recentColour;
        if (isRelativeLuminanceMode) return handleRlumUpdate(state, action.payload);

        const shouldSubmitRecentColour = textReceived && isSubmit && recentColourState;
        if (shouldSubmitRecentColour) {
          const recentColourReturn = submitRecentColour(state);
          if (recentColourReturn !== null) return recentColourReturn;
        }

        if (isNameMode) {
          const textWithoutName = textReceived
            ? textReceived.replace('Name:', '').replaceAll(/[\s]/g, '').slice(0, 16)
            : '';
          const returnObject = { ...state, textInput: textWithoutName ? `Name: ${textWithoutName}` : 'Name: ' };
          if (returnObject.recentColour) returnObject.recentColour.Name = textWithoutName || '';

          return returnObject;
        }
        const { processedText, processedArray, recent } = processText(textReceived || '', state);
        const returnedColours = state.colourMap ? state.colourMap : undefined;
        const { joinedMap: newMap, stringOut } =
          createMap(processedArray, state, processedText, returnedColours) || undefined;
        // //// console.log('stringOut:', stringOut);
        if (hasRecentColour) {
          const preset = getModePreset(state.colourMode);
          const presetText = `${preset}​${stringOut.replace(`​`, '').replace(preset, '')}`;
          const returnValue = {
            ...state,
            textInput: isSubmit ? `${presetText} ` : presetText || '',
            recentColour: recent,
            colourMap: newMap,
          };
          const previousValue = setPreviousContrast(returnValue);
          if (previousValue) returnValue.previousColour = previousValue;

          if (!returnValue.comboBackground) {
            returnValue.comboBackground = undefined;
            if (newMap) {
              const filteredMap = [...newMap.values()].filter((x) => x.Hex !== returnValue.comboForeground?.Hex)[0];

              returnValue.comboBackground = filteredMap || undefined;
            }
          }
          if (!returnValue.comboForeground) {
            returnValue.comboForeground = undefined;
            if (newMap) {
              const filteredMap = [...newMap.values()].filter((x) => x.Hex !== returnValue.comboBackground?.Hex)[0];
              returnValue.comboForeground = filteredMap || undefined;
            }
          }

          return returnValue;
        }
        const returnValue = {
          ...state,
          textInput: isSubmit && stringOut ? `${stringOut} ` : stringOut || '',
          recentColour: recent,
          colourMap: newMap,
        };
        const previousValue = setPreviousContrast(returnValue);
        if (previousValue) returnValue.previousColour = previousValue;

        if (!returnValue.comboBackground) {
          returnValue.comboBackground = undefined;
          if (newMap) {
            const filteredMap = [...newMap.values()].filter((x) => x.Hex !== returnValue.comboForeground?.Hex)[0];

            returnValue.comboBackground = filteredMap || undefined;
          }
        }
        if (!returnValue.comboForeground) {
          returnValue.comboForeground = undefined;
          if (newMap) {
            const filteredMap = [...newMap.values()].filter((x) => x.Hex !== returnValue.comboBackground?.Hex)[0];
            returnValue.comboForeground = filteredMap || undefined;
          }
        }

        return returnValue;
      }
      case 'SUBMIT': {
        // console.log('SUBMIT');
        // // console.log(state.colourMap);
        // state.colourMap?.forEach((map) => // console.log(map.Name));
        // state.colourMap?.forEach((map) => // console.log(map.contrastRatios.size));
        const { colourMode: modeState } = state;
        const isContrastRatioMode = modeState === 'CR';
        if (isContrastRatioMode) return { ...state };

        const recentColourReturn = submitRecentColour(state);
        if (recentColourReturn !== null) return recentColourReturn;

        const newText = state.textInput ? `${state.textInput}\t` : `${action.payload.textInput}\t` || '';
        if (newText === '') return { ...state };
        const { processedText, processedArray, recent } = processText(newText || action.payload.textInput || '', state);
        const returnedColours = state.colourMap ? state.colourMap : undefined;
        const { joinedMap: newMap, stringOut } =
          createMap(processedArray, state, processedText, returnedColours) || undefined;
        const returnValue = {
          ...state,
          textInput: stringOut || '',
          recentColour: recent,
          colourMap: newMap,
          colourMode: 'Name',
        };
        return returnValue;
      }
      case 'SUBMIT_COMBO': {
        // console.log('SUBMIT_COMBO');
        const recentColourReturn = submitRecentColourCombo(state);
        if (recentColourReturn !== null) return recentColourReturn;

        return { ...state };
      }

      case 'UPDATE_HSL': {
        // console.log('UPDATE_HSL');
        const { sliderType: newSliderType } = action.payload;
        const sliderValue = action.payload.hslSlider;
        const previousLuminance = state.hslLuminanceTarget;

        // // console.log('sliderValue:', sliderValue);
        const recentIn = state.recentColour;

        if (recentIn === undefined || sliderValue === undefined || newSliderType === undefined) return { ...state };
        const { Hue, Sat, Lum } = recentIn;
        const newHslArray = getHslArrayFromSlider(sliderValue, newSliderType, [Hue, Sat, Lum]);
        const newHex = colourSpace.convertHslArrayToHex(newHslArray);
        // const previousLuminance = state.recentColour?.luminanceFloat || state.previousColour?.luminance;
        const shouldMatchLuminance =
          typeof previousLuminance === 'number' && typeof newHex === 'string' && newSliderType !== 'Lum';
        if (shouldMatchLuminance) {
          const { resultingHsl } = setToTargetLuminanceHsl(newHslArray, previousLuminance);
          const newObject = makeColourObjectHsl(state, resultingHsl);
          const modeOut = 'HSL';
          const textOutput = newObject ? getRecentTextField(newObject, modeOut) : '';

          const returnValue = {
            ...state,
            textInput: textOutput,
            recentColour: newObject,
            colourMode: modeOut,
            hslSlider: sliderValue,
          };
          const previousContrast = setPreviousContrast(returnValue);
          if (previousContrast !== undefined) returnValue.previousColour = previousContrast;
          return returnValue;
        }

        const recentColourValue: ColourObj | undefined = newHslArray
          ? makeColourObjectHsl(state, newHslArray)
          : undefined;
        const modeOut = 'HSL';
        const textOutput = recentColourValue ? getRecentTextField(recentColourValue, modeOut) : '';
        const returnValue = {
          ...state,
          textInput: textOutput,
          recentColour: recentColourValue,
          colourMode: modeOut,
          hslSlider: sliderValue,
          hslLuminanceTarget: recentColourValue?.luminanceFloat || previousLuminance,
        };
        const previousValue = setPreviousContrast(returnValue);
        if (previousValue) returnValue.previousColour = previousValue;
        return returnValue;
      }
      case 'UPDATE_HSL_COMBO': {
        // console.log('UPDATE_HSL_COMBO');
        const { sliderTypeCombo: newSliderType } = action.payload;
        const sliderValue = action.payload.hslSliderCombo;
        const previousLuminance = state.hslLuminanceTargetCombo;

        // // console.log('sliderValue:', sliderValue);
        const comboBackgroundIn = state.comboBackground;

        if (comboBackgroundIn === undefined || sliderValue === undefined || newSliderType === undefined)
          return { ...state };
        const { Hue, Sat, Lum } = comboBackgroundIn;
        const newHslArray = getHslArrayFromSlider(sliderValue, newSliderType, [Hue, Sat, Lum]);
        const newHex = colourSpace.convertHslArrayToHex(newHslArray);
        // const previousLuminance = state.comboBackground?.luminanceFloat || state.previousColour?.luminance;
        const shouldMatchLuminance =
          typeof previousLuminance === 'number' && typeof newHex === 'string' && newSliderType !== 'Lum';
        if (shouldMatchLuminance) {
          const { resultingHsl } = setToTargetLuminanceHsl(newHslArray, previousLuminance);
          const newObject = makeColourObjectHsl(state, resultingHsl);

          const returnValue = {
            ...state,
            comboBackground: newObject,
            hslSliderCombo: sliderValue,
          };
          const previousContrast = setPreviousContrast(returnValue);
          if (previousContrast !== undefined) returnValue.previousColour = previousContrast;
          return returnValue;
        }

        const recentColourValue: ColourObj | undefined = newHslArray
          ? makeColourObjectHsl(state, newHslArray)
          : undefined;
        const returnValue = {
          ...state,
          comboBackground: recentColourValue,
          hslSliderCombo: sliderValue,
          hslLuminanceTargetCombo: recentColourValue?.luminanceFloat || 17.7,
        };
        const previousValue = setPreviousContrast(returnValue);
        if (previousValue) returnValue.previousColour = previousValue;
        return returnValue;
      }
      case 'SET_TYPE': {
        // console.log('SET_TYPE');

        const typeIn = action.payload.textInput || 'Lum';
        const returnValue = {
          ...state,
          sliderType: typeIn,
        };
        if (state.recentColour?.HSL) returnValue.hslSlider = getSliderValueHslString(state.recentColour.HSL, typeIn);

        const stateLuminance = state.recentColour?.luminanceFloat;
        // // console.log('stateLuminance:', stateLuminance);
        if (typeIn === 'Hue' && typeof stateLuminance === 'number') returnValue.hslLuminanceTarget = stateLuminance;
        return returnValue;
      }
      case 'SET_TYPE_COMBO': {
        // console.log('SET_TYPE');

        const typeIn = action.payload.textInput || 'Lum';
        const returnValue = {
          ...state,
          sliderTypeCombo: typeIn,
        };
        if (state.comboBackground?.HSL)
          returnValue.hslSliderCombo = getSliderValueHslString(state.comboBackground.HSL, typeIn);

        const stateLuminance = state.comboBackground?.luminanceFloat;
        // // console.log('stateLuminance:', stateLuminance);
        if (typeIn === 'Hue' && typeof stateLuminance === 'number')
          returnValue.hslLuminanceTargetCombo = stateLuminance;
        return returnValue;
      }
      case 'MATCH_LUMINANCE': {
        // console.log('MATCH_LUMINANCE');
        const previousLuminance = state.previousColour?.luminanceFloat;
        const recentIn = state.recentColour;

        if (typeof previousLuminance === 'number' && recentIn) {
          const { Hue, Sat, Lum } = recentIn;
          const { resultingHsl } = setToTargetLuminanceHsl([Hue, Sat, Lum], previousLuminance);
          const newColourObject = makeColourObjectHsl(state, resultingHsl);

          const modeOut = state.colourMode ? state.colourMode : 'Hex';
          const textOutput = newColourObject ? getRecentTextField(newColourObject, modeOut) : '';
          const returnValue = {
            ...state,
            textInput: textOutput,
            recentColour: newColourObject,
            hslLuminanceTarget: previousLuminance,
          };
          const previousContrast = setPreviousContrast(returnValue);
          if (previousContrast !== undefined) returnValue.previousColour = previousContrast;
          const sliderTypeCurrent = state.sliderType;
          if (sliderTypeCurrent === 'Lum' && newColourObject !== undefined) {
            returnValue.hslSlider = getSliderValueHslString(newColourObject.HSL, sliderTypeCurrent);
          }

          return returnValue;
        }
        return { ...state };
      }
      case 'CLEAR_TAGS': {
        // console.log('CLEAR_TAGS');
        const newMap = new Map(state.colourMap);
        newMap.clear();
        clearSessionStorageMap();
        const returnValue = {
          ...state,
          colourMap: newMap,
          textInput: '',
          colourMode: 'Hex',
          sliderType: 'Lum',
          recentColour: undefined,
          comboBackground: undefined,
          comboForeground: undefined,
        };
        return returnValue;
      }
      case 'CYCLE_PREVIOUS_COLOUR': {
        // console.log('CYCLE_PREVIOUS_COLOUR');
        const returnState = { ...state };
        const { recentColour: mostRecentColour, colourMap: colourMapCurrent } = state;
        const colourMapKeys = colourMapCurrent && [...colourMapCurrent.keys()];
        const currentKey = action.payload.tag;
        const isBlackWhite = currentKey === '' || currentKey === undefined;
        const hasColourMap = colourMapKeys !== undefined && colourMapKeys.length > 0;
        const recentLum = mostRecentColour?.luminanceFloat;
        if (isBlackWhite && hasColourMap) {
          const firstColour = colourMapCurrent?.get(colourMapKeys[0]);
          const previousColourReturn = setPreviousLuminance(firstColour, recentLum);
          if (previousColourReturn) returnState.previousColour = previousColourReturn;
        }

        if (!isBlackWhite && hasColourMap && currentKey) {
          const currentIndex = colourMapKeys.indexOf(currentKey);
          const isLast = currentIndex === colourMapKeys.length - 1;
          if (isLast || currentIndex === -1) {
            returnState.previousColour = undefined;
            return returnState;
          }
          if (!isLast) {
            const nextColour = colourMapCurrent?.get(colourMapKeys[currentIndex + 1]);
            const previousColourReturn = setPreviousLuminance(nextColour, recentLum);
            if (previousColourReturn) returnState.previousColour = previousColourReturn;
          }
        }
        return returnState;
      }
      case 'CHANGE_COLOUR_MODE': {
        // console.log('CHANGE_COLOUR_MODE');
        const newMode = `${action.payload.colourMode}` || 'Hex';
        const returnValue = { ...state, colourMode: newMode };
        const mostRecentColour = returnValue.recentColour;
        if (mostRecentColour !== undefined && newMode !== 'CR') {
          returnValue.textInput = getRecentTextField(mostRecentColour, newMode);
        }

        const previousColourCurrent = state.previousColour;
        if (previousColourCurrent !== undefined && newMode === 'CR') {
          returnValue.textInput = `Contrast ${previousColourCurrent?.Name}: ${previousColourCurrent?.contrast}`;
        }
        return returnValue;
      }
      case 'CLOSE_TAG':
      default: {
        // console.log('CLOSE_TAG');

        const { tag } = action.payload;
        const newMap = new Map(state.colourMap);
        if (typeof tag === 'string' && newMap.has(tag)) newMap.delete(tag);
        setSessionStorageMap(newMap);
        const returnValue = { ...state, colourMap: newMap };
        if (returnValue.comboBackground?.Hex === tag) {
          returnValue.comboBackground = undefined;
          if (newMap) {
            const filteredMap = [...newMap.values()].filter((x) => x.Hex !== returnValue.comboForeground?.Hex)[0];

            returnValue.comboBackground = filteredMap || undefined;
          }
        }
        if (returnValue.comboForeground?.Hex === tag) {
          returnValue.comboForeground = undefined;
          if (newMap) {
            const filteredMap = [...newMap.values()].filter((x) => x.Hex !== returnValue.comboBackground?.Hex)[0];
            returnValue.comboForeground = filteredMap || undefined;
          }
        }

        return returnValue;
      }
    }
  }
}

const ColourInput = createContext(initialiserContext);
export const useColourInputContext = () => useContext(ColourInput);

export default function ColourInputProvider({ children }: { children: ReactNode }) {
  const data = useData();
  return <ColourInput.Provider value={data}>{children}</ColourInput.Provider>;
}

function valueIsHex(input: string | undefined) {
  if (!input) return false;
  const noSpaces = input.replaceAll(/\s/g, '');
  const returnBoolean = noSpaces.length === 7 && noSpaces.search(/#[0-9a-fA-F]{6}/) > -1;
  return returnBoolean;
}
function getRecentTextField(recentColourObject: ColourObj, modeString: string): string {
  const modeKey = getModeKey(modeString);
  const preset = getModePreset(modeKey);
  const modeIsColour = modeString === 'HSL' || modeString === 'RGB' || modeString === 'Hex';
  const returnString = recentColourObject[modeKey] ? `${recentColourObject[modeKey]}` : '';
  const returnValue = modeIsColour
    ? `${preset}​${returnString.replace(`​`, '').replace(preset, '')}`
    : `${preset}${returnString.replace(preset, '')}`;
  return returnValue;
}

function getModeKey(modeString: string) {
  const lookupKey: { [key: string]: string } = {
    Hex: 'Hex',
    HSL: 'HSL',
    RGB: 'RGB',
    RLum: 'Luminance',
    CRB: 'Black',
    CRW: 'White',
    CR: 'CR',
    Name: 'Name',
  };
  const modeKey = lookupKey[modeString];
  return modeKey;
}

function getModePreset(modeString: string) {
  const presetLookup: { [key: string]: string } = {
    Hex: '#',
    HSL: 'HSL',
    RGB: 'RGB',
    RLum: 'Relative Luminance: ',
    Black: 'Contrast Black: ',
    White: 'Contrast White: ',
    CR: 'Contrast: ',
    Name: 'Name: ',
  };
  const preset = presetLookup[modeString] || '';
  return preset;
}

function submitRecentColour(stateIn: ColourState) {
  const recentState = stateIn.recentColour;
  if (!recentState) return null;
  const newMap = addColourObjectToStorage({ ...recentState }, stateIn.colourMap);
  const returnValue = {
    ...stateIn,
    textInput: getRecentTextField(recentState, 'Name'),
    previousColour: setPreviousLuminance(stateIn.recentColour),
    colourMap: newMap,
    colourMode: 'Name',
  };

  if (!returnValue.comboBackground) {
    returnValue.comboBackground = recentState;
  }
  if (returnValue.comboBackground && !returnValue.comboForeground) {
    returnValue.comboForeground = recentState;
  }

  return returnValue;
}
function submitRecentColourCombo(stateIn: ColourState) {
  const recentState = stateIn.comboBackground;
  if (!recentState) return null;
  const newMap = addColourObjectToStorage({ ...recentState }, stateIn.colourMap);
  const returnValue = {
    ...stateIn,
    textInput: getRecentTextField(recentState, 'Name'),
    colourMap: newMap,
    colourMode: 'Name',
  };
  return returnValue;
}

function processHexString(value: string) {
  const isHex = /^#[0-9a-fA-F]{1,6}$/.test(value);
  if (!isHex) return value;

  if (value.length === 7) return value;
  let modifiedHex = value.length > 7 ? value.slice(0, 7) : value;
  if (value.length < 7) {
    const characters = value.slice(1);
    modifiedHex = modifiedHex.padEnd(7, characters);
  }
  return modifiedHex;
}

function testColourString(
  testString: string,
  prefixLetters: string,
  withinRange: (testValue: number, index: number) => boolean,
) {
  const indexAfterOpenBracket = testString.indexOf('(') + 1;
  const indexOfClosedBracket = testString.indexOf(')');
  const indexOfLetters = testString.toLowerCase().indexOf(prefixLetters);
  const prefix = testString.slice(indexOfLetters, indexAfterOpenBracket).toLowerCase().replaceAll(' ', '');
  const correctPrefix = prefix === `${prefixLetters}(`;
  const endsWithBracket = indexOfClosedBracket > -1;
  const containsTwoCommas = testString.replaceAll(',', '').length + 2 === testString.length;
  const shouldReturn = !correctPrefix || !endsWithBracket || !containsTwoCommas;
  if (shouldReturn) return { isCorrect: false, result: undefined };
  const stringArray = testString.slice(indexAfterOpenBracket, indexOfClosedBracket).replaceAll(/[ %]/g, '').split(',');
  const numberArray = stringArray.map((x) => parseInt(x, 10));
  const booleanResult = numberArray.every(withinRange);
  const arrayResult = booleanResult ? numberArray : undefined;
  return { isCorrect: booleanResult, result: arrayResult };
}
function testRgbString(stringIn: string) {
  const rgb = 'rgb';
  const rangeTest = (testValue: number) => testValue >= 0 && testValue <= 255;

  return testColourString(stringIn, rgb, rangeTest);
}
function testHslString(stringIn: string) {
  const hsl = 'hsl';
  const rangeTest = (testValue: number, index: number) =>
    index === 0 ? testValue >= 0 && testValue <= 360 : testValue >= 0 && testValue <= 100;

  return testColourString(stringIn, hsl, rangeTest);
}

function processRgbString(value: string) {
  const { isCorrect, result } = testRgbString(value);
  if (!isCorrect || result === undefined) return value;

  const hex = colourSpace.convertRgbToHex(result);
  return hex;
}

function processHslString(value: string) {
  const { isCorrect, result } = testHslString(value);
  // //// console.log(isCorrect, result);
  if (!isCorrect || result === undefined) return value;
  const hex = colourSpace.convertHslArrayToHex(result);
  return hex;
}

function processColourStringLong(stringIn: string) {
  if (stringIn.length < 7) return stringIn;
  return processColourString(stringIn);
}
function getRecentColour(text: string, state: ColourState) {
  const testedProcessedText = valueIsHex(text) ? text : processColourStringLong(text);
  const recentColour = valueIsHex(testedProcessedText)
    ? makeColourObject(testedProcessedText, state.colourMap, state.recentColour?.Name)
    : state.recentColour;
  return recentColour;
}

function processColourString(stringIn: string) {
  if (stringIn.includes('#')) return processHexString(stringIn);
  if (stringIn.toLowerCase().includes('hsl')) return processHslString(stringIn);
  if (stringIn.toLowerCase().includes('rgb')) return processRgbString(stringIn);
  return stringIn;
}

function hexReducer(acc: { processedTextArray: string[]; processedArray: string[] }, curr: string) {
  const processedHex = processColourString(curr);
  if (processedHex.length === 7 && processedHex[0] === '#') {
    acc.processedArray.push(processedHex);
    return acc;
  }
  if (curr.length > 0) acc.processedTextArray.push(curr);
  return acc;
}

function processText(text: string, state: ColourState) {
  const isEmpty = text === '';
  if (isEmpty) {
    return emptyTextProcess(state);
  }
  const noQuotesText = text
    .replaceAll(/['":]/g, '')
    .replaceAll('),', ')')
    .replaceAll(/(,[\s]+)/g, '\n')
    .replaceAll(/(,\s*$)/g, '');

  const noCommaSpaceText = text.replaceAll(', ', ',').replaceAll(`​`, '');
  const hasNoSpaces = noCommaSpaceText.search(/\s/) === -1;
  const noSpaceAtEnd = text[text.length - 1].search(/\s/) === -1 && text.search(/[\r\n]/) === -1;
  // const hasRecent = state.recentColour !== undefined;
  // //// console.log('hasRecent:', hasRecent);

  if (hasNoSpaces) {
    return singleTextProcess(noCommaSpaceText, state);
  }

  if (noSpaceAtEnd) {
    return multiRecentProcess(text, state);
  }
  return multiProcess(`${noQuotesText}`);
}

function multiProcess(text: string) {
  // // console.log('multiProcess');
  const splitText = text.replaceAll(', ', ',').split(/\s/);
  // // console.log('splitText:', splitText);
  const { processedTextArray, processedArray } = splitText.reduce(hexReducer, {
    processedTextArray: [],
    processedArray: [],
  });

  if (processedTextArray.length === processedArray.length) {
    // //// console.log('name');
  }

  const processedText = processedTextArray.join(' ');
  return { processedText, processedArray, recent: undefined };
}

function multiRecentProcess(text: string, state: ColourState) {
  // //// console.log('multiRecentProcess');

  const { colourMode } = state;
  const splitText = text.replaceAll(', ', ',').split(/\s/);
  const slicedArray = splitText.slice(0, -1);
  const lastElement = splitText.at(-1)?.replaceAll(',', ', ');
  const recentValue = lastElement && lastElement.length > 0 ? getRecentColour(lastElement, state) : undefined;

  const { processedTextArray, processedArray } = slicedArray.reduce(hexReducer, {
    processedTextArray: [],
    processedArray: [],
  });
  if (recentValue !== undefined) {
    const name = processedTextArray.length >= 1 ? processedTextArray.at(-1) : recentValue.Hex;
    recentValue.Name = name || '';
  }
  // //// console.log(processedTextArray, processedArray, lastElement);
  const processedText = processedTextArray.join(' ');
  const suffixedText = processedText.length > 0 ? `${processedText} ${lastElement}` : `${lastElement}`;
  const textValue = recentValue ? getRecentTextField(recentValue, colourMode) : suffixedText;
  return { processedText: textValue, processedArray, recent: recentValue };
}

function singleTextProcess(text: string, state: ColourState) {
  // //// console.log('singleTextProcess');
  // if (state.recentColour){
  const recentValue = getRecentColour(text, state);
  if (recentValue !== undefined) {
    const name = recentValue.Hex || '';
    recentValue.Name = name;
  }

  const textValue = text;
  return { processedText: `${textValue}`, processedArray: [], recent: recentValue };
  // }

  // return { processedText: text || '', processedArray: [], recent: undefined };
}

function emptyTextProcess(state: {
  textInput: string;
  colourMode: string;
  sliderType: string;
  recentColour: ColourObj | undefined;
  previousColour: PreviousColourObj | undefined;
  colourMap: ColourMap | undefined;
}) {
  // //// console.log('empty', state.recentColour);

  return { processedText: '', processedArray: [], recent: state.recentColour };
}
function findObjectInColourMap(searchValue: string, mapToSearch: ColourMap, nameToAdd: string | undefined) {
  const existingMap = mapToSearch || new Map();
  const foundMap = existingMap && searchValue.length === 7 ? existingMap.get(searchValue) : undefined;
  if (foundMap !== undefined) {
    if (nameToAdd && (valueIsHex(foundMap.Name) || foundMap.Name === undefined)) foundMap.Name = nameToAdd;
    return foundMap;
  }

  return undefined;
}
function removeSpacesSingle(value: string | undefined) {
  if (value) return value.replaceAll(/\s/g, '');
  return value;
}
function removeSpacesArray(arrayOfStrings: Array<string | undefined>) {
  const newArray: Array<string | undefined> = arrayOfStrings.map(removeSpacesSingle);
  return newArray;
}

function getSlicedName(hexIn: string, unslicedName: string | undefined) {
  const [spacelessHex, spacelessName] = removeSpacesArray([hexIn, unslicedName]);
  const shouldReturnHex = !spacelessName || valueIsHex(spacelessName);
  const slicedName = shouldReturnHex && spacelessHex ? spacelessHex : spacelessName?.slice(0, 18);
  return slicedName;
}

export function makeColourObject(hexValue: string, mapIn: ColourMap | undefined, name: string | undefined) {
  const slicedNewName = getSlicedName(hexValue, name);
  const existingMap = mapIn || new Map();
  // //// console.log('existingMap.size:', existingMap?.size);
  if (existingMap.size > 0) {
    const foundObject = findObjectInColourMap(hexValue, existingMap, slicedNewName);
    if (foundObject) return foundObject;
  } // extract below
  const returnObject = createColourObject(hexValue, existingMap, slicedNewName);
  return returnObject;
}
function createColourObject(
  hexValue: string,
  existingMap: ColourMap,
  slicedNewName: string | undefined,
  hslArray?: number[] | undefined,
) {
  const luminanceFloat = luminance.convertHexToLuminance(hexValue);
  const Hex = hexValue.replaceAll(' ', '');
  const [Hue, Sat, Lum] = hslArray || colourSpace.convertHexToHslArray(hexValue);
  const HSL = colourSpace.convertHexToHslString(hexValue);
  const RGB = colourSpace.convertHextoRgbString(hexValue);
  const Luminance = luminance.convertHexToLuminancePercent(hexValue);
  const Black = contrast.getContrastRatio2Dp([0, luminanceFloat]);
  const White = contrast.getContrastRatio2Dp([1, luminanceFloat]);
  const Autocolour = Black > White ? 'Black' : 'White';
  const Name = slicedNewName || Hex;
  const otherColourRatios: undefined | Array<[string, number]> = existingMap
    ? [...existingMap.keys()].map((key) => {
        const otherLuminance = luminance.convertHexToLuminance(key);
        return [key, contrast.getContrastRatio2Dp([luminanceFloat, otherLuminance])];
      })
    : undefined;
  const arrays: Iterable<readonly [string, number]> = otherColourRatios
    ? [['Black', Black], ['White', White], ...otherColourRatios]
    : [
        ['Black', Black],
        ['White', White],
      ];
  const contrastRatios = new Map(arrays);

  const returnObject = {
    luminanceFloat,
    Hex,
    HSL,
    RGB,
    Luminance,
    Black,
    White,
    Autocolour,
    Name,
    contrastRatios,
    Hue,
    Sat,
    Lum,
  };
  return returnObject;
}

function makeColourObjectHsl(state: ColourState, hslResults: number[]) {
  const hex = colourSpace.convertHslArrayToHex(hslResults);
  const stateName = state.recentColour?.Name;
  const slicedNewName = getSlicedName(hex, stateName);
  const existingMap = state?.colourMap || new Map();

  const returnObject = createColourObject(hex, existingMap, slicedNewName, hslResults);
  return returnObject;
}

function createMap(
  hexArray: string[] | undefined,
  state: ColourState,
  processedText: string,
  oldMap: ColourMap | undefined,
) {
  const names = processedText.split(' ');
  // console.log('createMap');
  if (!hexArray || !state) return { joinedMap: oldMap, stringOut: processedText };
  const filteredArray = hexArray.filter(valueIsHex);
  const arrayLength = names.length;
  if (!filteredArray || filteredArray.length === 0) return { joinedMap: oldMap, stringOut: processedText };
  let workingMap = oldMap || new Map();
  const getAtIndex = (index: number) => arrayLength - (filteredArray.length - index);
  filteredArray.forEach((hex, index) => {
    const atIndex = getAtIndex(index);
    const colourObject = makeColourObject(hex, workingMap, names[atIndex]);
    workingMap = addColourObjectToMap(colourObject, workingMap);
    names[atIndex] = '';
  });
  if (workingMap === undefined) return { joinedMap: oldMap, stringOut: processedText };
  if (workingMap) setSessionStorageMap(workingMap);

  const stringOut = names.join('');
  return { joinedMap: workingMap, stringOut };
}

function addColourObjectToMap(newObject: ColourObj, existingMap: ColourMap | undefined) {
  const newMap = existingMap ? new Map([...existingMap]) : new Map();
  const newContrastMap = newObject.contrastRatios;
  const newHex = newObject.Hex;
  newMap.forEach((object) => {
    const currentHex = object.Hex;
    const contrastRatio = newContrastMap.get(currentHex);
    if (contrastRatio) object.contrastRatios.set(newHex, contrastRatio);
  });
  newMap.set(`${newObject.Hex}`, newObject);

  return newMap;
}

function addColourObjectToStorage(newObject: ColourObj, existingMap: ColourMap | undefined) {
  const newMap = existingMap ? new Map([...existingMap]) : new Map();
  // //// console.log('existingMap.size:', existingMap?.size);
  const newContrastMap = newObject.contrastRatios;
  const newHex = newObject.Hex;
  newMap.forEach((object) => {
    const currentHex = object.Hex;
    const contrastRatio = newContrastMap.get(currentHex);
    if (contrastRatio) object.contrastRatios.set(newHex, contrastRatio);
    // //// console.log('object.contrastRatios.size:', object.contrastRatios.size);
  });
  newMap.set(`${newObject.Hex}`, newObject);

  if (newMap) setSessionStorageMap(newMap);
  return newMap;
}

function handleRlumUpdate(state: ColourState, payload: ColourPayload) {
  const textReceived = payload.textInput;
  const isSubmit = /\s/.test(textReceived?.replaceAll(/(, )|(: )/g, '')?.at(-1) || '');
  const textWithoutRLum = textReceived ? textReceived.replace('Relative Luminance:', '').replace(' ', '') : '';
  const recentColourState = state.recentColour;

  if (textReceived && isSubmit) {
    const isPercentage = textWithoutRLum.includes('%');
    const parsedFloat = Math.trunc(parseFloat(textWithoutRLum) * 10) * 0.001;
    const isInRange = parsedFloat >= 0 && parsedFloat <= 1;
    if (!isPercentage || !isInRange) {
      const returnValue = {
        ...state,
        textInput: textWithoutRLum ? `Relative Luminance: ${textWithoutRLum}` : 'Relative Luminance: ',
      };
      return returnValue;
    }

    const recentColourReturn = submitRecentColour(state);
    if (recentColourReturn !== null) return recentColourReturn;
  }

  if (!isSubmit && recentColourState && textReceived) {
    const recentIn = state.recentColour;
    const isPercentage = textWithoutRLum.includes('%');
    const parsedFloat = Math.trunc(parseFloat(textWithoutRLum) * 10) * 0.001;
    const isInRange = parsedFloat >= 0 && parsedFloat <= 1;

    if (isInRange && isPercentage && recentIn) {
      const { Hue, Sat, Lum } = recentIn;
      const { resultingHsl } = setToTargetLuminanceHsl([Hue, Sat, Lum], parsedFloat);
      const newColourObject = makeColourObjectHsl(state, resultingHsl);

      const textValue = newColourObject
        ? getRecentTextField(newColourObject, 'RLum')
        : `Relative Luminance: ${textWithoutRLum}`;
      const returnValue = {
        ...state,
        textInput: textValue || 'Relative Luminance: ',
        recentColour: newColourObject,
      };
      return returnValue;
    }
  }
  const returnValue = {
    ...state,
    textInput: textWithoutRLum ? `Relative Luminance: ${textWithoutRLum}` : 'Relative Luminance: ',
  };
  return returnValue;
}

function setPreviousLuminance(colourObject: ColourObj | undefined, recentLuminance?: number | undefined) {
  const previousLuminance = colourObject?.luminanceFloat;
  if (colourObject && previousLuminance !== undefined) {
    const returnContrast =
      recentLuminance === undefined || previousLuminance === recentLuminance
        ? 1
        : contrast.getContrastRatio2Dp([recentLuminance, previousLuminance]);
    return {
      luminanceFloat: previousLuminance,
      contrast: returnContrast,
      Name: colourObject.Name,
      Hex: colourObject.Hex,
    };
  }

  return undefined;
}

function setPreviousContrast(state: {
  textInput: string;
  colourMode: string;
  sliderType: string;
  recentColour: ColourObj | undefined;
  previousColour: PreviousColourObj | undefined;
  colourMap: ColourMap | undefined;
}) {
  const recentLuminance = state.recentColour?.luminanceFloat;

  const { previousColour } = state;
  const previousLuminance = state.previousColour?.luminanceFloat;
  if (previousColour && typeof recentLuminance === 'number' && typeof previousLuminance === 'number') {
    const ratio = contrast.getContrastRatio2Dp([recentLuminance, previousLuminance]);
    return { luminanceFloat: previousLuminance, contrast: ratio, Name: previousColour.Name, Hex: previousColour.Hex };
  }
  return undefined;
}

function convertSliderToHsl(value: number, sliderType: string) {
  if (sliderType !== 'Hue') return value / 3.6;
  return value;
}

// function stringifyHslArray(ArrayIn: number[]) {
//   const [hue, sat, lum] = ArrayIn;
//   const stringValue = `HSL(${Math.round(hue)}, ${Math.round(sat)}%, ${Math.round(lum)}%)`;
//   return stringValue;
// }

function getHslArrayFromSlider(value: number, sliderType: string, hslArray: number[]) {
  const convertedSliderValue = convertSliderToHsl(value, sliderType);
  const [Hue, Sat, Lum] = hslArray;
  const hslLookUp: { [key: string]: number[] } = {
    Hue: [convertedSliderValue, Sat, Lum],
    Sat: [Hue, convertedSliderValue, Lum],
    Lum: [Hue, Sat, convertedSliderValue],
  };
  // //// console.log(hslLookUp[sliderType]);
  return hslLookUp[sliderType];
}
function parseHslStringToArray(stringIn: string) {
  const arrayValue = stringIn
    .toLowerCase()
    .replaceAll(/[hsl( )%]/g, '')
    .split(',')
    .map((x) => parseInt(x, 10));
  return arrayValue;
}
function convertHslToSlider(value: number, sliderType: string) {
  if (sliderType !== 'Hue') return Math.round(value * 3.6);
  return Math.round(value);
}

function getSliderValueHslString(hslString: string, sliderType: string) {
  const [Hue, Sat, Lum] = parseHslStringToArray(hslString);
  const valueLookup: { [key: string]: number } = {
    Hue,
    Sat,
    Lum,
  };
  const newValue = convertHslToSlider(valueLookup[sliderType], sliderType);
  return newValue;
}

function convertColourArrayToMap(arrayIn: string[][]) {
  const newString = `${arrayIn.map((lineArray) => lineArray.join('\t')).join('\n')}\t`;
  const dummyState = {
    // textInput: `${recentColourValue.Hex}`,
    hslLuminanceTarget: 17.7,
    hslLuminanceTargetCombo: 17.7,
    hslSlider: 0,
    hslSliderCombo: 0,
    textInput: '',
    colourMode: 'Hex',
    sliderType: 'Lum',
    sliderTypeCombo: 'Lum',
    // recentColour: recentColourValue,
    comboBackground: undefined,
    comboForeground: undefined,
    recentColour: undefined,
    previousColour: undefined,
    colourMap: undefined,
  };
  const { processedText, processedArray, recent } = processText(newString, dummyState);
  const returnedColours = dummyState.colourMap ? dummyState.colourMap : undefined;

  const { joinedMap: newMap, stringOut } =
    createMap(processedArray, dummyState, processedText, returnedColours) || undefined;

  const returnValue = {
    ...dummyState,
    textInput: stringOut || '',
    recentColour: recent,
    colourMap: newMap,
    colourMode: 'Name',
  };
  return returnValue;
}
