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