export const camelToSnake = (str: string): string => {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  };
  
  export const convertKeysToSnakeCase = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj.map(v => convertKeysToSnakeCase(v));
    } else if (obj !== null && obj.constructor === Object) {
        return Object.keys(obj).reduce((result, key) => {
            const newKey = camelToSnake(key);
            result[newKey] = convertKeysToSnakeCase(obj[key]);
            return result;
        }, {} as any);
    }
    return obj;
  };