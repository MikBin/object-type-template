/**
 * check how much two tempaltes are similar:
 * for each props controls types match and naming
 * could use string similarity as optional argument for naming check
 * to speedup comparison for big map of similar object merge all templates then compare the merged one against all others
 * or compare in chain 1vs2 2vs3 ... at each step similarity percent should be very close and above threshold
 */

import { MapOfObjectTemplate, ObjectTemplate } from "./interfaces";
import { entriesSorterFactory, primitiveArrayIntersection, primitiveArrayUnion } from "./utilities";

export const sameTypes = (typesA: string[], typesB: string[]): boolean => {
    return typesA.reduce((res: boolean, type: string) => { return res && typesB.includes(type); }, true);
}

export const typesMatchCount = (typesA: string[], typesB: string[]): number => {
    return typesA.reduce((res: number, type: string) => { return res + (typesB.includes(type) ? 1 : 0); }, 0);
}

/**when a series of templates are very similar then merge to get just one type
 * in case of object can be used to store a stringTMap type 
 */

export const templateSimilarity = (templateA: ObjectTemplate, templateB: ObjectTemplate): { total: number, match: number } => {

    const counter = { total: Math.max(templateA.types.length, templateB.types.length), match: 0 };
    counter.match = typesMatchCount(templateA.types, templateB.types);
    let sameType = counter.match === counter.total;
    if (!sameType) return counter;

    //count array and object subtype simlarity
    const hasObject = !!templateA.value.object;
    const hasArray = !!templateA.value.array;
    const justOneObjectMap = templateA.value.isObjectMap || templateB.value.isObjectMap;
    const bothObjectMap = templateA.value.isObjectMap && templateB.value.isObjectMap;


    if (hasObject) {
        const objectA = <MapOfObjectTemplate>templateA.value.object;
        const objectB = <MapOfObjectTemplate>templateB.value.object;
        const keysA = Object.keys(objectA);
        const keysB = Object.keys(objectB);

        if (justOneObjectMap) {
            counter.total += Math.max(keysA.length, keysB.length);
        } else {
            const keysDiff = [...keysA.filter(k => !Reflect.has(objectB, k)), ...keysB.filter(k => !Reflect.has(objectA, k))];
            const keysCommon = <string[]>primitiveArrayIntersection(keysA, keysB);

            keysCommon.forEach((key, idx) => {

                const { match, total } = templateSimilarity(<ObjectTemplate>objectB[key], <ObjectTemplate>objectA[key]);
                counter.match += match;
                counter.total += total;

            });

            counter.total += keysDiff.length;
        }

    }

    if (hasArray) {
        const { match, total } = templateSimilarity(<ObjectTemplate>templateA.value.array, <ObjectTemplate>templateB.value.array);
        counter.match += match;
        counter.total += total;
    }

    return counter;
}