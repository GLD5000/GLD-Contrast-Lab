export function setSessionStorageMap(map: Map<string, { [key: string]: string | number }>) {
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
function stringifyMap(mapIn: Map<string, { [mapKey: string]: string | number }>) {
  const str = JSON.stringify(mapIn, replacer);
  return str;
}
function parseStringToMap(jsonString: string) {
  const newValue = JSON.parse(jsonString, reviver);
  return newValue;
}
function replacer(key: undefined | string, value: Map<string, { [mapKey: string]: string | number }>) {
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
