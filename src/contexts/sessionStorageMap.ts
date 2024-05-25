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
  // const newString = stringifyMap(map);
  stringifyMap(map);

  // if (newString.length > 0) sessionStorage.setItem('colourMap', newString);
}
export function getSessionStorageMap() {
  // const savedString = sessionStorage.getItem('colourMap') ?? undefined;
  // if (savedString === undefined) {
  const searchParams = new URLSearchParams(window.location.search);
  const searchArray = Array.from(searchParams);
  const returnValue = searchArray.length > 0 ? searchArray : undefined;
  // console.log('returnValue:', returnValue);
  return returnValue;
  // }
  // const mapAgain = parseStringToMap(savedString);
  // return mapAgain || undefined;
}
export function clearSessionStorageMap() {
  clearQueryParams();
  // sessionStorage.removeItem('colourMap');
}
function stringifyMap(mapIn: ColourMap) {
  const str = JSON.stringify(mapIn, replacer);
  parseUrlNameHexPairs(str);
  return str;
}
function parseUrlNameHexPairs(str: string) {
  const names = Array.from(str.matchAll(/("Name":"|"Hex":")[^"]+/g)).map((entry) => entry[0]);
  const urlObject: { [key: string]: string } = {};
  for (let i = 0; i < names.length; i += 2) {
    const [objectA, objectB] = [
      names[i].replaceAll(/("Name":"|"Hex":")/g, ''),
      names[i + 1].replaceAll(/("Name":"|"Hex":")/g, ''),
    ];
    const nameIsFirst = objectA.indexOf('#') === -1;
    const name = nameIsFirst ? objectA : objectB;
    const hex = nameIsFirst ? objectB : objectA;
    urlObject[name] = hex;
  }
  // console.log('urlObject:', urlObject);
  addQueryParams(urlObject);
}

// function parseStringToMap(jsonString: string) {
//   const newValue = JSON.parse(jsonString, reviver);
//   return newValue;
// }
function replacer(key: undefined | string, value: ColourMap) {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  }
  return value;
}
// function reviver(
//   key: undefined | string,
//   value: {
//     dataType: string;
//     value: [
//       string,
//       {
//         [key: string]: string | number;
//       },
//     ][];
//   },
// ) {
//   if (typeof value === 'object' && value !== null) {
//     if (value.dataType === 'Map') {
//       return new Map(value.value);
//     }
//   }
//   return value;
// }

function addQueryParams(paramsObject: { [key: string]: string }) {
  // Create a URLSearchParams object with the current search parameters
  const searchParams = new URLSearchParams(window.location.search);

  // Add or update a query parameter
  Object.entries(paramsObject).forEach((entry) => {
    searchParams.set(entry[0], entry[1]);
  });

  // Construct the new URL
  const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${searchParams}`;

  // Replace the current history entry with the new URL
  window.history.replaceState({}, '', newUrl);
}

function clearQueryParams() {
  // Construct the new URL
  const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;

  // Replace the current history entry with the new URL
  window.history.replaceState({}, '', newUrl);
}
