import { IPropsStats, MapOfObjectTemplate, ObjectTemplate, primitive, PropsType } from "./interfaces";

export const rgNumber = new RegExp(/^[0-9.,]*$/);
export const rgInteger = new RegExp(/^[0-9]*$/);
export const rgLettersOnly = new RegExp(/'[A-ZÀ-ÚÄ-Ü\s]+'/);
export const rgSpecialChars = new RegExp(/[^.,a-zA-Z0-9 \n\.]/);//excluded comma and dots
export const rgLettersAndNumbers = new RegExp(/^[a-zA-Z0-9_.-]*$/);

/**@TODO match currencies */
export const matchNumber = (num: string): boolean => {
    return rgNumber.test(num);
}

export const matchInteger = (num: string): boolean => {
    return rgInteger.test(num);
}

export const matchLettersOnly = (s: string): boolean => {
    return rgLettersOnly.test(s);
}

export const matchLettersAndNumbers = (s: string): boolean => {
    return rgLettersAndNumbers.test(s);
}

export const matchDate = (s: string) => {
    const d = new Date(s);
    return !isNaN(d.valueOf());
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

export const objectTemplateIsPrimitive = (template: ObjectTemplate): boolean => {
    const value = template.value;
    return !!value.primitive && !value.object && !value.array;
}

/** means it is primitive only or all values are primitive  */
export const objectTemplateIsLeaf = (template: ObjectTemplate): boolean => {

    const isPrimitive = objectTemplateIsPrimitive(template);
    if (isPrimitive) return true;

    const isArrayPrimitive = template.value.array && objectTemplateIsPrimitive(template.value.array);
    if (isArrayPrimitive) return true;

    const isObjectPrimitive = template.value.object && Object.values(template.value.object)
        .reduce((res: boolean, _temp: ObjectTemplate) => { return objectTemplateIsPrimitive(_temp) && res; }, true);

    if (isObjectPrimitive) return true;

    return false;
}

export const entriesSorterFactory = (order: number = 1) => {
    return (A: [string, any], B: [string, any]): number => {
        return order * (A[0] >= B[0] ? 1 : -1);
    }
}

export const removeOptionalProps = (template: ObjectTemplate): ObjectTemplate | null => {
    const templateCopy: ObjectTemplate = { ...template };
    if (template.optional) return null;

    if (templateCopy.types.includes('object')) {
        const obj = { ...templateCopy.value.object };
        templateCopy.value.object = obj;
        Object.entries(<MapOfObjectTemplate>obj).forEach(([prop, val]) => {
            const res = removeOptionalProps(val);
            if (res) Reflect.set(obj, prop, res);
            else Reflect.deleteProperty(obj, prop);
        })
    }

    if (templateCopy.types.includes('array')) {
        const res = removeOptionalProps(<ObjectTemplate>templateCopy.value.array);
        templateCopy.value.array = res;
    }
    if (!!templateCopy.value.array && !!templateCopy.value.object && !!templateCopy.value.primitive) return null;
    return templateCopy;
}

export const stringPropsStats = (props: string[]): IPropsStats => {

    const res = { averageLength: 0, integers: 0, decimals: 0, numbers: 0, strings: 0, dates: 0, lettersAndNumbers: 0, letters: 0 };

    props.forEach((p: string) => {
        res.averageLength += p.length;

        const negative = p.charAt(0) === '-' && p.length > 1;
        const abs = negative ? p.substr(1, p.length) : p;

        const isNumber = matchNumber(abs);
        const isInteger = matchInteger(abs);
        const isDecimal = isNumber && !isInteger;
        if (isInteger) {
            res.integers++;
            res.numbers++;
            //const parsedNum = parseInt(p); the check if are valid dates will be done in a second pass

        } else if (isDecimal) {
            res.decimals++;
            res.numbers++;
        } else if (matchLettersAndNumbers(p)) {
            res.lettersAndNumbers++;
        }
        else if (matchLettersOnly(p)) {
            res.letters++;
        }

        /**if its a number date it wont be a string valid date too */
        if (matchDate(p)) {
            res.dates++;
        }
    })

    res.averageLength /= props.length;

    return res;

}
export const guessPropListNameTypes = (props: string[]): PropsType => {
    return 'number'
}