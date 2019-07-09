export function pickProperties(
  object: object,
  properties: string[],
  defaultValueMap?: object,
) {
  const returnObject = {};

  Array.from(properties).forEach(prop => (returnObject[prop] = object[prop] || defaultValueMap[prop]));

  return returnObject;
}
