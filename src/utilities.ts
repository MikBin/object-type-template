import { primitive } from "./interfaces";

export const rgNumber = new RegExp(/^[0-9.,]*$/);
export const rgLettersOnly = new RegExp(/'[A-ZÀ-ÚÄ-Ü\s]+'/);
export const rgSpecialChars = new RegExp(/[^.,a-zA-Z0-9 \n\.]/);//excluded comma and dots

export const matchNumber = (num: string): boolean => {
    return rgNumber.test(num);
}

export const primitiveArrayUnion = (arr1: primitive[], arr2: primitive[]): primitive[] => {
    return [...arr1, ...arr2].sort().filter((v, i, arr) => { return i === 0 ? true : arr[i] !== arr[i - 1] });
}

export const primitiveArrayIntersection = (arr1: primitive[], arr2: primitive[]): primitive[] => {
    const l = arr1.length + arr2.length;
    if (l === 1) return [];
    let res = [...arr1, ...arr2].sort().filter((v, i, arr) => {
        if (i > 0 && i < l - 1) return (arr[i] === arr[i - 1] && arr[i] !== arr[i + 1]);
        else if (i === 0) return arr[i] === arr[i + 1];
        else if (i === l - 1) return arr[i] === arr[i - 1];
    });

    return res;
}

/**
 * return an object with same keys and value but alphabetically sorted
 */
export const sortObjectKeys = (obj: object) => {
    const res = <Record<string, object>>{};
    Object.values(obj).sort((a, b) => { return a[0] > b[0] ? 1 : -1 })
        .forEach(([key, value]: [string, any]) => { res[key] = value; });
    return res;
}