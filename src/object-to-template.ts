import { matchNumber } from './utilities';
import * as _ from 'lodash';
import { ObjectTemplate, ValueTemplate, MapOfObjectTemplate, Primitive } from './interfaces';

const valueTemplateFactory = (): ValueTemplate => ({ primitive: null, object: null, array: null });
const objectTemplateFactory = (): ObjectTemplate => ({ types: [], value: valueTemplateFactory(), optional: false });
//aux functions
const getTemplateValue = (template: ObjectTemplate, idx = 0) => Array.isArray(template.value) ? template.value[idx] : template.value;

export const mergeTemplates = (templateA: ObjectTemplate, templateB: ObjectTemplate) => {

    /**if always present ==> not optional else optional=true */
    const aTypes = templateA.types;
    const bTypes = templateB.types;
    const types = _.union(templateA.types, templateB.types);
    const optional = templateA.optional || templateB.optional || false; //in intersection this props wont exists
    let value: ValueTemplate = valueTemplateFactory();

    const aHasObject = aTypes.includes('object');
    const bHasObject = bTypes.includes('object');
    const aHasArray = aTypes.includes('array');
    const bHasArray = bTypes.includes('array');
    const bothHaveArray = aHasArray && bHasArray;
    const bothHaveObject = aHasObject && bHasObject;
    const notDoubleObjOrArray = !bothHaveArray && !bothHaveObject;
    const aValue = templateA.value;
    const bValue = templateB.value;

    if (bothHaveObject) {

        const obj: MapOfObjectTemplate = value.object = {};

        const aKeys: string[] = Object.keys(<{}>aValue.object);
        const bKeys: string[] = Object.keys(<{}>bValue.object);

        aKeys.forEach((k, i) => {
            const bObject = <MapOfObjectTemplate>bValue.object;
            const aObject = <MapOfObjectTemplate>aValue.object;

            if (Reflect.has(bObject, k)) {

                const merged: ObjectTemplate = obj[k] = mergeTemplates(Reflect.get(bObject, k), Reflect.get(aObject, k));
                //@ts-ignore
                merged.optional = bObject.optional || aObject.optional || false;

            } else {
                obj[k] = Reflect.get(<MapOfObjectTemplate>aValue.object, k);
                obj[k].optional = true;
            }
        });

        bKeys.forEach((k, i) => {
            if (!Reflect.has(<MapOfObjectTemplate>aValue.object, k)) {
                obj[k] = Reflect.get(<MapOfObjectTemplate>bValue.object, k);
                obj[k].optional = true;
            }
        });

    }

    //both arrays
    if (bothHaveArray) {
        //recoursive call
        value.array = mergeTemplates(<ObjectTemplate>aValue.array, <ObjectTemplate>bValue.array);
    }

    //array and object have not to be merged just straight copy
    if (notDoubleObjOrArray) {
        value.array = aValue.array || bValue.array || null;
        value.object = aValue.object || bValue.object || null;
    }

    //primitive must be merged anyway
    if (aValue.primitive && bValue.primitive) {
        value.primitive = _.union(aValue.primitive, bValue.primitive);
    } else {
        value.primitive = aValue.primitive || bValue.primitive || null;
    }

    let res = { types, value, optional };

    return res;
}

export const intersectTemplates = (templateA: ObjectTemplate, templateB: ObjectTemplate) => { }

export const intersectManyTemplates = (_templatesList: ObjectTemplate[]) => { }

export const mergeManyTemplates = (_templatesList: ObjectTemplate[]) => {
    const templatesList = [..._templatesList];
    let last = templatesList.pop();
    if (templatesList.length <= 0) return last;
    return templatesList.reduce((prev, curr) => mergeTemplates(curr, <ObjectTemplate>prev), last);
}

/**@TODO functions must be skipped or an error must be thrown same holds for Symbols
 * ==> number string boolean object array null
 */
/**
 each one of the above enrty could be null if the corresponding type is not present
 @TODO pass propcounter???
 @TODO use a set to catch curcular references
 */
export const objectToTemplate = (source: object | Primitive/** arrayTemplateMode:merge/intersect */) => {

    /**
     * other json to typescript:
     * https://jvilk.com/MakeTypes/
     * https://github.com/jvilk/maketypes
     * http://json2ts.com/
     * get idea for naming
     */
    const res = objectTemplateFactory();

    const sourceType: string = typeof source;

    if (Array.isArray(source)) {
        /**SOURCE IS AN ARRAY */

        const templates = source.map((entry, idx) => {
            return objectToTemplate(entry);
        });

        const template: ObjectTemplate = <ObjectTemplate>mergeManyTemplates(templates);
        res.types = ["array"];
        res.value.array = template;

        return res;

    } else if (source !== null && sourceType === "object") {
        /**SOURCE IS OBJECT */
        const entries = Object.entries(source);
        res.types = ["object"];
        res.value = valueTemplateFactory();
        res.value.object = {};
        const SOURCE_VALUE = res.value.object;

        entries.forEach(([prop, propValue], idx) => {
            const propType = typeof propValue;
            Reflect.set(<MapOfObjectTemplate>SOURCE_VALUE, prop, objectToTemplate(propValue));
        });

    } else if (source === null) {
        //an object can be null
        res.types = ['null'];
        res.value.primitive = ["null"];
    } else {
        //primitive type
        const _sourceType = sourceType === "string" && matchNumber(<string>source) ? "number" : sourceType;

        res.types = [_sourceType];
        res.value.primitive = [_sourceType];
    }

    return res;
}