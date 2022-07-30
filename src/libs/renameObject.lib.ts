export const renameKey = (object: any, key: string, newKey: string) => {
  const clonedObj: Record<string, unknown> = clone(object);

  const targetKey = clonedObj[key];

  delete clonedObj[key];

  clonedObj[newKey] = targetKey;

  return clonedObj;
};

const clone = (object) => Object.assign({}, object);
