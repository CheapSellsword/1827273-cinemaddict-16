export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomPositiveFloat = (first, second, digits = 1) => {
  const lower = Math.min(Math.abs(first), Math.abs(second));
  const upper = Math.max(Math.abs(first), Math.abs(second));
  const result = Math.random() * (upper - lower) + lower;
  return result.toFixed(digits);
};

export const generateRandomBoolean = () => Boolean(getRandomInteger(0, 1));
export const getRandomItemFromArray = (array) => array[getRandomInteger(0, array.length - 1)];
export const generateDataArray = (elementsCount, randomItem) => Array.from ({length: elementsCount}, randomItem);

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export const compareByField = (field) => {
  if (Array.isArray(field)) {
    return (a,b) => a[field].length < b[field].length ? 1 : -1;
  }
  return (a,b) => a[field] < b[field] ? 1 : -1;
};
