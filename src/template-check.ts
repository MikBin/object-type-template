import { isObject } from "lodash";
import { IsJsonable, MapOfObjectTemplate, ObjectTemplate, primitive } from "./interfaces";
import { objectToTemplate } from "./object-to-template";
import { matchNumber } from "./utilities";

//compare source with object template properties and types
export const objectTemplateSimilarity = (source: IsJsonable<object | primitive>, objectTemplate: ObjectTemplate, counter = { match: 0, total: 0, missing: 0, extraneous: 0 })
    : { match: number, total: number, missing: number, extraneous: number } => {

    let sourceType: string = Array.isArray(source) ? "array" : typeof source;
    const sourceIsNull: boolean = sourceType === "object" && source === null;
    if (sourceIsNull) sourceType = "null";
    const sourceIsNumber: boolean = sourceType === "number" || (sourceType === "string" && matchNumber(<string>source));
    if (sourceType !== "number" && sourceIsNumber) sourceType = "number";

    if (!objectTemplate.types.includes(sourceType)) {
        counter.total++;
        counter.missing++;
        return counter;
    }

    const sourceIsArray: boolean = sourceType === "array";
    const sourceIsObject: boolean = sourceType === "object";
    const sourceIsPrimitive: boolean = !sourceIsArray && !sourceIsObject;


    if (sourceIsArray && objectTemplate.types.includes("array")) {

        if (!Array.isArray(source)) { counter.total++; return counter; };
        //if array the model(template) contains an array with just one element representing the type of all array's elements
        let innerModel = objectTemplate.value;
        source.forEach((entrySource) => {
            objectTemplateSimilarity(entrySource, <ObjectTemplate>innerModel.array, counter);
        });


    } else if (sourceIsObject && objectTemplate.types.includes("object")) {

        const templateObjectValue = <MapOfObjectTemplate>objectTemplate.value.object;
        const templateEntries = Object.entries(templateObjectValue);

        if (sourceType !== "object") {
            counter.total += templateEntries.length;
            return counter;
        }

        templateEntries.forEach(([propName, typeValue], idx) => {
            if (Reflect.has(<object>source, propName)) objectTemplateSimilarity(Reflect.get(<IsJsonable<object>>source, propName), typeValue, counter);
            else {
                counter.total++;
                if (!typeValue.optional) counter.missing++;
            }
        });

        /** count extraneous */
        const sourceKeys: string[] = Object.keys(<IsJsonable<object>>source);
        counter.extraneous += sourceKeys.reduce((prev, curr) => {
            return prev + (Reflect.has(templateObjectValue, curr) ? 0 : 1);
        }, 0);

    } else if (sourceIsPrimitive) {
        //primitive
        let match = objectTemplate.types.includes(sourceType);
        if (match) counter.match++;
        else counter.missing++;
        counter.total++;
    }

    return counter;

}
