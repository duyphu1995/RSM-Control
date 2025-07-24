export function deepCompareObjects(obj1: any, obj2: any): boolean {
  // 1. Strict equality check: If they are the same reference or primitive equal, return true.
  // This covers null, undefined, numbers, strings, booleans, and identical object references.
  if (obj1 === obj2) {
    return true;
  }

  // 2. Type check: If types are different or either is null/not an object, they are not equal.
  // Note: typeof null is 'object', so we explicitly check for null.
  if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) {
    return false;
  }

  // 3. Array check: If both are arrays, compare their lengths and then their elements.
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) {
      return false;
    }
    for (let i = 0; i < obj1.length; i++) {
      if (!deepCompareObjects(obj1[i], obj2[i])) {
        return false;
      }
    }
    return true; // All array elements are deeply equal
  }

  // If one is an array and the other is not, they are not equal.
  if (Array.isArray(obj1) !== Array.isArray(obj2)) {
    return false;
  }

  // 4. Object check: Compare their keys and then the values associated with those keys.
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // If number of keys differs, objects are not equal.
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Check if all keys from obj1 exist in obj2 and their corresponding values are deeply equal.
  for (const key of keys1) {
    // Check if key exists in obj2 and then deeply compare values.
    // Use hasOwnProperty to avoid comparing inherited properties.
    if (!Object.prototype.hasOwnProperty.call(obj2, key) || !deepCompareObjects(obj1[key], obj2[key])) {
      return false;
    }
  }

  // If all checks pass, the objects are deeply equal.
  return true;
}
