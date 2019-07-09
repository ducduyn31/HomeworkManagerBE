export function loadObjectWithRequirements(obj: any, requirements: object) {
  const returnObject = { ...obj };
  for (const requiredKey in requirements) {
    if (!requirements.hasOwnProperty(requiredKey)) {
      continue;
    }

    if (!returnObject[requiredKey]) {
      returnObject[requiredKey] = requirements[requiredKey];
    }
  }

  return returnObject;
}
