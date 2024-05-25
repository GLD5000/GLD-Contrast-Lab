// interface StrNumObj {
//   [key: string]: string | number;
// }
interface ColourObj {
  luminanceFloat: number;
  Hex: string;
  HSL: string;
  RGB: string;
  Luminance: string;
  Black: number;
  White: number;
  Name: string;
  contrastRatios: Map<string, number>;
}
type ColourMap = Map<string, ColourObj>;

export function setSessionStorageMap(map: ColourMap) {
  const newString = stringifyMap(map);

  if (newString.length > 0) sessionStorage.setItem('colourMap', newString);
}
export function getSessionStorageMap() {
  const savedString = sessionStorage.getItem('colourMap') ?? undefined;
  if (savedString === undefined) return undefined;
  const mapAgain = parseStringToMap(savedString);
  return mapAgain || undefined;
}
export function clearSessionStorageMap() {
  sessionStorage.removeItem('colourMap');
}
function stringifyMap(mapIn: ColourMap) {
  const str = JSON.stringify(mapIn, replacer);
  console.log('str:', str);
  const names = Array.from(str.matchAll(/("Name":"|"Hex":")[^"]+/g)).map((entry) => entry[0]);
  console.log('names:', names);
  const urlObject: { [key: string]: string } = {};
  for (let i = 0; i < names.length; i += 2) {
    const [objectA, objectB] = [
      names[i].replaceAll(/("Name":"|"Hex":")/g, ''),
      names[i + 1].replaceAll(/("Name":"|"Hex":")/g, ''),
    ];
    const nameIsFirst = objectA.indexOf('#') === -1;
    const name = nameIsFirst ? objectA : objectB;
    const hex = nameIsFirst ? objectB : objectA;
    console.log('name:', name);
    urlObject[name] = hex;
  }
  console.log('urlObject:', urlObject);
  return str;
}
function parseStringToMap(jsonString: string) {
  const newValue = JSON.parse(jsonString, reviver);
  return newValue;
}
function replacer(key: undefined | string, value: ColourMap) {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  }
  return value;
}
function reviver(
  key: undefined | string,
  value: {
    dataType: string;
    value: [
      string,
      {
        [key: string]: string | number;
      },
    ][];
  },
) {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}
